import { useEffect, useState } from 'react';

export const useWidth = () => {
	const [width, setWidth] = useState(window.innerWidth);

	useEffect(() => {
		const fn = () => {
			setWidth(window.innerWidth);
		};
		window.addEventListener('resize', fn);
		return () => {
			window.removeEventListener('resize', fn);
		};
	}, []);
	const isMobile = width < 768;
	const isTablet = width >= 768 && width < 1024;
	const isDesktop = width >= 1024;

	return { isMobile, isTablet, isDesktop, width };
};
