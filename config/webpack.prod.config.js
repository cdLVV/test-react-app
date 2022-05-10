const getBaseConfig = require("./webpack.base.config");
const getProdConfig = (env) => {
  const config = getBaseConfig(env);

  config.mode = "production";
  config.devtool = "hidden-source-map";

  config.optimization = {
    ...config.optimization,
    // noEmitOnErrors: true,
    // emitOnErrors: false,
    // hashedModuleIds: true,
    moduleIds: "deterministic",
  };

  // config.stats = {
  //   assetsSort: "!size",
  //   chunks: false,
  //   builtAt: false,
  //   entrypoints: false,
  //   children: false,
  //   modules: false,
  //   excludeAssets: (assetName) => assetName.endsWith(".map"),
  // };

  return config;
};

module.exports = { getProdConfig };
