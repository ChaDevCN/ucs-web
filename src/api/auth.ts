import request from '@/utils/request';

import { User } from '@/pages/user/service';
export const getCurrentUser = () => {
	return request<User>({
		url: 'auth',
		method: 'GET'
	});
};
