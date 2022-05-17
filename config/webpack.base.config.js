const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const { checkEnvIsProduction } = require("./utils");
const paths = require("./paths");
const { existsSync } = require("fs");
const isDev = !checkEnvIsProduction();

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
// const sassRegex = /\.(scss|sass)$/;
// const sassModuleRegex = /\.module\.(scss|sass)$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
const getCSSLoader = ({ less = false, modules }) => {
  const cssLoaderModules = modules
    ? {
        localIdentName: "[name]__[local]--[hash:base64:5]",
        mode: "local",
        // auto: /\.custom-module\.\w+$/i,
      }
    : { mode: "icss" };

  //
  let loaders = [
    {
      loader: require.resolve("style-loader"),
    },
    {
      loader: require.resolve("css-loader"),
      options: {
        importLoaders: less ? 2 : 1,
        sourceMap: isDev,
        modules: cssLoaderModules,
      },
    },
    {
      loader: require.resolve("postcss-loader"),
      options: {
        postcssOptions: {
          plugins: [
            require("postcss-preset-env")({
              autoprefixer: { grid: true },
            }),
            require("tailwindcss"),
          ],
        },
        sourceMap: isDev,
      },
    },
  ];

  loaders = less
    ? loaders.concat([
        {
          loader: require.resolve("less-loader"),
          options: { sourceMap: isDev },
        },
      ])
    : loaders;

  if (!isDev) {
    loaders.splice(0, 1, {
      loader: MiniCssExtractPlugin.loader,
      options: /^(https?:)?\/\/|\//.test(paths.publicUrlOrPath)
        ? {}
        : {
            // static/css内的文件能找到正确的目录
            publicPath: "../../",
          },
    });
  }

  return loaders;
};

const getScriptLoader = ({ isTs = false }) => {
  const presets = [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: { version: 3, proposals: true },
        /**
         * modules: "auto" 不影响treeshaking
         */
      },
    ],
    [
      "@babel/preset-react",
      {
        development: process.env.BABEL_ENV === "development",
        // 自动导入react
        runtime: "automatic",
      },
    ],
    isTs && ["@babel/preset-typescript"],
  ].filter(Boolean);
  return {
    loader: require.resolve("babel-loader"),
    options: {
      cacheDirectory: true,
      cacheCompression: false,
      exclude: [
        // \\ for Windows, \/ for Mac OS and Linux
        /node_modules[\\\/]core-js/,
        /node_modules[\\\/]webpack[\\\/]buildin/,
      ],
      presets,
    },
  };
};
module.exports = (env) => ({
  // mode: isDev ? "development" : "production",
  // devtool: isDev ? "cheap-module-source-map" : "hidden-source-map",
  entry: {
    // index: "./src/index",
    index: {
      import: "./src/index",
      dependOn: "react-vendors",
    },
    "react-vendors": ["react", "react-dom"],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json", ".jsx"],
    alias: {
      "@": paths.appSrc,
    },
  },
  output: {
    path: paths.appBuild,
    filename: !isDev
      ? "static/js/[name].[contenthash:8].js"
      : "static/js/[name].bundle.js",
    chunkFilename: !isDev
      ? "static/js/[name].[contenthash:8].chunk.js"
      : "static/js/[name].chunk.js",
    assetModuleFilename: "static/media/[name].[hash][ext]",
    publicPath: paths.publicUrlOrPath,
    clean: !isDev,
  },
  module: {
    rules: [
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: getCSSLoader({
          modules: false,
        }),
        sideEffects: true,
      },
      {
        test: cssModuleRegex,
        use: getCSSLoader({
          modules: true,
        }),
      },
      {
        test: lessRegex,
        exclude: lessModuleRegex,
        use: getCSSLoader({
          less: true,
          modules: false,
        }),
        sideEffects: true,
      },
      {
        test: lessModuleRegex,
        use: getCSSLoader({
          less: true,
          modules: true,
        }),
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [getScriptLoader({ isTs: false })],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [getScriptLoader({ isTs: true })],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.webp$/, /\.jpe?g$/, /\.png$/],
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 5 * 1024,
          },
        },
      },
    ],
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        polyfill: {
          chunks: "all",
          minChunks: 1,
          test: /core-js|regenerator-runtime/,
          name: "polyfill",
          enforce: true,
          priority: 20,
        },
      },
    },
    usedExports: true,
    innerGraph: true,
    sideEffects: true,
    providedExports: true,
    /**
     * 告知 webpack 使用 TerserPlugin 或其它在 optimization.minimizer定义的插件压缩 bundle
     * TerserPlugin的默认配置，可以删掉unused harmony的代码
     */
    minimize: !isDev,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
          /**
           * 开启为true，就有tree shaking 的作用，但单独开启是没有任何用的，必须配合前面的那些配置，比如usedExports: true
           * optimization.innerGraph可以配合进一步分析未引用的文件
           * optimization.sideEffects为true+package.json中的"sideEffects": false，可以让整个没有引入的模块都不被注册，比如明明something.js模块没有一个导出被真正引用了，但还是有这个module，只是这个module的导出对象是个空对象
           */
          compress: false,
        },
      }),
    ],
  },
  plugins: [
    !isDev &&
      existsSync(paths.appPublic) &&
      new CopyPlugin({
        patterns: [
          {
            from: paths.appPublic,
            to: paths.appBuild,
            // ignore: ["index.html"],
            globOptions: {
              ignore: ["/index.html"],
            },
          },
        ],
      }),
    new HtmlWebpackPlugin({
      title: "测试",
      template: paths.appHtml,
      templateParameters: {
        ...env,
      },
    }),
    !isDev &&
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:8].css",
        chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
      }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify({
        ...env,
      }),
    }),
    // !isDev && new CleanWebpackPlugin(),
    process.env.ANALYZER && new BundleAnalyzerPlugin(),
    new ESLintPlugin({
      extensions: ["js", "mjs", "jsx", "ts", "tsx"],
      eslintPath: require.resolve("eslint"),
      failOnError: !isDev,
      context: paths.appSrc,
      cwd: paths.appPath,
    }),
  ].filter(Boolean),
});
