import request from '@/utils/request';

import { TableParams } from '@/types/global-service';

export interface MenuFormData {
	name?: string;
	path: string;
	component?: string;
	redirect?: string;
	fullPath?: string;
	alias?: string;
	label?: string;
	parentId?: number;
	meta?: {
		title?: string;
		layout?: string;
		order?: number;
		icon?: string;
		hideMenu?: boolean;
		disabled?: boolean;
	};
}

export interface MenuResponse extends MenuFormData {
	id: number;
	meta?: {
		id: number;
		title?: string;
		layout?: string;
		order?: number;
		icon?: string;
		hideMenu?: boolean;
		disabled?: boolean;
		menuId: number;
	};
}

export interface MenuListResponse {
	list: MenuResponse[];
	total: number;
	current: number;
	pageSize: number;
}

export const getMenuList = async (params: TableParams) =>
	request<MenuListResponse>({
		url: 'menu',
		method: 'get',
		params
	});

export const getMenuDetail = async (id: number) =>
	request<MenuResponse>({
		url: `menu/${id}`,
		method: 'get'
	});

export const createMenu = async (data: MenuFormData) =>
	request<MenuResponse>({
		url: 'menu',
		method: 'post',
		data
	});

export const updateMenu = async (id: number, data: MenuFormData) =>
	request<MenuResponse>({
		url: `menu/${id}`,
		method: 'put',
		data
	});
