import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
    {
    // Design System Enforcement Rules
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        // 1. Prohibit manual className usage (Tailwind) outside of the 'base' directory
        {
          selector: "JSXAttribute[name.name='className']:not(:matches(" + 
            "[name.name='className'][value.value='custom-scrollbar'], " +
            "[name.name='className'][value.value='no-scrollbar'], " +
            "[name.name='className'][value.value*='py-20'], " +
            "[name.name='className'][value.value*='z-[1000]'], " +
            "[name.name='className'][value.value*='focus-within:z-[1000]'], " +
            "[name.name='className'][value.value*='md:py-0'], " +
            "[name.name='className'][value.value*='md:pt-0'], " +
            "[name.name='className'][value.value*='md:pb-0'], " +
            "[name.name='className'][value.value*='shrink-0'], " +
            "[name.name='className'][value.value*='min-w-fit'], " +
            "[name.name='className'][value.value*='px-5'], " +
            "[name.name='className'][value.value*='bg-[url'], " +
            "[name.name='className'][value.value*='mask-image'], " +
            "[name.name='className'][value.value*='blur-'], " +
            "[name.name='className'][value.value*='pointer-events-none']" +
          "))",
          message: "className is strictly prohibited outside of 'src/components/store/base/'. Use composition with base components instead. Authorized exceptions: scrollbars, mobile navigation offsets (py-20), depth layering (z-[1000]), and high-fidelity background effects (grids, lights)."
        },
        // 2. Prohibit Margins (Strict Rule 12)
        {
          selector: "JSXAttribute[name.name=/^(margin|mt|mb|ml|mr|mx|my)$/]",
          message: "Margins (mt, mb, ml, mr) are strictly prohibited. Use 'gap' in the parent container or padding tokens."
        },
        // 3. Prohibit Style Props in non-base components (Strict Rule 2 & 18)
        {
          selector: "JSXOpeningElement[name.name!=/[a-z]/]:not(:matches([name.name='Box'], [name.name='Stack'], [name.name='Grid'], [name.name='Font'], [name.name='Button'], [name.name='Input'], [name.name='Icon'], [name.name='Img'], [name.name='Badge'], [name.name='Card'], [name.name='Separator'], [name.name='Logo'], [name.name='FileUpload'], [name.name='FormSwitch'], [name.name='FormSelect'], [name.name='FormCheckbox'], [name.name='Avatar'], [name.name='SidebarLink'])) > JSXAttribute[name.name=/^(padding|paddingX|paddingY|width|height|rounded|bg|bgOpacity|color|border|borderWidth|shadow|inset|top|right|bottom|left)$/]",
          message: "Style props (padding, bg, color, width, height, etc.) are only allowed in 'base' components. Non-base components must use semantic variants or composition."
        },
        // 4. Prohibit directional padding (pt, pb, etc.) in layouts
        {
          selector: "JSXAttribute[name.name=/^(paddingTop|paddingBottom|paddingLeft|paddingRight|px|py|pt|pb|pl|pr)$/]",
          message: "Directional padding (paddingX, paddingY, etc.) is prohibited in layouts. Use uniform padding={5} or gap tokens."
        },
        // 5. Prohibit non-standard Gap tokens (Strict Rule 8)
        {
          selector: "JSXAttribute[name.name='gap'][value.type='Literal'][value.value!=5][value.value!=2.5][value.value!=12][value.value!=12.5][value.value!=0][value.value!=1]:not([value.value='section']):not([value.value='title-content'])",
          message: "Unauthorized gap token. Use only 5, 2.5, 12, 12.5, 0, 1 or authorized string aliases ('section', 'title-content')."
        },
        // 6. Prohibit non-standard Padding tokens (Strict Rule 7 & 12)
        {
          selector: "JSXAttribute[name.name='padding'][value.type='Literal'][value.value!=5][value.value!=2.5][value.value!=12][value.value!=0][value.value!=1]",
          message: "Unauthorized padding token. Use only 5, 2.5, 0, 1 or the exception 12 (48px) for high-fidelity containers."
        },
        // 7. Prohibit restricted radii (Strict Rule 7)
        {
          selector: "JSXAttribute[name.name='rounded'][value.value=/^(md|lg|xl|2xl|3xl|4xl)$/]",
          message: "Unauthorized border radius. Use rounded='system' (5px) or rounded='full'."
        },
        // 8. Prohibit self-alignment hacks (Strict Rule 12)
        {
          selector: "JSXAttribute[name.name=/^(self|justifySelf|alignSelf)$/]",
          message: "Self-alignment props (self-start, etc.) are prohibited. Layout must be controlled by the parent container (Stack/Grid)."
        }
      ]
    }
  },
  {
    // Exclude 'base' components from className restrictions
    files: ["src/components/store/base/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": "off"
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
