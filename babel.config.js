module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['> 1%', 'last 2 versions']
      },
      modules: false
    }],
    ['@babel/preset-react', {
      runtime: 'automatic'
    }],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['babel-plugin-react-compiler', {
      // React Compiler 設定
      target: '19'
      // 移除漸進式導入，直接編譯所有元件
    }]
  ],
  env: {
    development: {
      plugins: ['react-refresh/babel']
    }
  }
};