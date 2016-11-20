module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:import/errors'
  ],
  env: {
    es6: true,
    browser: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    strict: 'off',
    indent: ['error', 2],
    'prefer-const': 'error',
    'no-unused-vars': 'error',
    quotes: ['error', 'single'],
    'no-underscore-dangle': 'off',
    'keyword-spacing': 'error',
    semi: ['error', 'never'],
    'object-curly-spacing': ['error', 'never'],
    'space-in-parens': ['error', 'never'],
    'key-spacing': 'error'
  }
}