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
        // 5. Prohibit non-standard Gap tokens (Strict Rule 8)
        {
          selector: "JSXAttribute[name.name='gap'] > JSXExpressionContainer > Identifier[name!=/STORE_TOKENS\\.SPACING\\.(EMPTY_STATE|SECTION|CONTAINER|ELEMENT|PX)/]",
          message: "Prohibited Gap token. Use authorized STORE_TOKENS.SPACING values (EMPTY_STATE: 100, SECTION: 50, CONTAINER: 20, ELEMENT: 10)."
        },
        // 6. Prohibit inline style Attribute (Strict Rule 2)
        {
          // Only prohibit inline style on non-base components/HTML elements
          selector: "JSXOpeningElement:not(:matches([name.name='Box'], [name.name='Stack'], [name.name='Grid'], [name.name='Font'], [name.name='Button'], [name.name='Input'], [name.name='Icon'], [name.name='Img'], [name.name='Badge'], [name.name='Card'], [name.name='Separator'], [name.name='Logo'], [name.name='FileUpload'], [name.name='FormSwitch'], [name.name='FormSelect'], [name.name='FormCheckbox'], [name.name='Avatar'], [name.name='SidebarLink'], [name.name='Surface'], [name.name='GlassPanel'], [name.name='IconBox'])) > JSXAttribute[name.name='style']",
          message: "Inline styles (style prop) are strictly prohibited outside of base primitives. Use base design system components (Box, Stack, etc.) for layout and styling."
        },
        // 7. Prohibit non-authorized numerical or string gap values (Rule 8 / 99)
        {
          selector: "JSXAttribute[name.name='gap'] > JSXExpressionContainer > Literal:not([value=0]):not([value=2.5]):not([value=5]):not([value=12.5])",
          message: "Prohibited manual numerical gap. The only accepted gap numbers are: 0, 2.5, 5, 12.5."
        },
        {
          selector: "JSXAttribute[name.name='gap'] > Literal:not([value='0']):not([value='2.5']):not([value='5']):not([value='12.5']):not([value='section']):not([value='title-content']):not([value='tiny']):not([value='element']):not([value='container']):not([value='empty_state']):not([value='none']):not([value='header-gap'])",
          message: "Prohibited gap string value. Use authorized tokens (section, title-content, container, element, tiny, none) or accepted numbers (0, 2.5, 5, 12.5)."
        },
        // 8. Prohibit fixed manual sizes (px/rem) in width/height (Rules 15 & 16)
        {
          // Prohibit numerical sizes like 240px, 10rem but allow the tailwind native "px" separator token
          selector: "JSXAttribute[name.name=/^(width|height)$/] > Literal[value=/\\d+(px|rem|em)/]",
          message: "Manual pixel/rem units are prohibited for width and height. Use dynamic/proportional tokens (full, auto, screen, %, etc.) or standard base scale numbers."
        },
        // 9. Prohibit unauthorized padding values (Rule 86 & 124)
        {
          selector: "JSXAttribute[name.name=/^(padding|paddingX|paddingY)$/] > JSXExpressionContainer > Literal[value=6][value=8]",
          message: "Padding values of 6 or 8 are strictly prohibited. Use uniform padding={5} (20px), padding={2.5} (10px) or padding={12} (48px, desktop-only empty state exceptions)."
        },
        {
          selector: "JSXAttribute[name.name=/^(padding|paddingX|paddingY)$/] > Literal[value=/^(6|8|p-6|p-8)$/]",
          message: "Padding values of 6 or 8 (or p-6, p-8) are strictly prohibited. Use uniform padding={5} (20px), padding={2.5} (10px) or padding={12} (48px, desktop-only empty state exceptions)."
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
