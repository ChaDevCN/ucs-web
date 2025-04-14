import * as path from 'path';

import { defineConfig } from '@rsbuild/core';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginReact } from '@rsbuild/plugin-react';
import CompressionPlugin from "compression-webpack-plugin";
const rootDirname = path.resolve(__dirname, '../../');
const { PUBLIC_GOOGLE_CLIENT_ID, BASE_URL } = import.meta.env;
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
	plugins: [pluginReact(), pluginLess()],
	resolve: {
		alias: {
			'@app/css': path.resolve(rootDirname, './libs/assets/styles'),
			'@': path.resolve(__dirname, './src')
		}
	},
	html: {
		template: './static/index.html'
	},
	server: {
		publicDir: {
			name: './static'
		},
		proxy: {
			'/api/v1': {
				target: 'https://usc.aixdb.cn',
				changeOrigin: true
			}
		},
		compress: true,
	},
	source: {
		define: {
			PUBLIC_GOOGLE_CLIENT_ID: `'${PUBLIC_GOOGLE_CLIENT_ID}'`,
			BASE_URL: `'${BASE_URL}'`
		}
	},
	performance: {
		removeConsole: isProd ? true : undefined,
		chunkSplit: {
			strategy: 'split-by-experience',
			forceSplitting: {
				antd: /node_modules[\\/]antd/,
				react: /node_modules[\\/]react/,
				'react-dom': /node_modules[\\/]react-dom/,
				'react-router': /node_modules[\\/]react-router/,
				'react-router-dom': /node_modules[\\/]react-router-dom/,
				lexical: /node_modules[\\/]lexical/,
				'@ant-design/pro-components': /node_modules[\\/]@ant-design/,
				'@ant-design/icons': /node_modules[\\/]@ant-design\/icons/
			}
		}
	},
	tools: {
		rspack: {
		  plugins: [new CompressionPlugin({})]
		}
	}
});
