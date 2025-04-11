import { Outlet } from 'react-router-dom';

import { Layout } from 'antd';

import Header from './Header';
const { Content } = Layout;
const LayoutEditor = () => {
	return (
		<Layout className="w-full h-dvh">
			<Header />
			<Content className="flex flex-col flex-1">
				<Outlet />
			</Content>
		</Layout>
	);
};

export default LayoutEditor;
