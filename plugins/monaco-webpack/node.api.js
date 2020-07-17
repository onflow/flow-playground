const { merge } = require("webpack-merge");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const Dotenv = require("dotenv-webpack");
import path from "path";

export default pluginOptions => ({
  webpack: previousConfig => {
    return merge(
      previousConfig,
      {
        entry: [ path.resolve("./src/wasm_exec.js") ],
        resolve: {
          alias: {
            vscode: require.resolve("monaco-languageclient/lib/vscode-compatibility")
          }
        },
        module: {
          rules: [
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
          disableHostCheck: true,
          https: true
        },
        plugins: [
          new MonacoWebpackPlugin({
            languages: []
          }),
          new Dotenv()
        ],
        node: {
          net: 'empty',
          fs: 'empty',
          util: 'empty'
        },
      },
    );
  }
});
