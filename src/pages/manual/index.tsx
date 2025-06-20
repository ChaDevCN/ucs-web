import { useState } from 'react';

import { useRequest } from 'ahooks';
import { Card, Layout, List, Spin, Tabs } from 'antd';

import Header from '@/layouts/Header';
import '@/layouts/index.less';
import './index.less';
const initData = [
	{
		lang: 'zh-cn',
		title: '中文',
		datasource: '/api/v2/data-zn.json',
		button: '下载',
		base: '/zh-cn'
	},
	{
		lang: 'en-us',
		title: 'English',
		datasource: '/api/v2/data.json',
		button: 'Download',
		base: '/en'
	}
];
const Manual = () => {
	const [data] = useState(initData);
	const [activeKey, setActiveKey] = useState(data[0].lang);
	const {
		data: res,
		run,
		loading
	} = useRequest(async (url: string = initData[0].datasource) => {
		const res = await fetch(url);
		if (res.status !== 200) {
			return {
				fileData: []
			};
		}

		return res.json();
	});
	const onChange = (key: string) => {
		const item = data.find((item) => item.lang === key);
		if (item) {
			setActiveKey(key);
			run(item.datasource);
		}
	};

	return (
		<Layout className="w-full h-dvh flex-col justify-between">
			<Header />
			<div className="w-[calc(100vw - 30px)] h-full max-w-full m-2 mr-2 md:m-10  md:mr-10">
				<Spin spinning={loading} className="w-full h-full">
					<Card className="w-full h-full">
						<Tabs
							activeKey={activeKey}
							items={data.map((item) => ({
								key: item.lang,
								label: item.title
							}))}
							onChange={onChange}
						/>
						<List
							className="w-full h-full"
							dataSource={Array.from(
								new Map(
									(res?.fileData || [])
										.slice()
										.sort((a: any, b: any) =>
											a.filename.trim().localeCompare(b.filename.trim())
										)
										.map((item: { filename: string; fileurl: string }) => [
											item.filename.trim(),
											item
										])
								).values()
							)}
							pagination={{
								pageSize: 10,
								showSizeChanger: false
							}}
							renderItem={(item: any) => (
								<List.Item>
									<div className="flex justify-between w-full">
										{item.filename}
										<a
											href={`${
												data.find((item) => item.lang === activeKey)?.base
											}${item.fileurl}`}
											download
											target="_blank"
										>
											{data.find((item) => item.lang === activeKey)?.button}
										</a>
									</div>
								</List.Item>
							)}
						/>
					</Card>
				</Spin>
			</div>
		</Layout>
	);
};
export default Manual;
