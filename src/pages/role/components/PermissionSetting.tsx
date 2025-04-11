import { useEffect, useState } from 'react';

import { Modal, Tree, message } from 'antd';

import { getRolePermissions, updateRolePermissions } from '../service';

import type { DataNode } from 'antd/es/tree';

interface PermissionSettingProps {
	roleId: number;
	visible: boolean;
	onCancel: () => void;
	onSuccess: () => void;
}

const PermissionSetting = ({
	roleId,
	visible,
	onCancel,
	onSuccess
}: PermissionSettingProps) => {
	const [treeData, setTreeData] = useState<DataNode[]>([]);
	const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (visible) {
			loadPermissions();
		}
	}, [visible, roleId]);

	const loadPermissions = async () => {
		try {
			setLoading(true);
			const data = await getRolePermissions(roleId);
			// 这里需要根据后端返回的数据结构转换树形数据
			// 示例数据结构
			const permissions = [
				{
					title: '系统管理',
					key: 'system',
					children: [
						{
							title: '用户管理',
							key: 'user',
							children: [
								{ title: '查看用户', key: 'user:read' },
								{ title: '创建用户', key: 'user:create' },
								{ title: '编辑用户', key: 'user:update' },
								{ title: '删除用户', key: 'user:delete' }
							]
						},
						{
							title: '角色管理',
							key: 'role',
							children: [
								{ title: '查看角色', key: 'role:read' },
								{ title: '创建角色', key: 'role:create' },
								{ title: '编辑角色', key: 'role:update' },
								{ title: '删除角色', key: 'role:delete' }
							]
						}
					]
				}
			];
			setTreeData(permissions);
			// 设置已选中的权限
			setCheckedKeys(data.map((item: any) => item.id));
		} catch (error) {
			message.error('加载权限失败');
		} finally {
			setLoading(false);
		}
	};

	const handleOk = async () => {
		try {
			setLoading(true);
			await updateRolePermissions(roleId, {
				permissionIds: checkedKeys.map((key) => Number(key))
			});
			message.success('保存成功');
			onSuccess();
			onCancel();
		} catch (error) {
			message.error('保存失败');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			title="权限设置"
			open={visible}
			onOk={handleOk}
			onCancel={onCancel}
			confirmLoading={loading}
			width={600}
		>
			<Tree
				checkable
				checkedKeys={checkedKeys}
				onCheck={(checked) => setCheckedKeys(checked as React.Key[])}
				treeData={treeData}
				defaultExpandAll
			/>
		</Modal>
	);
};

export default PermissionSetting;
