const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

const sourceDirectory = path.resolve(__dirname, 'demo/src');
const targetDirectory = path.resolve(__dirname, 'demo/dist');

const isDev = process.env.NODE_ENV !== 'production';
const HOST = process.env.HOST
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
    clientLogLevel: 'warning',
    overlay: { warnings: false, errors: true },
    stats: "errors-only",
    hot: true,
    host: HOST,
    port: PORT,
    contentBase: [sourceDirectory],
    watchContentBase: true,
    open: false,
    proxy: {
      '/academy/*': {
        target: 'http://hom.hupan.alibaba.net',
        changeOrigin: true,
        pathRewrite: {
          // '^/academy' : ''
        }
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
          },
        ],
        exclude: [/node_modules/, /package/],
      },
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/, /package/],
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
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
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins,
};
