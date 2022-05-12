process.on("unhandledRejection", (err) => {
  throw err;
});

process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

const chalk = require("chalk");

const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const clearConsole = require("react-dev-utils/clearConsole");
const formatMessages = require("react-dev-utils/formatWebpackMessages");
const { prepareUrls } = require("react-dev-utils/WebpackDevServerUtils");
const openBrowser = require("react-dev-utils/openBrowser");

const webpackConfig = require("../config/webpack.config");
const port = webpackConfig.devServer.port;
// const host = webpackConfig.devServer.host;
const compiler = webpack(webpackConfig);

let isFirstCompile = true;

compiler.hooks.invalid.tap("invalid", function () {
  clearConsole();

  console.log(chalk.cyan(`🖋  内容发生变更，编译中...\n`));
});

compiler.hooks.done.tap("done", (stats) => {
  const messages = formatMessages(stats.toJson({}, true));

  if (!messages.errors.length && !messages.warnings.length) {
    if (isFirstCompile) {
      console.log(chalk.cyan(`启动成功\n`));
      isFirstCompile = false;
    } else {
      console.log(chalk.cyan(`编译成功\n`));
      console.log(messages);
    }

    return;
  }

  // if (messages.errors.length) {
  //   console.log(chalk.cyan(`❌ 发生错误，编译失败.\n`));
  //   messages.errors.forEach((e) => console.log(e));

  //   return;
  // }

  // if (messages.warnings.length) {
  //   console.log(chalk.cyan(`⚠️ 发生警告，信息如下.\n`));
  //   messages.warnings.forEach((w) => console.log(w));
  // }
});
const devServerOptions = { ...webpackConfig.devServer };
const devServer = new WebpackDevServer(devServerOptions, compiler);

const urls = prepareUrls("http", 'localhost', port);

devServer.startCallback(() => {
  console.log(chalk.cyan("Starting the development server...\n"));
  openBrowser(urls.localUrlForBrowser);
  // open(urls.localUrlForBrowser)
  //   .then((r) => console.log({ r }))
  //   .catch((e) => {
  //     console.log({ e });
  //   });
});
