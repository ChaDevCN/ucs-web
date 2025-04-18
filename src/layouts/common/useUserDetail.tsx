import { useEffect, useState } from 'react';

import { useRequest } from 'ahooks';

import Result404 from '@/components/exception/404';

import { CompsPathMap, flatMenus } from '@/utils/utils';

import { getCurrentUser } from '@/api';
import { User } from '@/pages/user/service';
import { router } from '@/router';
import { replaceRoutes } from '@/router/router-utils';
import { useGlobalStore } from '@/stores/global';
import { useUserStore } from '@/stores/user';
import { Menu } from '@/types/global-service';

export const useUserDetail = () => {
	const [loading, setLoading] = useState(true);

	const { refreshToken } = useGlobalStore();
	const { setCurrentUser } = useUserStore();

	const { data: currentUserDetail, loading: requestLoading } = useRequest(
		getCurrentUser,
		{
			refreshDeps: [refreshToken]
		}
	);

	useEffect(() => {
		if (!currentUserDetail) return;

		setLoading(true);

		const {
			data: {
				combined: { menus = [] }
			}
		} = currentUserDetail;
		console.log(menus);

		replaceRoutes('*', [
			...flatMenus(menus as Menu[]).map((menu: Menu) => {
				return {
					title: menu.Meta.title,
					path: `/*${menu.path}`,
					id: `/*${menu.path}`,
					Component: menu.component
						? CompsPathMap[menu.component] || Result404
						: Result404,
					handle: {
						path: menu.path,
						name: menu.name,
						icon: menu.Meta.icon,
						hideMenu: menu.Meta.hideMenu,
						parentPaths: [menus.find((m) => m.id === menu.parentId)?.path]
					}
				};
			}),
			{
				id: '*',
				path: '*',
				Component: Result404,
				handle: {
					path: '404',
					name: '404'
				}
			}
		]);

		setCurrentUser(currentUserDetail.data as User);

		router.navigate(`${location.pathname}${location.search}`, {
			replace: true
		});

		setLoading(false);
	}, [currentUserDetail, setCurrentUser]);

	return {
		loading: requestLoading || loading
	};
};
