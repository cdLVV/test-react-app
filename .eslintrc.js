module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    commonjs: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "react-hooks", "@typescript-eslint"],
  //   overrides: [
  //     {
  //       files: ["src/**/*.js", "src/**/*.ts", "src/**/*.tsx", "src/**/*.jsx"],
  //       excludedFiles: "config",
  //     },
  //   ],
  rules: {
    "react/react-in-jsx-scope": 0,
    "@typescript-eslint/ban-types": 0,
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "react-hooks/exhaustive-deps": 1,
  },
};
