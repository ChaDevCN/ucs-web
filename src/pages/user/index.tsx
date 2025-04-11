import { useState } from 'react';

import { useRequest } from 'ahooks';
import {
	Table,
	Card,
	Switch,
	TableProps,
	Dropdown,
	MenuProps,
	Tag,
	Space,
	Button
} from 'antd';
import dayjs from 'dayjs';
import { Ellipsis, Edit, Trash2 } from 'lucide-react';

import AddUser from './components/addUser';
import { getUserList, type User, type TableParams } from './service';

import '@/assets/styles/table.less';
import './index.less';

const User = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { data, loading, run } = useRequest(
		async (params: TableParams) => await getUserList(params),
		{
			defaultParams: [{ current: 1, pageSize: 10 }],
			refreshDeps: [isModalOpen],
			loadingDelay: 300
		}
	);

	const items: MenuProps['items'] = [
		{
			key: '1',
			label: '编辑',
			icon: <Edit size={16} />
		},
		{
			key: '2',
			label: '删除',
			icon: <Trash2 size={16} />,
			danger: true
		}
	];

	const getRoleTag = (role: string) => {
		const colors = {
			admin: 'red',
			user: 'blue',
			editor: 'green'
		};
		return (
			<Tag color={colors[role as keyof typeof colors] || 'default'}>{role}</Tag>
		);
	};

	const columns: TableProps<User>['columns'] = [
		{
			title: '昵称',
			dataIndex: 'nickname',
			align: 'center',
			width: 120
		},
		{
			title: '邮箱',
			dataIndex: 'email',
			render: (text: string) => text || '-',
			align: 'center',
			width: 200
		},
		{
			title: '角色',
			dataIndex: 'role',
			render: (role: string) => getRoleTag(role),
			align: 'center',
			width: 100
		},
		{
			title: '状态',
			dataIndex: 'isActive',
			render: (active: boolean) => (
				<Switch
					value={active}
					checkedChildren="启用"
					unCheckedChildren="锁定"
				/>
			),
			align: 'center',
			width: 120
		},
		{
			title: '创建时间',
			dataIndex: 'createTime',
			render: (time: number) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
			align: 'center',
			width: 180
		},
		{
			title: '操作',
			dataIndex: 'id',
			render: () => (
				<Dropdown menu={{ items }} arrow placement="bottom">
					<Ellipsis className="cursor-pointer" />
				</Dropdown>
			),
			align: 'center'
		}
	];

	return (
		<Card>
			<Space direction="vertical" className="w-full">
				<Space>
					<Button type="primary" onClick={() => setIsModalOpen(true)}>
						新增
					</Button>
				</Space>
				<Table
					loading={loading}
					columns={columns}
					dataSource={data?.data?.list}
					rowKey={(record) => record.id}
					size="middle"
					rowClassName={(_, index) =>
						index % 2 === 0 ? 'row-even' : 'row-odd'
					}
					pagination={{
						total: data?.data?.total,
						pageSize: data?.data?.pageSize,
						current: data?.data?.current,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total) => `共 ${total} 条记录`,
						onChange: (page, pageSize) => {
							run({ current: page, pageSize });
						}
					}}
				/>
			</Space>
			<AddUser isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
		</Card>
	);
};
export default User;
