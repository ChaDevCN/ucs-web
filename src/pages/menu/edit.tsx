import { createElement } from 'react';

import {
	PageContainer,
	ProForm,
	ProFormSelect,
	ProFormText
} from '@ant-design/pro-components';
import { Card } from 'antd';

import { antdIcons } from '@/assets/antd-icons';

const EditMenu = () => {
	return (
		<Card className="w-full h-full">
			<PageContainer className="w-full h-full" content="编辑菜单">
				<ProForm>
					<ProForm.Group>
						<ProFormText label="名称" name="name"></ProFormText>
						<ProFormText label="文件地址" name="fullPath" />
					</ProForm.Group>
					<ProForm.Group>
						<ProFormText
							label="路由"
							name="path"
							tooltip="以/开头，不用手动拼接上级路由。参数格式/:id"
						/>
					</ProForm.Group>
					<ProForm.Group>
						<ProFormSelect
							label="父级"
							name="parentId"
							tooltip="用于菜单显示"
						></ProFormSelect>
						<ProFormSelect
							label="图标"
							name="icon"
							options={Object.keys(antdIcons).map((key) => ({
								label: createElement(antdIcons[key]),
								value: key
							}))}
						/>
					</ProForm.Group>
				</ProForm>
			</PageContainer>
		</Card>
	);
};

export default EditMenu;
