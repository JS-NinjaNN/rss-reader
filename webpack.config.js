// Generated using webpack-cli https://github.com/webpack/webpack-cli

import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.js',
  devServer: {
    open: true,
    host: 'localhost',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000',
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
  output: {
    clean: true,
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
