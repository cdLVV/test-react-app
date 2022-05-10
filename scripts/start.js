process.on("unhandledRejection", (err) => {
  throw err;
});

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const clearConsole = require("react-dev-utils/clearConsole");
const formatMessages = require("react-dev-utils/formatWebpackMessages");
const chalk = require("chalk");
const { prepareUrls } = require("react-dev-utils/WebpackDevServerUtils");

const webpackConfig = require("../webpack.config");
const port = webpackConfig.devServer.port;
const host = webpackConfig.devServer.host;
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
    }

    return;
  }

  if (messages.errors.length) {
    console.log(chalk.cyan(`❌ 发生错误，编译失败.\n`));
    messages.errors.forEach((e) => console.log(e));

    return;
  }

  if (messages.warnings.length) {
    console.log(chalk.cyan(`⚠️ 发生警告，信息如下.\n`));
    messages.warnings.forEach((w) => console.log(w));
  }
});
const devServer = new WebpackDevServer(
  compiler,
  webpackConfig.devServer
).listen(port, host, (err) => {
  if (err) {
    console.log(chalk.red(err));

    process.exit(1);
  }

  console.log("");
});

const urls = prepareUrls("http://", host, port);

devServer.startCallback(() => {
  console.log(chalk.cyan("Starting the development server...\n"));
  openBrowser(urls.localUrlForBrowser);
});
