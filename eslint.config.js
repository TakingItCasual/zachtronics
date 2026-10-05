// eslint.config.js
import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    files: ["**/*.js"],
    plugins: {
      js,
      "@stylistic": stylistic,
    },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": "warn",
      "eqeqeq": "error",
      "no-var": "error",
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/comma-spacing": ["error", {"before": false, "after": true}],
      "@stylistic/dot-location": ["error", "property"],
      "@stylistic/function-call-spacing": "error",
      "@stylistic/keyword-spacing": [
        "error",
        {
          "before": true,
          "after": true,
          "overrides": {
            "if": { "after": false },
            "for": { "after": false },
            "while": { "after": false },
            "switch": { "after": false },
          },
        },
      ],
      "@stylistic/no-multi-spaces": "error",
      "@stylistic/no-tabs": "error",
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": "error",
      "@stylistic/space-before-blocks": "error",
      "@stylistic/space-before-function-paren": ["error", "never"],
      "@stylistic/space-in-parens": "error",
      "@stylistic/space-infix-ops": "error",
    },
  },
]);
