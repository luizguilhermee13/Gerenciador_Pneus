import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**", ".git/**", ".firebase/**"],
  },

  js.configs.recommended,

  {
    files: ["assets/js/**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.browser,

        // Chart.js é carregado pelo CDN no HTML
        Chart: "readonly",
      },
    },

    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-unreachable": "error",
    },
  },

  {
    files: ["backend/**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.node,
      },
    },

    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-unreachable": "error",
    },
  },
];
