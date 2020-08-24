const { merge } = require("webpack-merge");
import path from "path";
const CopyPlugin = require("copy-webpack-plugin");

export default pluginOptions => ({
  webpack: previousConfig => {
    return merge(
      previousConfig,
      {
        plugins: [
          new CopyPlugin({
              patterns: [
                path.resolve('.', 'src', 'languageserver.wasm'),
              ]
          })
        ]
      },
    );
  }
});
