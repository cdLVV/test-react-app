const path = require("path");
const getBaseConfig = require("./webpack.base.config");
const { getAppPort } = require("./utils");
const paths = require("./paths");

const getDevConfig = (env) => {
  const config = getBaseConfig(env);

  config.mode = "development";
  config.devtool = "cheap-module-source-map";
  // config.stats = "errors-warnings";
  config.stats = {};

  console.log({publicUrlOrPath: paths.publicUrlOrPath});
  let port = getAppPort();

  config.devServer = {
    port,
    historyApiFallback: true,
    liveReload: true,
    allowedHosts: "all",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    },
    allowedHosts: 'auto',
    host: "127.0.0.1",
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    static: {
      directory: paths.appPublic,
      publicPath: [paths.publicUrlOrPath],
    },
    devMiddleware: {
      publicPath: paths.publicUrlOrPath.slice(0, -1),
    },
  };

  return config;
};

module.exports = { getDevConfig };
