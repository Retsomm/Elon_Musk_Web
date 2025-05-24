import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest', // 使用最新的 ECMAScript 語法
      sourceType: 'module', // 使用 ES 模塊
      globals: {
        ...globals.browser, // 瀏覽器環境
        ...globals.node, // Node.js 環境
      },
      parser: '@typescript-eslint/parser', // 使用兼容 Flat Config 的解析器
    },
    plugins: {
      react, // 添加 React 插件
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules, // 添加 React 規則
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // React 17+ 不需要顯式引入 React
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];