const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

const sourceDirectory = path.resolve(__dirname, 'demo/src');
const targetDirectory = path.resolve(__dirname, 'demo/dist');

const isDev = process.env.NODE_ENV !== 'production';
const HOST = "0.0.0.0"
const PORT = process.env.PORT && Number(process.env.PORT)

const plugins = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    inject: true,
    template: path.resolve(__dirname, 'demo/src/index.html'),
    minify: {
      collapseWhitespace: !isDev,
      removeComments: !isDev,
      removeRedundantAttributes: !isDev,
    },
  }),
  new webpack.HotModuleReplacementPlugin(),
  new MiniCssExtractPlugin({
    filename: '[name]-[hash].css',
  }),
];

if (!isDev) {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  );
}

module.exports = {
  mode: isDev ? 'development' : 'production',
  context: sourceDirectory,
  entry: {
    index: './index.js',
  },
  devtool: 'inline-source-map',
  output: {
    path: targetDirectory,
    filename: '[name]-[hash].js',
  },
  devServer: {
    clientLogLevel: 'debug',
    overlay: { warnings: false, errors: true },
    stats: "errors-only",
    hot: true,
    host: HOST,
    port: PORT,
    contentBase: [sourceDirectory],
    watchContentBase: true,
    open: false,
    disableHostCheck: true,
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
        pathRewrite: {
          // '^/academy' : ''
        }
      },
      '/api': {
        target: 'http://work.hupan.alibaba.net',
        changeOrigin: true,
      }
    },
  },
  watchOptions: {
    ignored: [
      /node_modules/,
      path.posix.resolve(__dirname, './dist'),
      path.posix.resolve(__dirname, './es'),
      path.posix.resolve(__dirname, './lib'),
      path.posix.resolve(__dirname, './types'),
      path.posix.resolve(__dirname,'./demo/src/ut_autoTest/ut_case'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              plugins: [
                //antd 和 antd-mobile 按需加载
                [
                  "import",
                  { libraryName: "antd", style: 'css' }, 'antd'
                ],
                [
                  "import",
                  { libraryName: "antd-mobile", style: 'css' }, 'antd-mobile'
                ],
              ]
            },
          },
          {
            loader: 'ts-loader',
          },
        ],
        exclude: [/node_modules/],
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            query: {
              plugins: [
                //antd 和 antd-mobile 按需加载
                [
                  "import",
                  { libraryName: "antd", style: 'css' }, 'antd'
                ],
                [
                  "import",
                  { libraryName: "antd-mobile", style: 'css' }, 'antd-mobile'
                ],
              ]
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          }
        ],
      },
      {
        test: /\.html$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader" // 将 Sass 编译成 CSS，默认使用 Node Sass
        ]
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.jsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins,
};
