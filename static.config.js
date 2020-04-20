import { ServerStyleSheet } from "@emotion/styled";
import path from "path";

export default {
  entry: path.join(__dirname, "src", "index.tsx"),
  getSiteProps: () => ({
    title: "Flow Playground",
  }),
  getRoutes: async () => {
    return [];
  },
  beforeHtmlToDocument: (render, Comp, meta) => {
    const sheet = new ServerStyleSheet();
    const html = render(sheet.collectStyles(<Comp />));
    meta.styleTags = sheet.getStyleElements();
    return html;
  },
  plugins: [
    "monaco-webpack",
    "remove-paths",
    "react-static-plugin-typescript",
    [
      require.resolve("react-static-plugin-source-filesystem"),
      {
        location: path.resolve("./src/pages"),
      },
    ],
    require.resolve("react-static-plugin-reach-router"),
    require.resolve("react-static-plugin-sitemap"),
  ],
};
