const { expandEvn, getEnv } = require("./env");
const { checkEnvIsProduction } = require("./utils");

const NODE_ENV = process.env.NODE_ENV || "development";

expandEvn([`.env.local`, `.env.${NODE_ENV}`, ".env"]);

const env = getEnv();
const { getDevConfig } = require("./webpack.dev.config");
const { getProdConfig } = require("./webpack.prod.config");

let getWebpackConfig = getDevConfig;

if (checkEnvIsProduction()) {
  getWebpackConfig = getProdConfig;
}

let webpackConfig = getWebpackConfig(env);

module.exports = webpackConfig;
