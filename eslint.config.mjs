import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/out/**"
    ]
  },
  {
    files: [
      "src/**/*.{ts,tsx}"
    ],
    ignores: [
      "src/components/store/base/**/*",
      "src/components/store/constants/**/*",
      "src/components/landing/**/*",
      "src/components/shared/**/*",
      "src/components/store/base/iphone-mockup.tsx",
      "src/components/store/advanced/student-share-transformation.tsx",
      "src/app/aluno/**/*",
      "src/app/personal/**/*",
      "src/app/afiliados/**/*",
      "src/app/page.tsx",
      "src/app/buscar-personal/**/*",
      "src/app/design-system/**/*",
      "src/actions/**/*",
      "src/hooks/**/*",
      "src/lib/**/*",
      "src/services/**/*",
      "src/types/**/*"
    ],
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
          // Whitelist specific authorized exceptions (scrollbars, grid svgs, background orbs, z-index layering, icons, overrides)
          selector: "JSXAttribute[name.name='className'][value.type='Literal']:not([value.value=/scrollbar|py-20|py-25|z-\\[|grid\\.svg|ambient-light|blur|animate-|min-h-|overflow-hidden|shrink-0|font-mono|ml-auto|border-white\\/10|bg-center|mask-image|bg-transparent|border-0|w-4|h-4|w-5|h-5|w-3\\.5|h-3\\.5|w-full|h-full|active:scale-|outline-none|ring-0|pointer-events-none|bg-gradient-|from-|via-|to-|inset-|group|object-cover|object-contain|-translate-/])",
          message: "className is strictly prohibited outside of 'src/components/store/base/'. Use composition with base components instead. Authorized exceptions: scrollbars, mobile navigation offsets (py-20, py-25), depth layering (z-[1000]), high-fidelity background effects (grids, lights, orbs), standard icons, seamless textareas, and proportional layout wraps."
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
        // 4. Prohibit directional padding/margin in layouts
        {
          // HARDENED: Prohibit directional padding/margin in layouts (must use gap/padding tokens)
          // Allow expressions (responsive objects) and whitelisted sidebar tokens
          selector: "JSXAttribute[name.name=/^(paddingTop|paddingBottom|paddingLeft|paddingRight|px|py|pt|pb|pl|pr)$/]:not([value.type='JSXExpressionContainer']):not([value.value=/sidebar|sidebar-wide/])",
          message: "Directional padding (paddingLeft, paddingTop, etc.) is prohibited in layouts. Use uniform padding={5} or authorized paddingY/paddingX in base components only. Exceptions: sidebar/sidebar-wide tokens and responsive objects."
        },
        // 5. Strict STORE_TOKENS Enforcement
        {
          selector: "JSXAttribute[name.name=/^(gap|rowGap|columnGap|padding|paddingX|paddingY|pt|pb|pl|pr|px|py|rounded|bg|color|hoverBg|borderColor|groupHoverBorderColor|opacity|bgOpacity|borderOpacity|hoverBgOpacity|groupHoverOpacity|zIndex)$/] Literal:not([raw='null']):not([raw='true']):not([raw='false'])",
          message: "Raw string or number literals are strictly prohibited for design system properties. You MUST use STORE_TOKENS from '@/components/store/constants/tokens'."
        },
        // 6. Prohibit inline style Attribute (Strict Rule 2)
        {
          // Only prohibit inline style on non-base components/HTML elements
          selector: "JSXOpeningElement:not(:matches([name.name='Box'], [name.name='Stack'], [name.name='Grid'], [name.name='Font'], [name.name='Button'], [name.name='Input'], [name.name='Icon'], [name.name='Img'], [name.name='Badge'], [name.name='Card'], [name.name='Separator'], [name.name='Logo'], [name.name='FileUpload'], [name.name='FormSwitch'], [name.name='FormSelect'], [name.name='FormCheckbox'], [name.name='Avatar'], [name.name='SidebarLink'], [name.name='Surface'], [name.name='GlassPanel'], [name.name='IconBox'])) > JSXAttribute[name.name='style']",
          message: "Inline styles (style prop) are strictly prohibited outside of base primitives. Use base design system components (Box, Stack, etc.) for layout and styling."
        },

        // 10. Prohibit primitive HTML tags outside base/ (Architecture Rule §4 + §1)
        // Exceptions: form (required by Next.js Server Actions), button[type=submit] (hidden submit triggers),
        //             canvas (image export), svg/path/circle/... (icon rendering internals).
        {
          selector: "JSXOpeningElement[name.name=/^(div|span|p|h1|h2|h3|h4|h5|h6|br|strong|em|b|i|ul|li|ol|dl|dt|dd|table|thead|tbody|tfoot|tr|td|th|aside|article|nav|header|footer|main|section|blockquote|pre|code|small|sub|sup|mark|hr|input|label|select|textarea)$/]",
          message: "Primitive HTML tag is prohibited outside 'src/components/store/base/'. Replace with design system components: div/section → Box, span/p/h1-h6/strong → Font, ul/li → Stack, button → Button, input → Input, label → Font, textarea → Textarea, select → FormSelect, hr → Separator."
        }
      ],
    },
  },
];
