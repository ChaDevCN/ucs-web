import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import request from './request';

import { SignInResponse } from '@/pages/login/service';
import { Menu } from '@/types/global-service';
export const modules = import.meta.webpackContext('../pages', {
	regExp: /\/index\.tsx$/,
	recursive: true
});

export const CompsNameMap: Record<string, any> = {};
export const CompsPathMap: Record<string, any> = {};
for (const path of modules.keys()) {
	const mod = modules(path) as { [key: string]: React.FC | undefined };
	if (path !== 'Example') {
		const nextPath = path.replace(/\/index\.tsx$/, '').replace('./', '/pages/');
		CompsPathMap[nextPath] = mod[path] ?? mod.default;
		CompsNameMap[path] = mod[path] ?? mod.default;
	}
}

export const getToken = () => localStorage.getItem(ACCESS_TOKEN);

export const setToken = (token: string) => {
	localStorage.setItem(ACCESS_TOKEN, token);
};
export const removeToken = () => {
	localStorage.removeItem(ACCESS_TOKEN);
};

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN);

export const setRefreshToken = (token: string) => {
	localStorage.setItem(REFRESH_TOKEN, token);
};

export const removeRefreshToken = () => {
	localStorage.removeItem(REFRESH_TOKEN);
};

export const refreshToken = async () =>
	await request<SignInResponse>({
		data: {
			refreshToken: getRefreshToken()
		},
		method: 'POST',
		url: '/auth/refresh-token',
		validateStatus: () => true
	});

export const withMinDelay = <T>(
	promise: Promise<T>,
	delay = 200
): Promise<T> => {
	return Promise.all([
		promise,
		new Promise((resolve) => setTimeout(resolve, delay))
	]).then(([result]) => result);
};

/** 扁平化菜单 */
export const flatMenus = (menus: Menu[]) => {
	return menus.reduce((prev, menu: Menu) => {
		prev.push(menu);
		if (menu.children) {
			prev.push(...flatMenus(menu.children));
		}
		return prev;
	}, [] as Menu[]);
};
