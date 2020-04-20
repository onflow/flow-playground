const merge = require("webpack-merge");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const Dotenv = require("dotenv-webpack");

export default pluginOptions => ({
  webpack: previousConfig => {
    return merge.strategy({
      entry: "append", // or 'replace', defaults to 'append'
      "module.rules": "append",
      devServer: "append",
      plugins: "append"
    })(
      {
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
        plugins: [new MonacoWebpackPlugin(), new Dotenv()]
      },
      previousConfig
    );
  }
});
