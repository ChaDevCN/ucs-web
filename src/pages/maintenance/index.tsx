import { useRef, useState } from 'react';
import { CSVLink } from 'react-csv';

import { DownOutlined } from '@ant-design/icons';
import {
	ProTable,
	ProColumns,
	ActionType,
	ProForm,
	ProFormGroup,
	ProFormSelect
} from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import {
	Badge,
	Button,
	Card,
	Dropdown,
	MenuProps,
	Space,
	Tooltip,
	message
} from 'antd';
import dayjs from 'dayjs';
import { Edit, Ellipsis, LockOpen, Trash2 } from 'lucide-react';

import { withMinDelay } from '@/utils/utils';

import { MaintenanceDrawer } from './components/drawer';
import {
	deleteMaintenance,
	getMaintenanceList,
	Maintenance,
	regionMap,
	statusMap,
	type MaintenanceDrawerType,
	TooltipText
} from './service';
const maintenance = () => {
	const activeItem = useRef<MaintenanceDrawerType | null>(null);
	const [visibleDrawer, setVisibleDrawer] = useState(false);
	const [filterParams, setFilterParams] = useState<any>({});
	const [list, setList] = useState<Maintenance[]>([]);
	const actionRef = useRef<ActionType>(null);

	const handleOpenDrawer = () => {
		setVisibleDrawer(true);
	};
	const handleCloseDrawer = () => {
		setVisibleDrawer(false);
		actionRef.current?.reload();
	};
	const { run: deleteMaintenanceRun } = useRequest(
		(id) => deleteMaintenance(id),
		{
			manual: true,
			onSuccess: () => {
				message.success('删除成功');
				actionRef.current?.reload();
			}
		}
	);
	const items: MenuProps['items'] = [
		// {
		// 	key: '1',
		// 	label: '编辑',
		// 	icon: <Edit size={16} />,
		// 	onClick: () => {
		// 		handleOpenDrawer();
		// 		activeItem.current = {
		// 			id: activeItem.current?.id as number,
		// 			type: 'edit'
		// 		};
		// 	}
		// },
		{
			key: '2',
			label: '查看',
			icon: <LockOpen size={16} />,
			onClick: () => {
				handleOpenDrawer();
				activeItem.current = {
					id: activeItem.current?.id as number,
					type: 'look'
				};
			}
		},
		{
			key: '3',
			label: '删除',
			icon: <Trash2 size={16} />,
			danger: true,
			onClick: () => {
				if (window.confirm('确定删除吗？')) {
					deleteMaintenanceRun(activeItem.current?.id);
				}
			}
		}
	];
	const columns: ProColumns<Maintenance>[] = [
		{
			title: '联系人',
			dataIndex: 'name',
			align: 'center',
			render: (text) => <TooltipText text={text} />,
			width: 120
		},
		{
			title: '邮箱',
			dataIndex: 'email',
			align: 'center',
			render: (text) => <TooltipText text={text} />,
			width: 160
		},
		{
			title: '公司',
			dataIndex: 'company',
			align: 'center',
			width: 120,
			render: (text) => <TooltipText text={text} />
		},
		{
			title: '区域',
			dataIndex: 'region',
			width: 120,
			align: 'center',
			render: (text) => <TooltipText text={text} />
		},
		// {
		// 	title: '状态',
		// 	dataIndex: 'status',
		// 	align: 'center',
		// 	width: 120,
		// 	render: (text) =>
		// 		text && typeof text === 'number' ? (
		// 			<Badge
		// 				color={statusMap[text as keyof typeof statusMap].color}
		// 				text={statusMap[text as keyof typeof statusMap].label}
		// 			/>
		// 		) : (
		// 			'-'
		// 		)
		// },
		{
			title: '创建时间',
			dataIndex: 'createdAt',
			align: 'center',
			sorter: true,
			width: 200,
			render: (text) => (
				<TooltipText
					text={dayjs(text as number).format('YYYY-MM-DD HH:mm:ss')}
				/>
			)
		},
		{
			title: '操作',
			dataIndex: 'id',
			align: 'center',
			width: 80,
			render: (text) => (
				<Dropdown
					menu={{ items }}
					arrow
					placement="bottom"
					trigger={['click']}
					onOpenChange={(open) => {
						if (open) {
							activeItem.current = {
								id: text as number,
								type: 'edit'
							};
						}
					}}
				>
					<div className="flex items-center justify-center">
						<Ellipsis className="cursor-pointer" />
					</div>
				</Dropdown>
			)
		}
	];
	const FilterComp = () => {
		const handleFilter = (values: any) => {
			setFilterParams(values);
			actionRef.current?.reload();
		};
		return (
			<div className="w-[200px] p-2">
				<ProForm
					onFinish={handleFilter}
					onReset={() => {
						setFilterParams({});
						actionRef.current?.reload();
					}}
					className="filter-form"
					submitter={{
						searchConfig: {
							submitText: '筛选'
						}
					}}
				>
					<ProFormGroup>
						<ProFormSelect
							label="区域"
							name="region"
							options={regionMap.map((item) => ({
								label: item.value,
								value: item.value
							}))}
							initialValue={filterParams.region}
						/>
					</ProFormGroup>
				</ProForm>
			</div>
		);
	};
	const toolBarRender = () => (
		<Space>
			<Tooltip
				trigger="click"
				title={<FilterComp />}
				placement="bottom"
				arrow
				color="white"
			>
				<Button>筛选</Button>
			</Tooltip>
			<CSVLink
				data={list || []}
				headers={
					columns
						.map((item) => ({
							label: item.title,
							key: item.dataIndex
						}))
						.splice(0, columns.length - 1) as any
				}
				filename="全球维保.csv"
			>
				<Button type="primary" icon={<DownOutlined />}>
					导出数据
				</Button>
			</CSVLink>
		</Space>
	);
	return (
		<Card className="h-fit min-h-full max-w-full max-h-full overflow-y-auto">
			<ProTable
				actionRef={actionRef}
				toolBarRender={toolBarRender as any}
				scroll={{ x: 1300 }}
				className="max-h-full overflow-hidden max-w-full"
				columns={columns}
				request={async ({ current, ...params }, sort) => {
					let createdAt = '';
					if (sort?.createdAt) {
						createdAt = sort.createdAt.replace('end', '');
					}
					const res = await withMinDelay(
						getMaintenanceList({
							...params,
							currentPage: current,
							...filterParams,
							...sort,
							...(createdAt ? { createdAt } : {})
						}),
						200
					);
					setList(() => {
						const nextList = [...res.data.list];
						return nextList.map((item: any) => ({
							...item,
							createdAt: dayjs(item.createdAt as number).format(
								'YYYY-MM-DD HH:mm:ss'
							)
						}));
					});
					return {
						...res,
						data: res.data.list,
						total: res.data.total,
						current: res.data.currentPage
					};
				}}
				params={{ pageSize: 10 }}
				pagination={{ pageSize: 10 }}
				headerTitle={'全球维保'}
				rowKey="id"
				search={false}
			/>
			<MaintenanceDrawer
				data={activeItem.current}
				open={visibleDrawer}
				onClose={handleCloseDrawer}
			/>
		</Card>
	);
};

export default maintenance;
