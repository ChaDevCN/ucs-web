import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRequest } from 'ahooks';
import { Form, Input, Button, Checkbox, message } from 'antd';

import { setToken, setRefreshToken } from '@/utils/utils';

import { signIn, SignInParams } from './service';

import loginImg from '@/assets/images/login_bg.svg';
import loginLeft from '@/assets/images/login_left.png';

import './index.less';

const defaultLoginInfo: SignInParams = {
	username: '',
	password: '',
	remember: false
};

const App: React.FC = () => {
	const navigate = useNavigate();
	const { loading, run } = useRequest(signIn, {
		manual: true,
		onSuccess: (res) => {
			if (res.status === 200) {
				setToken(res.data.accessToken);
				setRefreshToken(res.data.refreshToken);
				message.success('登录成功');
				navigate('/');
			} else {
				message.error('帐号或密码错误');
			}
		},
		onError: (error: any) => {
			message.error(error.message);
		}
	});
	const onFinish = (values: SignInParams) => {
		run(values);
	};
	const [loginInfo] = useState(() => {
		try {
			const loginInfo = JSON.parse(localStorage.getItem('login_info') || '{}');
			return loginInfo;
		} catch (_) {
			return defaultLoginInfo;
		}
	});
	return (
		<div
			className={`w-full h-screen  flex items-center justify-center overflow-x-hidden bg-[#eee] bg-no-repeat bg-center bg-cover login-page`}
			style={{ backgroundImage: `url(${loginImg})` }}
		>
			<div className="login-box">
				<div className="login-left  lg:block hidden lg:w-[750px]">
					<img src={loginLeft} alt="login" />
				</div>
				<div className="login-form">
					<Form
						disabled={loading}
						name="basic"
						onFinish={onFinish}
						autoComplete="off"
						className="mt-[30px]"
						initialValues={loginInfo}
					>
						<Form.Item<Partial<SignInParams>>
							label="Username"
							name="username"
							rules={[{ required: true, message: '请输入用户名' }]}
						>
							<Input />
						</Form.Item>

						<Form.Item<Partial<SignInParams>>
							label="Password"
							name="password"
							rules={[{ required: true, message: '请输入密码' }]}
						>
							<Input.Password />
						</Form.Item>

						<Form.Item<Partial<SignInParams>>
							name="remember"
							valuePropName="checked"
						>
							<Checkbox>Remember me</Checkbox>
						</Form.Item>

						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								className=" w-full uppercase"
								loading={loading}
							>
								login
							</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default App;
