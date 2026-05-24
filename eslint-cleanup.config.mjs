import tsParser from "@typescript-eslint/parser";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  {
    files: ["src/**/*.{ts,tsx}", "src/**/*.{js,jsx}"],
    plugins: {
      "unused-imports": unusedImports,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
    },
  },
];
