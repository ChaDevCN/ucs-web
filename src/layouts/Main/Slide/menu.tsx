import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useMatches } from 'react-router-dom';

import { Menu } from 'antd';
import { MenuItemType } from 'antd/es/menu/interface';

import { antdIcons } from '@/assets/antd-icons';
import { useGlobalStore } from '@/stores/global';
import { useUserStore } from '@/stores/user';
import { Menu as MenuType } from '@/types/global-service';

function SlideMenu() {
	const { collapsed, darkMode } = useGlobalStore();
	const { currentUser } = useUserStore();
	const matches = useMatches();
	const menuDatas = currentUser?.combined.menus;
	const [openKeys, setOpenKeys] = useState<string[]>([]);
	const [selectKeys, setSelectKeys] = useState<string[]>([]);

	useEffect(() => {
		const [match] = matches || [];
		if (match) {
			// 获取当前匹配的路由，默认为最后一个
			const route = matches[matches.length - 1];
			// 从匹配的路由中取出自定义参数
			const handle = route?.handle as { parentPaths: []; path: string };
			// 从自定义参数中取出上级path，让菜单自动展开
			if (collapsed) {
				setOpenKeys([]);
			} else {
				setOpenKeys(handle?.parentPaths || []);
			}
			// 让当前菜单和所有上级菜单高亮显示
			setSelectKeys([...(handle?.parentPaths || []), handle?.path]);
		}
	}, [matches, collapsed]);

	const getMenuTitle = (menu: MenuType) => {
		if (menu?.children?.filter((menu) => !menu.Meta.hideMenu)?.length) {
			return menu.name;
		}
		return <Link to={menu.path}>{menu.name}</Link>;
	};

	const treeMenuData = useCallback((menus: MenuType[]): MenuItemType[] => {
		return menus.map((menu: MenuType) => {
			const children =
				menu?.children?.filter((menu) => !menu.Meta.hideMenu) || [];
			return {
				key: menu.path || '',
				label: getMenuTitle(menu),
				icon:
					menu.Meta.icon &&
					antdIcons[menu.Meta.icon] &&
					React.createElement(antdIcons[menu.Meta.icon]),
				children: children.length ? treeMenuData(children || []) : null
			};
		});
	}, []);

	const menuData = useMemo(() => {
		return treeMenuData(menuDatas?.filter((menu) => !menu.Meta.hideMenu) || []);
	}, [menuDatas]);

	return (
		<Menu
			className="bg-transparent"
			mode="inline"
			selectedKeys={selectKeys}
			style={{ height: '100%', borderRight: 0 }}
			items={menuData}
			inlineCollapsed={collapsed}
			openKeys={openKeys}
			onOpenChange={setOpenKeys}
			theme={darkMode === 'auto' ? 'light' : darkMode}
		/>
	);
}

export default memo(SlideMenu);
