import { RouteObject } from 'react-router-dom';

import ErrorPage from '@/components/exception/500';

import Layout from '@/layouts';
import Login from '@/pages/login';

export const routes: RouteObject[] = [
	{
		path: '/login',
		Component: Login
	},
	{
		path: '*',
		Component: Layout,
		errorElement: <ErrorPage />,
		children: []
	}

	// {
	// 	path: '/',
	// 	Component: Layout,
	// 	children: [
	// 		{
	// 			path: 'user',
	// 			Component: User
	// 		},
	// 		{
	// 			path: 'role',
	// 			Component: Role
	// 		},
	// 		{
	// 			path: 'menu',
	// 			Component: Menu
	// 		},
	// 		{
	// 			path: 'menu/:id',
	// 			Component: EditMenu
	// 		},
	// 		{
	// 			path: 'maintenance',
	// 			Component: Maintenance
	// 		},
	// 		{
	// 			path: 'feedback',
	// 			Component: Feedback
	// 		}
	// 	]
	// },
	// {
	// 	path: '/editor',
	// 	Component: LayoutEditor,
	// 	children: [
	// 		{
	// 			path: 'drafts/:type',
	// 			Component: Drafts
	// 		}
	// 	]
	// }
];
