process.on("unhandledRejection", (err) => {
  throw err;
});

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const webpack = require("webpack");
const chalk = require("chalk");
const clearConsole = require("react-dev-utils/clearConsole");

clearConsole();

const startTime = Date.now();

const webpackConfig = require("../webpack.config");

webpack(webpackConfig).run((err, stats) => {
  if (err) {
    throw err;
  }

  console.log(stats.toString({ colors: true, ...webpackConfig.stats }));

  if (stats.hasErrors()) {
    process.exit(1);
  }

  console.log(
    chalk.cyan(
      `\n✨ 打包完成，耗时：${((Date.now() - startTime) / 1000).toFixed(0)}秒\n`
    )
  );
});
