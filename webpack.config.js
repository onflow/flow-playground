const path = require('path')
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin")
const Dotenv = require("dotenv-webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      "pages": path.resolve(__dirname, "src/pages"),
      "providers": path.resolve(__dirname, "src/providers"),
      "components": path.resolve(__dirname, "src/components"),
      "containers": path.resolve(__dirname, "src/containers"),
      "api": path.resolve(__dirname, "src/api"),
      "util": path.resolve(__dirname, "src/util"),
      "layout": path.resolve(__dirname, "src/layout"),
      "types": path.resolve(__dirname, "type")
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.ttf$/,
        use: ["file-loader"]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    disableHostCheck: true,
    https: true,
    port: 3000,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MonacoWebpackPlugin(),
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '.' },
      ],
      options: {
        concurrency: 100,
      },
    })
  ]
}
