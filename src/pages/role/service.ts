import request from '@/utils/request';

export interface Role {
	id: number;
	name: string;
	description?: string;
	users?: any[];
	RolePermissions?: any[];
	RolePolicy?: any[];
	RoleMenu?: any[];
}

export interface RoleQueryParams {
	current: number;
	pageSize: number;
}

export interface RoleListResponse {
	list: Role[];
	total: number;
	current: number;
	pageSize: number;
}

export const getRoleList = (params: RoleQueryParams) => {
	return request<RoleListResponse>({
		url: '/role',
		method: 'GET',
		params
	});
};

export const createRole = (data: Partial<Role>) => {
	return request<Role>({
		url: '/roles',
		method: 'POST',
		data
	});
};

export const updateRole = (id: number, data: Partial<Role>) => {
	return request<Role>({
		url: `/roles/${id}`,
		method: 'PUT',
		data
	});
};

export const deleteRole = (id: number) => {
	return request({
		url: `/roles/${id}`,
		method: 'DELETE'
	});
};

export const getRolePermissions = (id: number) => {
	return request({
		url: `/roles/${id}/permissions`,
		method: 'GET'
	});
};

export const updateRolePermissions = (
	id: number,
	data: { permissionIds: number[] }
) => {
	return request({
		url: `/roles/${id}/permissions`,
		method: 'PUT',
		data
	});
};

export const getRoleMenus = (id: number) => {
	return request({
		url: `/roles/${id}/menus`,
		method: 'GET'
	});
};

export const updateRoleMenus = (id: number, data: { menuIds: number[] }) => {
	return request({
		url: `/roles/${id}/menus`,
		method: 'PUT',
		data
	});
};
