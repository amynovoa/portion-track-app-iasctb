
// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo'],
  root: true,
  ignorePatterns: ['/dist/*', '/public/*', '/babel-plugins/*'],
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "react/react-in-jsx-scope": "off",
    "react/no-unescaped-entities": "off",
    "prefer-const": "off",
    "react/prop-types": "off",
    "no-case-declarations": "off",
    "no-empty": "off",
    "react/display-name": "off",
    "no-var": "off"
  },
  overrides: [
    {
      files: ['metro.config.js', 'babel.config.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
};
