const path = require("path");
const getBaseConfig = require("./webpack.base.config");
const { getAppPort } = require("./utils");
const paths = require("./paths");

const getDevConfig = (env) => {
  const config = getBaseConfig(env);

  config.mode = "development";
  config.devtool = "cheap-module-source-map";

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
    host: "localhost",
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    static: {
      directory: paths.appPublic,
    },
  };

  return config;
};

module.exports = { getDevConfig };
