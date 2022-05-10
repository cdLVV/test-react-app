module.exports = {
  customSyntax: require("postcss-less"),
  extends: require.resolve('stylelint-config-recommended'),
  rules: {
    'at-rule-no-unknown': null,
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],
  },
};
