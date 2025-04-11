import request from '@/utils/request';

export interface SignInParams {
	username: string;
	password: string;
	remember: boolean;
}

export interface SignInResponse {
	accessToken: string;
	refreshToken: string;
}

export interface SignUpParams {
	username: string;
	password: string;
	email?: string;
	roles?: string[];
	nickname?: string;
}
export const signIn = (data: SignInParams) => {
	const { username, password } = data;
	return request<SignInResponse>({
		url: '/auth/signin',
		method: 'POST',
		data: {
			username,
			password
		}
	});
};

export const signUp = (data: SignUpParams) => {
	return request<Omit<SignUpParams, 'password'>>({
		url: '/auth/signup',
		method: 'POST',
		data
	});
};
