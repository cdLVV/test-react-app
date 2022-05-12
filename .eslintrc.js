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
    "plugin:react/jsx-runtime",
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
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true
    },
    react: {
      pragma: 'React', // FWIW, I tried without as well.
      version: '18.1.0', // Tried with explicit version number as well.
    }
  },
  rules: {
    // "react/react-in-jsx-scope": 0,
    "@typescript-eslint/ban-types": 0,
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "react-hooks/exhaustive-deps": 1,
  },
};
