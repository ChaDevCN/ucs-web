import { useEffect } from 'react';

import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'antd-style';
import ReactDOM from 'react-dom/client';

import { useSelector } from './hooks/use-selector';
import RootRouterProvider from './router/provider';
import { useGlobalStore } from './stores/global';
import '@/assets/styles/tailwind.css';

// import '@/assets/styles/reset.css';

const rootEL = document.getElementById('root');

const App = () => {
	const { darkMode } = useGlobalStore(useSelector(['darkMode']));
	useEffect(() => {
		if (darkMode === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, []);
	const darkTheme = {
		token: {
			colorPrimary: '#9b4d96',
			colorPrimaryBg: '#2b2b2b',
			colorPrimaryBgHover: '#3c3c3c',
			colorPrimaryBorder: '#4c4c4c',
			colorPrimaryBorderHover: '#6b6b6b',
			colorPrimaryHover: '#a064fa',
			colorPrimaryActive: '#5b26c7',
			colorPrimaryTextHover: '#a064fa',
			colorPrimaryText: '#e6e6e6',
			colorPrimaryTextActive: '#5b26c7'
		}
	};

	const lightTheme = {
		token: {
			colorPrimary: '#8508e8',
			colorPrimaryBg: '#f8f0ff',
			colorPrimaryBgHover: '#f0e0ff',
			colorPrimaryBorder: '#d9b8ff',
			colorPrimaryBorderHover: '#bf8fff',
			colorPrimaryHover: '#a064fa',
			colorPrimaryActive: '#5b26c7',
			colorPrimaryTextHover: '#a064fa',
			colorPrimaryText: '#8508e8',
			colorPrimaryTextActive: '#5b26c7'
		}
	};

	return (
		<ConfigProvider theme={darkMode === 'dark' ? darkTheme : lightTheme}>
			<ThemeProvider appearance={darkMode}>
				<RootRouterProvider />
			</ThemeProvider>
		</ConfigProvider>
	);
};
if (rootEL) {
	const root = ReactDOM.createRoot(rootEL);
	root.render(<App />);
}
