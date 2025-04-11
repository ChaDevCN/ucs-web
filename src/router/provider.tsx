import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { App } from 'antd';

import { antdUtils } from '@/utils/antd';

import { router } from '.';

export default function RootRouterProvider() {
	const { notification, message, modal } = App.useApp();

	useEffect(() => {
		antdUtils.setMessageInstance(message);
		antdUtils.setNotificationInstance(notification);
		antdUtils.setModalInstance(modal);
	}, [notification, message, modal]);

	return <RouterProvider router={router} />;
}
