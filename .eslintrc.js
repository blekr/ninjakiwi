module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "airbnb"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "prettier"
  ],
  "rules": {
    "prettier/prettier": "error",
    "react/jsx-filename-extension": "off",
    "comma-dangle": ["error", "never"],
    "react/jsx-one-expression-per-line": "off",
    "react/prop-types": "off"
  }
};
