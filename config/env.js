const dotenv = require("dotenv");
const envExpand = require("dotenv-expand");
const fs = require("fs");
const path = require("path");

const NODE_ENV = process.env.NODE_ENV || "development";

const expandEvn = (files) => {
  // 支持单文件和多文件配置
  files
    .map((f) => path.join(process.cwd(), f))
    .filter((f) => fs.existsSync(f))
    .forEach((f) => {
      const env = dotenv.config({
        path: f,
      });

      envExpand.expand(env);
    });

  process.env.PUBLIC_URL = process.env.PUBLIC_URL || "";
};

const getEnv = () => {
  return Object.keys(process.env)
    .filter((k) => /^WEB_/.test(k) || k === "PUBLIC_URL")
    .reduce(
      (env, key) => {
        env[key] = process.env[key];

        return env;
      },
      {
        NODE_ENV,
      }
    );
};

// expandEvn([`.env.local`, `.env.${NODE_ENV}`, ".env"]);

// const env = getEnv();

module.exports = {
  expandEvn,
  getEnv,
};
