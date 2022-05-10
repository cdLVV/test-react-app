exports.checkEnvIsProduction = () => {
  return process.env.NODE_ENV === "production";
};

/**
 * 获取app端口，仅供webpack编译时使用
 * @returns
 */
exports.getAppPort = () => {
  return 3001;
};
