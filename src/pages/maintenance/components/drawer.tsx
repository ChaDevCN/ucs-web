import {
	ProForm,
	ProFormSelect,
	ProFormText,
	ProFormTextArea
} from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Badge, DescriptionsProps, Image, message } from 'antd';
import { Drawer, Descriptions } from 'antd';
import dayjs from 'dayjs';

import '../index.less';
import {
	findMaintenanceById,
	Maintenance,
	regionMap,
	statusMap,
	updateMaintenance,
	type MaintenanceDrawerType
} from '../service';

import AttachmentViewer from './AttachmentViewer';

const LookDrawer = ({ id, data }: { id: number; data: Maintenance }) => {
	const items: DescriptionsProps['items'] = [
		{
			label: '联系人',
			children: data?.name || '-'
		},
		{
			label: '邮箱',
			children: data?.email || '-',
			span: 'filled'
		},
		{
			label: '创建时间',
			children: (
				<div>{dayjs(data?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
			),
			span: 'filled'
		},
		{
			label: '区域',
			children: data?.region || '-',
			span: 'filled'
		},
		// {
		// 	label: '状态',
		// 	span: 'filled',
		// 	children: (
		// 		<>
		// 			{data?.status ? (
		// 				<Badge
		// 					color={statusMap[data?.status as keyof typeof statusMap].color}
		// 					text={statusMap[data?.status as keyof typeof statusMap].label}
		// 				/>
		// 			) : (
		// 				'-'
		// 			)}
		// 		</>
		// 	)
		// },
		{
			label: '描述',
			children: (
				<div className=" whitespace-pre-wrap">{data?.description || '-'}</div>
			),
			span: 'filled'
		},
		{
			label: '附件',
			span: 'filled',
			children: <AttachmentViewer attachments={data?.attachments || []} />
		}
	];
	return <Descriptions bordered items={items} />;
};

const EditDrawer = ({
	data,
	id,
	onClose
}: {
	data: Maintenance;
	id: number;
	onClose: () => void;
}) => {
	const { run, loading } = useRequest(
		(params) => updateMaintenance(id, params),
		{
			manual: true,
			onSuccess: () => {
				message.success('更新成功');
				onClose();
			}
		}
	);
	const handleFinish = (values: Maintenance) => {
		const nextValues = Object.keys(values).reduce((acc, key) => {
			if (values[key as keyof Maintenance] !== null) {
				acc[key as keyof Maintenance] = values[key as keyof Maintenance];
			}
			return acc;
		}, {} as any);
		run({
			...data,
			...nextValues
		});
	};

	return (
		<ProForm
			className="maintenance-form"
			onFinish={handleFinish}
			disabled={loading}
			loading={loading}
		>
			<ProForm.Group>
				<ProFormText
					label="联系人"
					name="name"
					colProps={{ span: 24 }}
					initialValue={data?.name}
				></ProFormText>
			</ProForm.Group>
			<ProForm.Group>
				<ProFormText
					label="邮箱"
					name="email"
					initialValue={data?.email}
				></ProFormText>
			</ProForm.Group>
			<ProForm.Group>
				<ProFormSelect
					label="区域"
					name="region"
					options={regionMap.map((item) => ({
						label: item.value,
						value: item.value
					}))}
					initialValue={data?.region}
				></ProFormSelect>
			</ProForm.Group>
			{/* <ProForm.Group>
				<ProFormSelect
					label="状态"
					name="status"
					options={Object.keys(statusMap).map((key) => ({
						label: statusMap[+key as keyof typeof statusMap].label,
						value: +key
					}))}
					initialValue={data?.status || null}
				></ProFormSelect>
			</ProForm.Group> */}
			<ProForm.Group>
				<ProFormTextArea
					label="描述"
					name="description"
					initialValue={data?.description}
				></ProFormTextArea>
			</ProForm.Group>
		</ProForm>
	);
};

export const MaintenanceDrawer = ({
	open,
	onClose,
	data
}: {
	open: boolean;
	onClose: () => void;
	data: MaintenanceDrawerType | null;
}) => {
	if (data && data.id) {
		const {
			data: maintenanceData,
			loading,
			run
		} = useRequest(() => findMaintenanceById(data?.id as number), {
			refreshDeps: [open],
			refreshDepsAction: () => {
				if (open) {
					run();
				}
			}
		});

		const title = data?.type === 'look' ? '维保信息' : '编辑维保信息';
		const width = data?.type === 'look' ? 700 : 500;
		return (
			<Drawer
				title={title}
				open={open}
				onClose={onClose}
				destroyOnClose
				width={width}
				loading={loading}
			>
				{data.type === 'look' && (
					<LookDrawer
						id={data.id}
						data={maintenanceData?.data as Maintenance}
					/>
				)}
				{data.type === 'edit' && (
					<EditDrawer
						data={maintenanceData?.data as Maintenance}
						id={data.id}
						onClose={onClose}
					/>
				)}
			</Drawer>
		);
	}
	return null;
};
