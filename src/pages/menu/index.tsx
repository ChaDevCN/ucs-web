import { useRequest } from 'ahooks';
import { Card } from 'antd';

import { getMenuList } from './service';

const menu = () => {
	const { data, loading } = useRequest(getMenuList, {
		defaultParams: [{ current: 1, pageSize: 10 }]
	});
	return <Card className="w-full h-full">menu</Card>;
};

export default menu;
