import eslintConfig from '@stheine/helpers/eslint.config';

export default [
  ...eslintConfig,
  {
    rules: {
      'linebreak-style': 0,
      'sort-imports': 0,
      'space-before-function-paren': 0,
      'object-shorthand': 0,
    },
  },
];
