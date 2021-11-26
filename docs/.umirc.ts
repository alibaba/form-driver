import { defineConfig } from 'dumi';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

export default defineConfig({
  title: 'M3',
  mode: 'site',
  favicon: 'https://web.hupan.com/static/image/hupan-icon.png',
  logo: 'https://web.hupan.com/static/image/hupan-icon.png',
  ignoreMomentLocale: false,
  history: { type: 'hash' },
  publicPath: process.env.NODE_ENV === 'production' ? '/m3/' : '/',
  navs: [
    {
      title: 'Guide',
      path: '/guide',
    },
    {
      title: 'Playground',
      path: '/playground',
    },
    // {
    //   title: 'ChangeLog',
    //   path: '/changelog',
    // },
    { title: 'GitLab', path: 'http://gitlab.alibaba-inc.com/hupanopen/m3' },
  ],
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'lib',
        style: true,
        exclude: /node_modules/
      },
      'antd',
    ],
    [
      'import',
      {
        libraryName: '@alifd/next',
        libraryDirectory: 'lib',
        exclude: /node_modules/
      },
      '@alifd/next',
    ],
  ],
  proxy: {
    '/academy/hom/*': {
      target: 'http://hom.hupan.alibaba.net',
      changeOrigin: true,
      secure: false,
    },
    '/academy/go/*': {
      target: 'http://hom.hupan.alibaba.net',
      changeOrigin: true,
      secure: false,
    },
    '/academy/*': {
      target: 'http://www.hupan.alibaba.net',
      changeOrigin: true,
      secure: false,
    },
    '/api': {
      target: 'http://work.hupan.alibaba.net',
      changeOrigin: true,
    }
  },
  chainWebpack(config, { webpack }) {
    config.plugin('monaco-editor').use(MonacoWebpackPlugin);
  },
  // more config: https://d.umijs.org/config
});
