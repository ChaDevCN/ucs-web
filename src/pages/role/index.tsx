import '@/assets/styles/table.less';
import { useState } from 'react';

import { useRequest } from 'ahooks';
import {
	Table,
	Card,
	Button,
	Space,
	Modal,
	Form,
	Input,
	message,
	TableProps,
	Dropdown,
	MenuProps
} from 'antd';
import { Plus, Edit, Trash2, Ellipsis, Key, Menu } from 'lucide-react';

import MenuSetting from './components/MenuSetting';
import PermissionSetting from './components/PermissionSetting';
import { getRoleList, createRole, updateRole, deleteRole } from './service';

import type { Role, RoleQueryParams } from './service';
import './index.less';

const Role = () => {
	const [form] = Form.useForm();
	const [modalVisible, setModalVisible] = useState(false);
	const [editingRole, setEditingRole] = useState<Role | null>(null);
	const [permissionVisible, setPermissionVisible] = useState(false);
	const [menuVisible, setMenuVisible] = useState(false);

	const { data, loading, run } = useRequest(
		(queryParams: RoleQueryParams) => getRoleList(queryParams),
		{
			defaultParams: [{ current: 1, pageSize: 10 }]
		}
	);

	const handleAdd = () => {
		setEditingRole(null);
		form.resetFields();
		setModalVisible(true);
	};

	const handleEdit = (role: Role) => {
		setEditingRole(role);
		form.setFieldsValue(role);
		setModalVisible(true);
	};

	const handleDelete = async (id: number) => {
		try {
			await deleteRole(id);
			message.success('删除成功');
			run();
		} catch (error) {
			message.error('删除失败');
		}
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			if (editingRole) {
				await updateRole(editingRole.id, values);
				message.success('更新成功');
			} else {
				await createRole(values);
				message.success('创建成功');
			}
			setModalVisible(false);
			run();
		} catch (error) {
			message.error('操作失败');
		}
	};

	const items: MenuProps['items'] = [
		{
			key: '1',
			label: '编辑',
			icon: <Edit size={16} />,
			onClick: () => handleEdit(editingRole!)
		},
		{
			key: '2',
			label: '权限设置',
			icon: <Key size={16} />,
			onClick: () => setPermissionVisible(true)
		},
		{
			key: '3',
			label: '菜单设置',
			icon: <Menu size={16} />,
			onClick: () => setMenuVisible(true)
		},
		{
			key: '4',
			label: '删除',
			icon: <Trash2 size={16} />,
			danger: true,
			onClick: () => handleDelete(editingRole!.id)
		}
	];

	const columns: TableProps<Role>['columns'] = [
		{
			title: '角色名称',
			dataIndex: 'name',
			align: 'center',
			width: 150
		},
		{
			title: '描述',
			dataIndex: 'description',
			align: 'center',
			width: 200
		},
		{
			title: '用户数',
			dataIndex: 'users',
			align: 'center',
			width: 100,
			render: (users: any[]) => users?.length || 0
		},
		{
			title: '权限数',
			dataIndex: 'RolePermissions',
			align: 'center',
			width: 100,
			render: (permissions: any[]) => permissions?.length || 0
		},
		{
			title: '菜单数',
			dataIndex: 'RoleMenu',
			align: 'center',
			width: 100,
			render: (menus: any[]) => menus?.length || 0
		},
		{
			title: '操作',
			dataIndex: 'id',
			align: 'center',
			render: (_, record) => (
				<Dropdown menu={{ items }} arrow placement="bottomCenter">
					<Ellipsis className="cursor-pointer" />
				</Dropdown>
			)
		}
	];

	return (
		<Card className="h-full">
			<Space direction="vertical" className="w-full">
				<div className="mb-4 flex justify-between">
					<Button type="primary" icon={<Plus size={16} />} onClick={handleAdd}>
						新增角色
					</Button>
				</div>

				<Table
					loading={loading}
					columns={columns}
					dataSource={data?.data?.list}
					rowKey="id"
					size="middle"
					rowClassName={(_, index) =>
						index % 2 === 0 ? 'row-even' : 'row-odd'
					}
					pagination={{
						total: data?.data?.total,
						current: data?.data?.current,
						pageSize: data?.data?.pageSize,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total) => `共 ${total} 条记录`,
						onChange: (page, pageSize) => run({ current: page, pageSize })
					}}
				/>

				<Modal
					title={editingRole ? '编辑角色' : '新增角色'}
					open={modalVisible}
					onOk={handleSubmit}
					onCancel={() => setModalVisible(false)}
				>
					<Form form={form} layout="vertical">
						<Form.Item
							name="name"
							label="角色名称"
							rules={[{ required: true, message: '请输入角色名称' }]}
						>
							<Input placeholder="请输入角色名称" />
						</Form.Item>
						<Form.Item name="description" label="描述">
							<Input.TextArea placeholder="请输入角色描述" />
						</Form.Item>
					</Form>
				</Modal>

				{editingRole && (
					<>
						<PermissionSetting
							roleId={editingRole.id}
							visible={permissionVisible}
							onCancel={() => setPermissionVisible(false)}
							onSuccess={() => run()}
						/>
						<MenuSetting
							roleId={editingRole.id}
							visible={menuVisible}
							onCancel={() => setMenuVisible(false)}
							onSuccess={() => run()}
						/>
					</>
				)}
			</Space>
		</Card>
	);
};

export default Role;
