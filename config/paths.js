"use strict";

const path = require("path");
const fs = require("fs");
const getPublicUrlOrPath = require("react-dev-utils/getPublicUrlOrPath");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

/**
 * 开发环境用相对路径，线上用PUBLIC_URL
 */
const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === "development",
  require(resolveApp("package.json")).homepage,
  process.env.PUBLIC_URL
);

const buildPath = process.env.BUILD_PATH || "dist";

module.exports = {
  appPath: resolveApp("."),
  appBuild: resolveApp(buildPath),
  appPublic: resolveApp("public"),
  appHtml: resolveApp("src/index.html"),
  appSrc: resolveApp("src"),
  appPackageJson: resolveApp("package.json"),
  publicUrlOrPath: publicUrlOrPath,
};
