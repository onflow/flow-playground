import path from "path";
import replace from "replace-in-file";
import jsStringEscape from "js-string-escape";
import regexStringEscape from "lodash.escaperegexp";
import fsx from "fs-extra";

const strCWD = regexStringEscape(jsStringEscape(path.resolve(process.cwd())));
const srcPathParent = "./dist/templates";
const srcPath = `${srcPathParent}${strCWD}/src/pages`;
const dstPath = `${srcPathParent}/pages`;

export default pluginOptions => ({
  afterBundle: async state => {
    await replace({
      files: path.resolve(`${srcPathParent}/vendors~main*.js`),
      from: new RegExp(strCWD, "g"),
      to: "."
    });
    await replace({
      files: path.resolve("./dist/main*.js"),
      from: new RegExp(`${strCWD.slice(1)}/src/`, "g"),
      to: ""
    });
    return state;
  },
  afterExport: async state => {
    await replace({
      files: path.resolve("./dist/**/*.html"),
      from: new RegExp(`${strCWD}/src/`, "g"),
      to: "/"
    });
    await replace({
      files: path.resolve("./dist/**/routeInfo.json"),
      from: new RegExp(`${strCWD}/src/`, "g"),
      to: "/"
    });
    try {
      await fsx.move(srcPath, dstPath);
    } catch (err) {
      console.error(err);
    }
    try {
      await fsx.remove(`${srcPathParent}/Users`);
    } catch (err) {
      console.error(err);
    }
    return state;
  }
});
