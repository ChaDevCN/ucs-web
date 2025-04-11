export interface Menu {
	id: number;
	name: string;
	path: string;
	component: string;
	redirect: string | null;
	fullPath: string;
	alias: string | null;
	label: string;
	parentId: number | null;
	Meta: {
		id: number;
		title: string;
		layout: string | null;
		icon: string;
		hideMenu: boolean;
		order: number;
	};
	children: Menu[];
	order: number;
}

export enum MenuType {
	DIRECTORY = 1,
	MENU,
	BUTTON,
	LowCodePage
}

export interface TableParams {
	current: number;
	pageSize: number;
	sorter?: any;
	filters?: any;
	search?: string;
}
