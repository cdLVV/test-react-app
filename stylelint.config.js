module.exports = {
  extends: [
    "stylelint-config-standard",
    // "stylelint-config-prettier",
    "stylelint-config-recommended",
  ],
  rules: {
    "selector-class-pattern": null,
    "keyframes-name-pattern": null,
    "at-rule-no-unknown": null,
    "selector-pseudo-class-no-unknown": [
      true,
      { ignorePseudoClasses: ["global"] },
    ],
  },
  // customSyntax: require("postcss-less"),
  overrides: [
    {
      files: ["**/*.less"],
      customSyntax: require("postcss-less"),
    },
  ],
};
