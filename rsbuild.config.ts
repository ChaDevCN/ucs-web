import * as path from 'path';

import { defineConfig } from '@rsbuild/core';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginReact } from '@rsbuild/plugin-react';
import CompressionPlugin from 'compression-webpack-plugin';
const rootDirname = path.resolve(__dirname, '../../');
const {
	PUBLIC_GOOGLE_CLIENT_ID,
	BASE_URL,
	MANUAL_URL,
	RUNNING_ENV = 'production'
} = (import.meta as any).env;

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
				target: process.env.PROXY_URL,
				changeOrigin: true
			},
			'/api/v2': {
				target: process.env.MANUAL_URL,
				changeOrigin: true,
				pathRewrite: (path) => path.replace(/^\/api\/v2/, '')
			}
		},
		compress: true
	},
	source: {
		define: {
			PUBLIC_GOOGLE_CLIENT_ID: `'${PUBLIC_GOOGLE_CLIENT_ID}'`,
			BASE_URL: `'${BASE_URL}'`,
			MANUAL_URL: `'${MANUAL_URL}'`,
			RUNNING_ENV: `'${RUNNING_ENV}'`
		}
	},
	performance: {
		// bundleAnalyze: {},
		removeConsole: isProd ? true : undefined,
		chunkSplit: {
			strategy: 'split-by-experience',
			forceSplitting: {
				antd: /node_modules[\\/]antd/,
				react: /node_modules[\\/]react/,
				'react-dom': /node_modules[\\/]react-dom/,
				'react-router': /node_modules[\\/]react-router/,
				'react-router-dom': /node_modules[\\/]react-router-dom/,
				lexical: /node_modules[\\/]lexical|node_modules[\\/]@lexical/,
				'@ant-design/pro-components': /node_modules[\\/]@ant-design/
			}
		}
	},
	tools: {
		rspack: {
			plugins: [new CompressionPlugin({})]
		}
	}
});
