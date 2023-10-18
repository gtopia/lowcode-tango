export default {
  routes: [
    { path: '/', component: '@/pages/index' },
    // {
    //   exact: true,
    //   path: '/',
    //   component: 'index',
    //   name: '首页',
    // },
  ],
  devServer: {
    host: 'local.netease.com',
    port: 8008,
    https: {
      key: './config/local.netease.com-key.pem',
      cert: './config/local.netease.com.pem',
    },
    headers: { 'Origin-Agent-Cluster': '?0' },
  },
  targets: {
    chrome: 79,
    firefox: false,
    safari: false,
    edge: false,
    ios: false,
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'styled-components': 'styled',
    moment: 'moment',
    antd: 'antd',
  },
  chainWebpack: (config: any) => {
    // @see https://github.com/graphql/graphql-js/issues/1272#issuecomment-393903706
    config.module
      .rule('mjs')
      .test(/\.mjs$/)
      .include.add(/node_modules/)
      .end()
      .type('javascript/auto');
    return config;
  },
};
