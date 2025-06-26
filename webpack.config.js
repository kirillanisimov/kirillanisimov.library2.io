const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isProduction = process.argv.includes('--mode=production') || process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'docs'),
    
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html', 
    inject: 'body',
  }),
    
    new MiniCssExtractPlugin({
      filename: isProduction ? 'styles.[contenthash].css' : 'styles.css',
    }),

    new CopyPlugin({
      patterns: [
        { from: 'public', to: ''},
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    publicPath: '/',
    serveIndex: true,
    },
    compress: true,
    port: 9000,
    hot: true,
  },
};