import { useUpdateEffect } from 'ahooks';
import { Drawer } from 'antd';

import SlideMenu from './menu';

import { usePCScreen } from '@/hooks/use-pc-screen';
import { useGlobalStore } from '@/stores/global';

import './index.css';

const Slide = () => {
	const isPC = usePCScreen();

	const { collapsed, setCollapsed } = useGlobalStore();

	useUpdateEffect(() => {
		if (!isPC) {
			setCollapsed(true);
		} else {
			setCollapsed(false);
		}
	}, [isPC]);

	const renderMenu = () => <SlideMenu />;

	if (!isPC) {
		return (
			<Drawer
				open={!collapsed}
				footer={null}
				placement="left"
				closable={false}
				title={
					<div
						className="flex items-center gap-[4px] text-[20px] justify-center"
						style={{ width: 220 }}
					>
						<h1 className="font-bold text-[22px]">aixdb</h1>
					</div>
				}
				styles={{
					header: { padding: '24px 0', border: 'none' },
					body: { padding: '0 16px' }
				}}
				onClose={() => {
					setCollapsed(true);
				}}
			>
				{renderMenu()}
			</Drawer>
		);
	}

	return (
		<div
			style={{
				width: collapsed ? 112 : '13%'
			}}
			className="min-w-[160px] max-w-[220px]"
		>
			{renderMenu()}
		</div>
	);
};
export default Slide;
