module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  let changed = false;

  const SPACING_MAP = {
    '2.5': 'ELEMENT',
    '5': 'CONTAINER',
    '7.5': 'GRID',
    '10': 'STACK',
    '12.5': 'EMPTY_STATE',
    'section': 'SECTION'
  };

  const PADDING_MAP = {
    '2.5': 'ELEMENT',
    '5': 'CONTAINER',
    '7.5': 'GRID',
    '10': 'STACK',
    '12.5': 'EMPTY_STATE',
    'section': 'SECTION'
  };

  // Process gap and padding attributes
  root.find(j.JSXAttribute).forEach(path => {
    const name = path.node.name.name;
    if (name !== 'gap' && name !== 'padding') return;

    let valueNode = path.node.value;
    let rawValue;

    if (valueNode.type === 'JSXExpressionContainer') {
      if (valueNode.expression.type === 'Literal' || valueNode.expression.type === 'NumericLiteral') {
        rawValue = String(valueNode.expression.value);
      }
    } else if (valueNode.type === 'Literal' || valueNode.type === 'StringLiteral') {
      rawValue = String(valueNode.value);
    }

    if (rawValue) {
      const map = name === 'gap' ? SPACING_MAP : PADDING_MAP;
      const tokenKey = map[rawValue];
      if (tokenKey) {
        const category = name === 'gap' ? 'SPACING' : 'PADDING';
        path.node.value = j.jsxExpressionContainer(
          j.memberExpression(
            j.memberExpression(
              j.identifier('STORE_TOKENS'),
              j.identifier(category)
            ),
            j.identifier(tokenKey)
          )
        );
        changed = true;
      }
    }
  });

  if (changed) {
    // Add import if missing
    const hasImport = root.find(j.ImportDeclaration, {
      source: { value: value => value.endsWith('/tokens') }
    }).length > 0;

    if (!hasImport) {
      // Determine relative path depth
      const parts = fileInfo.path.split(/[\\/]/);
      const storeIndex = parts.indexOf('store');
      let relativePath = '../constants/tokens';
      
      if (storeIndex !== -1) {
        const depth = parts.length - storeIndex - 2;
        if (depth > 0) {
          relativePath = '../'.repeat(depth) + 'constants/tokens';
        } else if (depth === -1) {
             // In store root (constants is sibling)
             relativePath = './constants/tokens';
        } else {
             // In a folder inside store (like features)
             relativePath = '../constants/tokens';
        }
      }

      const importDecl = j.importDeclaration(
        [j.importSpecifier(j.identifier('STORE_TOKENS'))],
        j.literal(relativePath)
      );

      // Insert at the top, after existing imports if possible
      const imports = root.find(j.ImportDeclaration);
      if (imports.length > 0) {
        j(imports.at(-1).get()).insertAfter(importDecl);
      } else {
        root.get().node.program.body.unshift(importDecl);
      }
    }
  }

  return changed ? root.toSource() : null;
};
