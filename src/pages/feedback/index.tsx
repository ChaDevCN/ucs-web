import { useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';

import { DownOutlined } from '@ant-design/icons';
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button, Card, Dropdown, message, Space } from 'antd';
import dayjs from 'dayjs';
import { Edit, Ellipsis, LockOpen, Trash2 } from 'lucide-react';

import { TooltipText } from '../maintenance/service';

import {
	deleteOperationSheet,
	getOperationSheet,
	OperationSheet
} from './service';

const Feedback = () => {
	const navigate = useNavigate();
	const [list, setList] = useState<OperationSheet[]>([]);
	const actionRef = useRef<ActionType>(null);

	const openId = useRef<number | null>(null);
	const { run: deleteOperationSheetRun } = useRequest(deleteOperationSheet, {
		manual: true,
		onSuccess: () => {
			message.success('删除成功');
			actionRef.current?.reload();
		}
	});
	const items = [
		{
			key: '1',
			label: '编辑',
			icon: <Edit size={16} />,
			onClick: () => navigate(`/feedback/${openId.current}`)
		},
		{
			key: '2',
			label: '查看',
			icon: <LockOpen size={16} />,
			onClick: () => navigate(`/feedback/${openId.current}?type=look`)
		},
		{
			key: '3',
			label: '删除',
			icon: <Trash2 size={16} />,
			danger: true,
			onClick: () => {
				if (openId.current && window.confirm('确定删除吗？此操作无法恢复')) {
					message.success('删除成功');
					deleteOperationSheetRun(openId.current);
				}
			}
		}
	];
	const columns: ProColumns<OperationSheet>[] = [
		{
			title: '项目编号',
			dataIndex: 'projectId',
			align: 'center',
			width: 160,
			fixed: 'left',
			render: (_, record) => (
				<TooltipText className="w-[160px]" text={record.projectId} />
			)
		},
		{
			title: '基地',
			dataIndex: 'projectBase',
			align: 'center',
			width: 160,
			fixed: 'left',
			render: (_, record) => (
				<TooltipText className="w-[160px]" text={record.projectBase} />
			)
		},
		{
			title: '日期',
			dataIndex: 'projectStartDate',
			align: 'center',
			width: 110,
			fixed: 'left',
			render: (_, record) => (
				<TooltipText
					className="w-[110px]"
					text={
						record.projectStartDate
							? dayjs(record.projectStartDate).format('YYYY-MM-DD')
							: '-'
					}
				/>
			),
			sorter: true
		},
		{
			title: '项目名称',
			dataIndex: 'projectName',
			align: 'center',
			width: 160,
			render: (_, record) => (
				<TooltipText className="w-[160px]" text={record.projectName} />
			)
		},
		{
			title: '索赔文件号',
			dataIndex: 'claimFileNumber',
			align: 'center',
			width: 160,
			render: (_, record) => (
				<TooltipText className="w-[160px]" text={record.claimFileNumber} />
			)
		},
		{
			title: '进展',
			dataIndex: 'progress',
			align: 'center',
			width: 160,
			render: (_, record) => (
				<TooltipText className="w-[160px]" text={record.progress} />
			)
		},
		{
			title: '设备',
			dataIndex: 'equipment',
			align: 'center',
			width: 160,
			render: (_, record) => (
				<TooltipText className="w-[160px]" text={record.equipment} />
			)
		},
		{
			title: '地点',
			dataIndex: 'location',
			align: 'center',
			width: 160,
			render: (_, record) => (
				<TooltipText className="w-[160px]" text={record.location} />
			)
		},
		{
			title: '执行方',
			dataIndex: 'executor',
			align: 'center',
			width: 160,
			render: (_, record) => (
				<TooltipText className="w-[160px]" text={record.executor} />
			)
		},
		{
			title: '收到工业PO时间',
			dataIndex: 'poReceivedDate',
			align: 'center',
			width: 120,
			render: (_, record) => (
				<TooltipText
					text={
						record.poReceivedDate
							? dayjs(record.poReceivedDate).format('YYYY-MM-DD')
							: '-'
					}
				/>
			),
			sorter: true
		},
		{
			title: 'TSC_PO编号',
			dataIndex: 'tscPoId',
			align: 'center',
			width: 100,
			render: (_, record) => (
				<TooltipText className="w-[160px]" text={record.tscPoId} />
			)
		},
		{
			title: 'PO完成时间',
			dataIndex: 'poCompletedDate',
			align: 'center',
			width: 100,
			render: (_, record) => (
				<TooltipText
					className="w-[100px]"
					text={
						record.poCompletedDate
							? dayjs(record.poCompletedDate).format('YYYY-MM-DD')
							: '-'
					}
				/>
			),
			sorter: true
		},
		{
			title: 'PO周期(天)',
			dataIndex: 'poDurationDays',
			align: 'center',
			width: 100,
			render: (_, record) => (
				<TooltipText
					className="w-[100px]"
					text={record.poDurationDays?.toString()}
				/>
			)
		},
		{
			title: '供应商开票金额',
			dataIndex: 'vendorInvoiceAmount',
			align: 'center',
			width: 120,
			render: (_, record) => (
				<TooltipText
					className="w-[120px]"
					text={record.vendorInvoiceAmount?.toLocaleString()}
				/>
			)
		},
		{
			title: '供应商开票时间',
			dataIndex: 'vendorInvoiceDate',
			align: 'center',
			width: 120,
			render: (_, record) => (
				<TooltipText
					className="w-[120px]"
					text={
						record.vendorInvoiceDate
							? dayjs(record.vendorInvoiceDate).format('YYYY-MM-DD')
							: '-'
					}
				/>
			)
		},
		{
			title: '供应商付款时间',
			dataIndex: 'vendorPaymentDate',
			align: 'center',
			width: 120,
			render: (_, record) => (
				<TooltipText
					className="w-[120px]"
					text={
						record.vendorPaymentDate
							? dayjs(record.vendorPaymentDate).format('YYYY-MM-DD')
							: '-'
					}
				/>
			)
		},
		{
			title: '对工业开具发票时间',
			dataIndex: 'invoiceIssuedDate',
			align: 'center',
			width: 160,
			render: (_, record) => (
				<TooltipText
					className="w-[160px]"
					text={
						record.invoiceIssuedDate
							? dayjs(record.invoiceIssuedDate).format('YYYY-MM-DD')
							: '-'
					}
				/>
			)
		},
		{
			title: '给工业发票金额(15%PLUS)',
			dataIndex: 'invoiceTotalWithMargin',
			align: 'center',
			width: 200,
			render: (_, record) => (
				<TooltipText
					className="w-[200px]"
					text={record.invoiceTotalWithMargin?.toLocaleString()}
				/>
			)
		},
		{
			title: '到账时间',
			dataIndex: 'paymentReceivedDate',
			align: 'center',
			width: 100,
			render: (_, record) => (
				<TooltipText
					className="w-[100px]"
					text={
						record.paymentReceivedDate
							? dayjs(record.paymentReceivedDate).format('YYYY-MM-DD')
							: '-'
					}
				/>
			),
			sorter: true
		},
		{
			title: '账期(天)',
			dataIndex: 'paymentTermDays',
			align: 'center',
			width: 100,
			render: (_, record) => (
				<TooltipText
					className="w-[100px]"
					text={record.paymentTermDays?.toString()}
				/>
			),
			sorter: true
		},
		{
			title: '服务内容',
			dataIndex: 'serviceContent',
			align: 'center',
			width: 160,
			render: (_, record) => (
				<TooltipText className="w-[160px]" text={record.serviceContent} />
			)
		},
		{
			title: '创建时间',
			dataIndex: 'createdAt',
			align: 'center',
			fixed: 'right',
			width: 100,
			render: (_, record) => (
				<TooltipText
					className="w-[100px]"
					text={
						record.createdAt
							? dayjs(record.createdAt).format('YYYY-MM-DD')
							: '-'
					}
				/>
			),
			sorter: true
		},
		{
			title: '操作',
			dataIndex: 'id',
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (_, record) => (
				<Dropdown
					menu={{ items }}
					arrow
					placement="bottom"
					trigger={['click']}
					onOpenChange={(open) => {
						if (open) {
							openId.current = record.id;
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
	const toolBarRender = () => {
		return (
			<Space>
				<Button onClick={() => navigate('/feedback/-1')}>新增</Button>
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
					filename="内部跟踪.csv"
				>
					<Button type="primary" icon={<DownOutlined />}>
						导出数据
					</Button>
				</CSVLink>
			</Space>
		);
	};

	return (
		<Card className="h-full">
			<ProTable<OperationSheet>
				columns={columns}
				headerTitle="内部跟踪"
				toolBarRender={toolBarRender as any}
				search={false}
				actionRef={actionRef}
				request={async (params, sorter) => {
					const { current = 1, pageSize = 10, ...rest } = params;

					const orderBy: Record<string, 'asc' | 'desc'> = {};
					for (const key in sorter) {
						if (sorter[key]) {
							orderBy[key] = sorter[key] === 'ascend' ? 'asc' : 'desc';
						}
					}

					const where: Record<string, any> = {};
					if (rest.projectCode) where.projectCode = rest.projectCode;

					const res = await getOperationSheet({
						page: current,
						limit: pageSize,
						args: JSON.stringify({
							where,
							orderBy
						})
					});

					const list = res?.data.data || [];
					setList(list);
					return {
						data: list,
						success: true,
						total: res?.data.total
					};
				}}
				pagination={{
					pageSize: 10
				}}
				rowKey="id"
				scroll={{
					x: columns.reduce(
						(acc, item) =>
							acc + (typeof item.width === 'number' ? item.width : 0),
						0
					)
				}}
			/>
		</Card>
	);
};

export default Feedback;
