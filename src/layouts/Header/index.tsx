import React, { useRef } from 'react';

import { Layout, Button, Space } from 'antd';
import { SunMedium, SunMoon, AlignJustify } from 'lucide-react';

import defaultLogo from '@/assets/images/logo-def.png';
import logo from '@/assets/images/logo.png';
import { usePCScreen } from '@/hooks/use-pc-screen';
import { useSelector } from '@/hooks/use-selector';
import { useGlobalStore } from '@/stores/global';
import { useUserStore } from '@/stores/user';

interface ViewTransition {
	finished: Promise<void>;
	ready: Promise<void>;
	updateCallbackDone: Promise<void>;
	skipTransition: () => void;
}

type DocumentNew = Document & {
	startViewTransition: (callback: () => void) => ViewTransition | undefined;
};

const { Header: AntHeader } = Layout;
const Header = () => {
	const isPC = usePCScreen();
	const { darkMode, setDarkMode, collapsed, setCollapsed } = useGlobalStore(
		useSelector(['darkMode', 'setDarkMode', 'collapsed', 'setCollapsed'])
	);
	const { currentUser } = useUserStore();
	const checked = useRef<boolean>(true);

	const onChange = (
		checked: boolean,
		e: React.MouseEvent<HTMLButtonElement>
	) => {
		const value = checked ? 'light' : 'dark';

		const transition = (document as DocumentNew).startViewTransition(() => {
			if (!checked) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
			setDarkMode(value);
		});
		transition &&
			transition.ready.then(() => {
				const { clientX, clientY } = e;
				const redius = Math.hypot(
					Math.max(clientX, innerWidth - clientX),
					Math.max(clientY, innerHeight - clientY)
				);

				const isDark = document.documentElement.classList.contains('dark');

				const clipPath = [
					`circle(${0}px at ${clientX}px ${clientY}px)`,
					`circle(${redius}px at ${clientX}px ${clientY}px)`
				];

				document.documentElement.animate(
					{ clipPath: isDark ? clipPath.reverse() : clipPath },
					{
						duration: 300,
						pseudoElement: isDark
							? '::view-transition-old(root)'
							: '::view-transition-new(root)'
					}
				);
			});
	};

	return (
		<AntHeader>
			<div className="flex justify-between h-full">
				<>
					{!isPC && (
						<Button
							type="text"
							style={{
								fontSize: '16px',
								width: 64,
								height: 64
							}}
							onClick={() => setCollapsed(false)}
						>
							{collapsed ? <AlignJustify /> : null}
						</Button>
					)}
					<div className="flex items-center justify-center h-full">
						{darkMode === 'light' ? (
							<img alt="logo" src={logo} />
						) : (
							<img alt="logo" src={defaultLogo} />
						)}
					</div>
				</>

				<Space className="mr-5" align="center" size={'middle'}>
					<div
						onClick={(e) => {
							checked.current = !checked.current;
							onChange(checked.current, e as any);
						}}
						className="cursor-pointer"
					>
						{darkMode === 'dark' ? <SunMedium /> : <SunMoon />}
					</div>
					<div>{currentUser?.email || currentUser?.username}</div>
				</Space>
			</div>
		</AntHeader>
	);
};
export default Header;
