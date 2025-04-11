export type FieldType = {
	username?: string;
	password?: string;
	remember?: string;
};
export type Login = {
	username: string;
	password: string;
};
export interface Profile {
	userInfo: UserInfo;
	access_token: string;
}

export interface UserInfo {
	userId: number;
	username: string;
	name: string;
	email: string;
}
export interface Item {
	id: number;
	name: string;
	password: string;
	phone: string;
	username: string;
	email: string;
	avatarUrl: string;
	avatarThumb: string;
	avatarBig: string;
	avatarMiddle: string;
	mobile: string;
	enName: string;
	feishuUnionId: string;
	feishuUserId: string;
	departmentName: string;
	departmentId: string;
	status: number;
	updateTime: string;
}

export interface Meta {
	pageSize: number;
	totalCounts: number;
	totalPages: number;
	currentPage: number;
}
export interface Userlist {
	items: Item[];
	meta: Meta;
}
