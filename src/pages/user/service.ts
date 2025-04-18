import request from '@/utils/request';

import { Menu, TableParams } from '@/types/global-service';

export interface User {
	id: number;
	username: string;
	nickName: string;
	email: string | null;
	avatar: string | null;
	isActive: boolean;
	metadata?: object;
	createTime: number;
	updateTime: number;
	combined: {
		menus: Menu[];
	};
}

export interface AddUserProps {
	isModalOpen: boolean;
	setIsModalOpen: (isModalOpen: boolean) => void;
}
export interface UserListResponse {
	total: number;
	list: User[];
	current: number;
	pageSize: number;
}
export const getUserList = async (params: TableParams) =>
	await request<UserListResponse>({
		method: 'get',
		url: '/user',
		params
	});
