module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ['airbnb'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    chrome: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': 'off',
    'comma-dangle': ['error', 'never'],
    'react/jsx-one-expression-per-line': 'off',
    'react/prop-types': 'off',
    'arrow-parens': 'off',
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    'space-before-function-paren': 'off',
    'operator-linebreak': 'off'
  }
};
