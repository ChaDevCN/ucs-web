import { FC } from 'react';

import { useRequest } from 'ahooks';
import { Form, Input, message } from 'antd';
import { Modal } from 'antd';

import { AddUserProps } from '../service';

import { signUp } from '@/pages/login/service';
const AddUser: FC<AddUserProps> = ({ isModalOpen, setIsModalOpen }) => {
	const [form] = Form.useForm();
	const { run, loading } = useRequest(signUp, {
		manual: true,
		throttleWait: 300,
		loadingDelay: 300,
		onSuccess: () => {
			message.destroy();
			setIsModalOpen(false);
			form.resetFields();
			message.success('创建成功');
		},
		onError: (error) => {
			message.destroy();
			message.error(error.message);
		}
	});

	return (
		<Modal
			open={isModalOpen}
			onCancel={() => {
				setIsModalOpen(false);
				form.resetFields();
			}}
			centered
			onOk={() => form.submit()}
			loading={loading}
			destroyOnClose
		>
			<Form
				form={form}
				className="w-10/12 !pt-6 !mx-auto"
				onFinish={run}
				disabled={loading}
			>
				<Form.Item
					label="用户名"
					name="username"
					rules={[
						{ required: true, message: '请输入用户名' },
						{ min: 6, max: 20, message: '用户名长度在6-20个字符之间' }
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="密码"
					name="password"
					rules={[
						{ required: true, message: '请输入密码' },
						{ min: 6, max: 20, message: '密码长度在6-20个字符之间' }
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item label="邮箱" name="email">
					<Input />
				</Form.Item>
				<Form.Item label="昵称" name="nickname">
					<Input />
				</Form.Item>
				{/* <Form.Item label="角色" name="role">
					<Select
						mode="multiple"
						options={data.map((item) => ({
							label: item.name,
							value: item.id
						}))}
					/>
				</Form.Item> */}
			</Form>
		</Modal>
	);
};

export default AddUser;
