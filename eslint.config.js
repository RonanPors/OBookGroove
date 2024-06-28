import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    rules: {
      indent: ["error", 2],
      "comma-dangle": ["error", "always-multiline"],
      "eol-last": ["error", "always"],
      semi: ["error", "always"],
      "semi-style": ["error", "last"],
      "no-trailing-spaces": "error",
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  pluginJs.configs.recommended,
];