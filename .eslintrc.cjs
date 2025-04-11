/* eslint-disable no-undef */
module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'plugin:prettier/recommended'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: ['@typescript-eslint', 'prettier', 'import'],
	rules: {
		'prettier/prettier': 'error',
		'no-case-declarations': 'off',
		'no-constant-condition': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'no-unused-vars': 'off',
		'import/order': [
			'error',
			{
				groups: [
					'builtin',
					'external',
					'parent',
					'sibling',
					'index',
					'internal',
					'object',
					'type'
				],
				pathGroups: [
					{
						pattern: 'react*',
						group: 'builtin',
						position: 'before'
					},
					{
						pattern: '@/components/**',
						group: 'parent',
						position: 'before'
					},
					{
						pattern: '@/utils/**',
						group: 'parent',
						position: 'after'
					},
					{
						pattern: '@/apis/**',
						group: 'parent',
						position: 'after'
					}
				],
				pathGroupsExcludedImportTypes: ['react'],
				'newlines-between': 'always',
				alphabetize: {
					order: 'asc',
					caseInsensitive: true
				}
			}
		]
	}
};
