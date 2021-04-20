module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  plugins: ['stylelint-scss'],
  rules: {
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind'],
      },
    ],
    'no-descending-specificity': null,
    'selector-pseudo-element-colon-notation': 'single',
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: 'v-deep',
      },
    ],
    'value-keyword-case': null,
    'no-empty-source': null,
    'font-family-no-missing-generic-family-keyword': [
      true,
      {
        ignoreFontFamilies: 'feather',
      },
    ],
  },
}
