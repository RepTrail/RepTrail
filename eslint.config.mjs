import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    files: ["src/components/store/**/*.{ts,tsx}"],
    ignores: ["src/components/store/base/**/*"],
    plugins: {
      "@typescript-eslint": ts,
      react: react,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "no-restricted-syntax": [
        "error",
        // 1. Prohibit className Usage (Strict Rule 1)
        {
          // Whitelist specific authorized exceptions (scrollbars, grid svgs, background orbs, z-index layering)
          selector: "JSXAttribute[name.name='className']:not([value.value=/scrollbar|py-20|z-\\[1000\\]|grid\\.svg|ambient-light|blur|animate-pulse|min-h-0|overflow-hidden|shrink-0|font-mono|ml-auto|border-white\\/10|bg-center|mask-image/])",
          message: "className is strictly prohibited outside of 'src/components/store/base/'. Use composition with base components instead. Authorized exceptions: scrollbars, mobile navigation offsets (py-20), depth layering (z-[1000]), and high-fidelity background effects (grids, lights, orbs)."
        },
        // 2. Prohibit Margins (Strict Rule 12)
        {
          selector: "JSXAttribute[name.name=/^(margin|marginX|marginY|marginTop|marginBottom|marginLeft|marginRight|m|mx|my|mt|mb|ml|mr)$/]",
          message: "Manual margins are prohibited. Use <Stack gap={...}> or <Grid gap={...}> for spacing between elements."
        },
        // 3. Prohibit Style Props on non-base components (Strict Rule 15)
        {
          selector: "JSXOpeningElement[name.name!=/[a-z]/]:not(:matches([name.name='Box'], [name.name='Stack'], [name.name='Grid'], [name.name='Font'], [name.name='Button'], [name.name='Input'], [name.name='Icon'], [name.name='Img'], [name.name='Badge'], [name.name='Card'], [name.name='Separator'], [name.name='Logo'], [name.name='FileUpload'], [name.name='FormSwitch'], [name.name='FormSelect'], [name.name='FormCheckbox'], [name.name='Avatar'], [name.name='SidebarLink'], [name.name='Surface'], [name.name='GlassPanel'], [name.name='IconBox'])) > JSXAttribute[name.name=/^(padding|paddingX|paddingY|width|height|minWidth|minHeight|rounded|bg|bgOpacity|hoverBg|hoverBgOpacity|color|border|borderWidth|shadow|inset|top|right|bottom|left|scale|alignSelf|breakAll)$/]",
          message: "Style props (padding, bg, color, width, height, etc.) are only allowed in 'base' components. Non-base components must use semantic variants or composition."
        },
        {
          // HARDENED: Prohibit directional padding/margin in layouts (must use gap/padding tokens)
          // Allow expressions (responsive objects) and whitelisted sidebar tokens
          selector: "JSXAttribute[name.name=/^(paddingTop|paddingBottom|paddingLeft|paddingRight|px|py|pt|pb|pl|pr)$/]:not([value.type='JSXExpressionContainer']):not([value.value=/sidebar|sidebar-wide/])",
          message: "Directional padding (paddingLeft, paddingTop, etc.) is prohibited in layouts. Use uniform padding={5} or authorized paddingY/paddingX in base components only. Exceptions: sidebar/sidebar-wide tokens and responsive objects."
        },
        // 5. Prohibit non-standard Gap tokens (Strict Rule 8)
        {
          selector: "JSXAttribute[name.name='gap'] > JSXExpressionContainer > Identifier[name!=/STORE_TOKENS\\.SPACING\\.(EMPTY_STATE|SECTION|CONTAINER|ELEMENT|PX)/]",
          message: "Prohibited Gap token. Use authorized STORE_TOKENS.SPACING values (EMPTY_STATE: 100, SECTION: 50, CONTAINER: 20, ELEMENT: 10)."
        }
      ],
    },
  },
];
