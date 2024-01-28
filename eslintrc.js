module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "jsx-a11y", "react-hooks"],
  rules: {
    // Other rules...

    // Disable the exhaustive-deps rule for specific lines
    "react-hooks/exhaustive-deps": "off",
    "react/prop-types": "off",
    // Disable the rule for a specific line
    "react/react-in-jsx-scope": "off",
    // Disable the quotes rule for specific lines
    // Disable specific rules
    "react/jsx-key": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
  },
};
