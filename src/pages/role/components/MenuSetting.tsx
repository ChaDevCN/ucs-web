import { useEffect, useState } from 'react';

import { Modal, Tree, message } from 'antd';

import { getRoleMenus, updateRoleMenus } from '../service';

import type { DataNode } from 'antd/es/tree';

interface MenuSettingProps {
	roleId: number;
	visible: boolean;
	onCancel: () => void;
	onSuccess: () => void;
}

const MenuSetting = ({
	roleId,
	visible,
	onCancel,
	onSuccess
}: MenuSettingProps) => {
	const [treeData, setTreeData] = useState<DataNode[]>([]);
	const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (visible) {
			loadMenus();
		}
	}, [visible, roleId]);

	const loadMenus = async () => {
		try {
			setLoading(true);
			const data = await getRoleMenus(roleId);
			// 这里需要根据后端返回的数据结构转换树形数据
			// 示例数据结构
			const menus = [
				{
					title: '系统管理',
					key: 'system',
					children: [
						{
							title: '用户管理',
							key: 'user',
							children: [
								{ title: '用户列表', key: 'user:list' },
								{ title: '角色管理', key: 'role:list' }
							]
						}
					]
				}
			];
			setTreeData(menus);
			// 设置已选中的菜单
			setCheckedKeys(data.map((item: any) => item.id));
		} catch (error) {
			message.error('加载菜单失败');
		} finally {
			setLoading(false);
		}
	};

	const handleOk = async () => {
		try {
			setLoading(true);
			await updateRoleMenus(roleId, {
				menuIds: checkedKeys.map((key) => Number(key))
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
			title="菜单设置"
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

export default MenuSetting;
