import React from 'react';

import { Card } from 'antd';

import Slide from './Slide';

import { usePCScreen } from '@/hooks/use-pc-screen';

const Main = ({ children }: { children: React.ReactNode }) => {
	const isPC = usePCScreen();
	return (
		<div
			style={{ overflow: 'initial' }}
			className="flex-1 !p-4 !pb-1 !overflow-y-hidden max-h-full"
		>
			<Card className="h-full main-container max-h-full">
				<div className="flex gap-5 h-full max-h-full">
					<Slide />
					<div
						className={`flex-1 rounded-sm min-h-full content max-h-full max-w-full overflow-x-hidden ${
							isPC ? '' : 'mobile-centent'
						}`}
					>
						{children}
					</div>
				</div>
			</Card>
		</div>
	);
};
export default React.memo(Main);
