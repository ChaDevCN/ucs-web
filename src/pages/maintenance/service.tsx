import { Tooltip } from 'antd';

import request from '@/utils/request';

export interface Maintenance {
	id: number;
	name: string;
	description: string;
	company: string;
	region: string;
	email: string;
	status: Status | null;
	attachments: Attachment[];
	createdAt: number;
	updatedAt: number;
}

export interface Attachment {
	id: number;
	type: string;
	url: string;
}
export interface ResponseMaintenance {
	list: Maintenance[];
	total: number;
	currentPage: number;
	pageSize: number;
}

export interface MaintenanceDrawerType {
	id: number | null;
	type: string | null;
}
export type Status = 1 | 2 | 3 | 4 | 5;
export const statusMap = {
	1: {
		label: '未开始',
		color: 'blue'
	},
	2: {
		label: '处理中',
		color: 'cyan'
	},
	3: {
		label: '已完成',
		color: 'green'
	},
	4: {
		label: '已取消',
		color: 'red'
	},
	5: {
		label: '已关闭',
		color: 'volcano'
	}
};

export const regionMap = [
	{
		value: 'China',
		email: 'service.apac@cm-energy.com'
	},
	{
		value: 'Europe',
		email: 'service.europe.africa@cm-energv.com'
	},
	{
		value: 'Africa',
		email: 'service.europe.africa@cm-energy.com'
	},
	{
		value: 'North America',
		email: 'service.north.america@cm-energy.com'
	},
	{
		value: 'Latin America',
		email: 'service.latin.america@cm-energv.com'
	},
	{
		value: 'Asia',
		email: 'service.apac@cm-energy.com'
	},
	{
		value: 'Oceanian',
		email: 'service.apac@cm-energv.com'
	},
	{
		value: 'Middle East',
		email: 'service.middle.east@cm-energv.com'
	}
];
export const TooltipText = ({
	text,
	className
}: {
	text: React.ReactNode;
	className?: string;
}) => {
	return text ? (
		<Tooltip title={text} className={`${className} truncate inline-block`}>
			{text}
		</Tooltip>
	) : (
		'-'
	);
};

export const getMaintenanceList = (params: any) => {
	return request<ResponseMaintenance>({
		url: '/maintenance',
		method: 'GET',
		params
	});
};

export const updateMaintenance = (id: number, data: Maintenance) => {
	return request({
		url: `/maintenance/${id}`,
		method: 'PATCH',
		data
	});
};

export const deleteMaintenance = (id: number) => {
	return request({
		url: `/maintenance/${id}`,
		method: 'DELETE'
	});
};

export const findMaintenanceById = (id: number) => {
	return request<Maintenance>({
		url: `/maintenance/${id}`,
		method: 'GET'
	});
};
