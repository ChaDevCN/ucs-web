import { RouteObject } from 'react-router-dom';

import ErrorPage from '@/components/exception/500';

import Layout from '@/layouts';
import Login from '@/pages/login';
import Manual from '@/pages/manual';

export const routes: RouteObject[] =
	RUNNING_ENV !== 'manual'
		? [
				{
					path: '/login',
					Component: Login
				},
				{
					path: '*',
					Component: Layout,
					errorElement: <ErrorPage />
				},
				{
					path: '/manual',
					Component: Manual
				}
		  ]
		: [
				{
					path: '*',
					Component: Manual
				}
		  ];
