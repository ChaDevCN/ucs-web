import { message } from 'antd';
import axios from 'axios';
import {
	type AxiosInstance,
	InternalAxiosRequestConfig,
	AxiosRequestConfig,
	AxiosResponse,
	AxiosError
} from 'axios';
import axiosRetry from 'axios-retry';

import { getToken, refreshToken, setToken, setRefreshToken } from './utils';

import { toLoginPage } from '@/router/router-utils';

export type RequestResponse<T> = {
	status: number;
	message: string;
	success: boolean;
	data: T;
};
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	disableRetry?: boolean;
}

interface PendingTask {
	config: AxiosRequestConfig;
	resolve: (value: any) => void;
}
let refreshing = false;
const queue: PendingTask[] = [];

const whiteRetry = new Set(['ECONNABORTED', undefined, 0]);

const serviceAxios = axios.create({
	baseURL: BASE_URL,
	timeout: 15 * 1000,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json;charset=utf-8'
	},
	validateStatus: (status) => status !== 401
});

axiosRetry(serviceAxios, {
	retries: 2,
	shouldResetTimeout: true,
	retryDelay: (retryCount) => {
		return retryCount * 10000;
	},
	retryCondition: (err) => {
		const config = err.config as CustomAxiosRequestConfig;
		if (config.disableRetry) {
			return false;
		}
		const { code, message } = err;
		return whiteRetry.has(<string>code) || message.includes('timeout');
	}
});

serviceAxios.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token = getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(err: AxiosError) => {
		return Promise.reject(err);
	}
);

serviceAxios.interceptors.response.use(
	(response: AxiosResponse) => {
		message.destroy();
		switch (response.status) {
			case 504:
				message.error('请求超时，请稍后再试');
				break;
			case 500:
				message.error(response.data.message);
				break;
		}
		if (response.data.status !== 200) {
			return Promise.reject(response.data);
		}
		return response.data;
	},
	async (error) => {
		// 只有401才会进入到这里
		const { data, config } = error.response;

		if (refreshing) {
			return new Promise((resolve) => {
				queue.push({
					config,
					resolve
				});
			});
		}

		if (!config.url.includes('/auth/refresh-token')) {
			refreshing = true;
			try {
				const res = await refreshToken();
				if (res.status === 200) {
					const { accessToken, refreshToken } = res.data as {
						accessToken: string;
						refreshToken: string;
					};
					setToken(accessToken);
					setRefreshToken(refreshToken);

					queue.forEach(({ config, resolve }) => {
						config.headers = {
							...config.headers,
							Authorization: `Bearer ${accessToken}`
						};
						serviceAxios(config)
							.then((response) => {
								if (response.status === 200) {
									resolve(response.data);
								} else {
									resolve(Promise.reject(response));
								}
							})
							.catch((error) => {
								resolve(Promise.reject(error));
							});
					});
					queue.length = 0;

					config.headers = {
						...config.headers,
						Authorization: `Bearer ${accessToken}`
					};
					return serviceAxios(config);
				}
			} catch (error) {
				alert('登录过期，请重新登录');
				toLoginPage();
				return Promise.reject(error);
			} finally {
				refreshing = false;
			}
		}
		return Promise.reject(data);
	}
);
function createRequest(service: AxiosInstance) {
	return function <T>(
		config: CustomAxiosRequestConfig
	): Promise<RequestResponse<T>> {
		return service(config);
	};
}

export default createRequest(serviceAxios);
