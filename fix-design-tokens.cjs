/**
 * fix-design-tokens.cjs
 * jscodeshift AST codemod — RepTrail Design System
 * 
 * Replaces hardcoded string and number literals for design system properties
 * with their STORE_TOKENS equivalents.
 * 
 * Run from web/ directory:
 *   npx jscodeshift --extensions=tsx,ts --parser=tsx -t fix-design-tokens.cjs \
 *     src/components/store/intermediary \
 *     src/components/store/advanced \
 *     src/components/store/sections \
 *     src/app
 */

'use strict';

const PROP_TO_NAMESPACE = {
  gap: 'SPACING',
  rowGap: 'SPACING',
  columnGap: 'SPACING',
  padding: 'PADDING',
  paddingX: 'PADDING',
  paddingY: 'PADDING',
  pt: 'PADDING', pb: 'PADDING', pl: 'PADDING', pr: 'PADDING', px: 'PADDING', py: 'PADDING',
  rounded: 'RADIUS',
  bg: 'COLORS',
  color: 'COLORS',
  hoverBg: 'COLORS',
  borderColor: 'COLORS',
  groupHoverBorderColor: 'COLORS',
  opacity: 'OPACITY',
  bgOpacity: 'OPACITY',
  borderOpacity: 'OPACITY',
  hoverBgOpacity: 'OPACITY',
  groupHoverOpacity: 'OPACITY',
  zIndex: 'Z_INDEX'
};

const MAPS = {
  SPACING: {
    'container': 'CONTAINER',
    'element': 'ELEMENT',
    'section': 'SECTION',
    'empty_state': 'EMPTY_STATE',
    'none': 'NONE',
    'title-content': 'TITLE_CONTENT',
    'title-content': 'TITLE_CONTENT',
    'header-gap': 'HEADER_GAP', // fallback if exists
    '5': 'CONTAINER',
    '2.5': 'ELEMENT',
    '12.5': 'SECTION',
    '0': 'NONE',
    '10': 'ELEMENT',
    '20': 'CONTAINER',
    '50': 'SECTION',
    '100': 'EMPTY_STATE',
    'tiny': 'NONE',
    '1': 'NONE',
    '2': 'ELEMENT',
    '3': 'ELEMENT',
    '4': 'ELEMENT',
    '6': 'CONTAINER',
    '8': 'CONTAINER'
  },
  PADDING: {
    'container': 'CONTAINER',
    'element': 'ELEMENT',
    'section': 'SECTION',
    'empty_state': 'EMPTY_STATE',
    'none': 'NONE',
    'safe_area': 'SAFE_AREA_INSET',
    '5': 'CONTAINER',
    '2.5': 'ELEMENT',
    '12.5': 'SECTION',
    '12': 'EMPTY_STATE', // old exception mapping
    '0': 'NONE',
    '10': 'ELEMENT',
    '20': 'CONTAINER',
    '50': 'SECTION',
    '100': 'EMPTY_STATE',
    'tiny': 'NONE',
    '1': 'NONE',
    '2': 'ELEMENT',
    '3': 'ELEMENT',
    '4': 'ELEMENT',
    '6': 'CONTAINER',
    '8': 'CONTAINER'
  },
  RADIUS: {
    'system': 'SYSTEM',
    'full': 'FULL',
    'none': 'NONE'
  },
  COLORS: {
    'brand': 'BRAND',
    'primary': 'BRAND',
    'success': 'SUCCESS',
    'emerald': 'SUCCESS',
    'error': 'ERROR',
    'red': 'ERROR',
    'warning': 'WARNING',
    'amber': 'WARNING',
    'info': 'INFO',
    'blue': 'INFO',
    'background': 'BACKGROUND',
    'zinc': 'BACKGROUND',
    'surface': 'SURFACE',
    'shelf': 'SHELF',
    'white': 'WHITE',
    'black': 'BLACK',
    'transparent': 'TRANSPARENT',
    'zinc-400': 'TEXT.SECONDARY',
    'zinc-500': 'TEXT.MUTED',
    'zinc-600': 'TEXT.DIM',
    'white/5': 'DIVIDER.SUBTLE',
    'white/10': 'DIVIDER.STANDARD',
    'white/20': 'DIVIDER.STRONG',
    'foreground': 'WHITE',
    'muted': 'TEXT.MUTED',
    'current': 'TRANSPARENT', // fallback
    'orange': 'BRAND',
    'emerald': 'SUCCESS',
    'red': 'ERROR',
    'zinc': 'BACKGROUND',
    'gray': 'BACKGROUND'
  },
  OPACITY: {
    '100': 'FULL',
    '95': 'SURFACE',
    '90': 'SHELF',
    '80': 'SHELF',
    '70': 'OVERLAY',
    '60': 'OVERLAY',
    '50': 'MODAL',
    '40': 'SIDEBAR',
    '30': 'HIGH',
    '20': 'MEDIUM',
    '10': 'SUBTLE',
    '5': 'LOW',
    '0': 'NONE'
  },
  Z_INDEX: {
    '10': 'CONTENT',
    '20': 'OVERLAY',
    '30': 'OVERLAY',
    '40': 'OVERLAY',
    '50': 'OVERLAY',
    '100': 'OVERLAY'
  }
};

function createTokenAST(j, tokenString) {
  const parts = tokenString.split('.');
  let expr = j.identifier(parts[0]);
  for (let i = 1; i < parts.length; i++) {
    expr = j.memberExpression(expr, j.identifier(parts[i]));
  }
  return expr;
}

module.exports = function transformer(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  let dirty = false;
  let needsImport = false;

  root.find(j.JSXAttribute).filter(path => {
    const nameNode = path.node.name;
    const name = nameNode.type === 'JSXIdentifier' ? nameNode.name : null;
    return name && Object.keys(PROP_TO_NAMESPACE).includes(name);
  }).forEach(path => {
    const name = path.node.name.name;
    const namespace = PROP_TO_NAMESPACE[name];
    const val = path.node.value;
    
    if (!val) return;

    // Handle direct string literal e.g. gap="container"
    if (val.type === 'Literal' || val.type === 'StringLiteral') {
      const rawVal = String(val.value).toLowerCase();
      const mappedKey = MAPS[namespace][rawVal];
      
      if (mappedKey) {
        path.node.value = j.jsxExpressionContainer(createTokenAST(j, `STORE_TOKENS.${namespace}.${mappedKey}`));
        dirty = true;
        needsImport = true;
      }
    } 
    // Handle JSXExpressionContainer e.g. gap={5}, gap={{ base: 5 }}, color={isActive ? "primary" : "white"}
    else if (val.type === 'JSXExpressionContainer') {
      j(path).find(j.Literal).forEach(literalPath => {
        // Skip property keys (e.g. 'base' in { base: 5 })
        const parentType = literalPath.parent.node.type;
        if (parentType === 'Property' && literalPath.parent.node.key === literalPath.node) return;
        
        const rawVal = String(literalPath.node.value).toLowerCase();
        const mappedKey = MAPS[namespace][rawVal];
        
        if (mappedKey) {
          j(literalPath).replaceWith(createTokenAST(j, `STORE_TOKENS.${namespace}.${mappedKey}`));
          dirty = true;
          needsImport = true;
        }
      });
    }
  });

  if (dirty && needsImport) {
    // Check if STORE_TOKENS is imported
    const imports = root.find(j.ImportDeclaration, {
      source: { value: '@/components/store/constants/tokens' }
    });
    
    if (imports.size() === 0) {
      // Add import at the top
      root.find(j.Program).get('body', 0).insertBefore(
        j.importDeclaration(
          [j.importSpecifier(j.identifier('STORE_TOKENS'))],
          j.literal('@/components/store/constants/tokens')
        )
      );
    } else {
      // Check if STORE_TOKENS is in the import specifiers
      let hasTokenImport = false;
      imports.forEach(path => {
        path.node.specifiers.forEach(spec => {
          if (spec.imported && spec.imported.name === 'STORE_TOKENS') {
            hasTokenImport = true;
          }
        });
        if (!hasTokenImport) {
          path.node.specifiers.push(j.importSpecifier(j.identifier('STORE_TOKENS')));
        }
      });
    }
  }

  if (!dirty) return null;
  return root.toSource({ quote: 'single', reuseWhitespace: true });
};
