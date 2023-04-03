const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: ['./src/index.tsx', './src/wasm_exec.js'],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      pages: path.resolve(__dirname, 'src/pages'),
      providers: path.resolve(__dirname, 'src/providers'),
      components: path.resolve(__dirname, 'src/components'),
      containers: path.resolve(__dirname, 'src/containers'),
      api: path.resolve(__dirname, 'src/api'),
      layout: path.resolve(__dirname, 'src/layout'),
      util: path.resolve(__dirname, 'src/util'),
      vscode: require.resolve('monaco-languageclient/lib/vscode-compatibility'),
    },
    fallback: {
      fs: false,
      net: false,
      util: false,
    },
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ttf$/,
        use: ['file-loader'],
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
        options: {
          knownHelpersOnly: false,
          partialDirs: [path.join(__dirname, './src/templates/js/partials')],
          helperDirs: [path.join(__dirname, './src/templates/js/helpers')],
        },
      },
    ],
  },
  devServer: {
    static: './dist',
    allowedHosts: 'all',
    historyApiFallback: true,
    port: 3000,
    client: {overlay: {warnings: false, errors: false}},
    devMiddleware: {
      writeToDisk: true,
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MonacoWebpackPlugin({
      languages: [],
    }),
    new Dotenv({
      systemvars: true
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '.' },
        {
          from:
            'node_modules/@onflow/cadence-language-server/dist/cadence-language-server.wasm',
          to: '.',
        },
      ],
      options: {
        concurrency: 100,
      },
    }),
    new webpack.EnvironmentPlugin({
      'PLAYGROUND_API': 'http://localhost:8080',
      'GA_TRACKING_ID': '',
      'MIXPANEL_TOKEN': '',
      'DEFAULT_SEO_IMAGE': '',
      'AVATAAR_URL': 'https://us-central1-flow-developer-playground.cloudfunctions.net/avatar/',
      'SENTRY_DSN': '',
    }),
  ],
};
