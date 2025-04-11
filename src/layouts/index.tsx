import { useEffect, useState } from 'react';
import { useOutlet } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import './index.less';
import { Layout } from 'antd';

import { useUserDetail } from './common/useUserDetail';
import Footer from './Footer';
import Header from './Header';
import Main from './Main';

import { usePCScreen } from '@/hooks/use-pc-screen';

const Page = () => {
	const isPC = usePCScreen();
	const { loading } = useUserDetail();
	const [containerHeight, setContainerHeight] = useState<number>();
	const currentOutlet = useOutlet();
	useEffect(() => {
		const header = document.querySelector('header');
		const footer = document.querySelector('footer');
		if (isPC && header?.offsetHeight && footer?.offsetHeight)
			setContainerHeight(
				header?.offsetHeight + footer?.offsetHeight + 20 + 24 + 26 + 32
			);
	}, [isPC]);
	if (loading) {
		return (
			<div className="looading-box">
				<div className="content">
					<div className="text">LOADING...</div>
				</div>
			</div>
		);
	}
	const rights = [/^\/feedback\/.*/];

	const isRight = rights.some((pattern) => pattern.test(location.pathname));

	return (
		<Layout className="w-full h-dvh flex-col justify-between">
			<Header />
			<Main>
				<div
					className={`max-h-full h-full overflow-hidden`}
					style={isPC ? { height: `calc(100vh - ${containerHeight}px)` } : {}}
				>
					<SwitchTransition mode="out-in">
						<CSSTransition
							key={location.pathname}
							appear={true}
							timeout={300}
							classNames={isRight ? 'page-right' : 'page'}
							unmountOnExit
						>
							{currentOutlet}
						</CSSTransition>
					</SwitchTransition>
				</div>
			</Main>
			<Footer />
		</Layout>
	);
};
export default Page;
