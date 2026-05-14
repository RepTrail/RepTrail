module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  const spacingMap = {
    '2': 2.5,
    '3': 2.5,
    '4': 5,
    '6': 5,
    '7': 5,
    '8': 5,
    '9': 12,
    '10': 12,
    '11': 12.5
  };

  const spacingProps = ['gap', 'padding', 'paddingX', 'paddingY', 'top', 'bottom', 'left', 'right', 'p', 'px', 'py', 'm', 'mx', 'my'];

  function fixValue(node) {
    if (!node) return;
    
    // Handle Literal (number or string)
    if (node.type === 'Literal' || node.type === 'StringLiteral' || node.type === 'NumericLiteral') {
      const val = String(node.value);
      if (spacingMap[val] !== undefined) {
        node.value = spacingMap[val];
        // If it was a string literal, we might want to keep it as string if the component expects it,
        // but our primitives expect numbers for spacing tokens.
        if (typeof node.value === 'number' && node.type === 'StringLiteral') {
           // Can't easily change type in some jscodeshift versions without replacing the node
        }
      }
    }
  }

  root.find(j.JSXAttribute).forEach(path => {
    if (spacingProps.includes(path.value.name.name)) {
      const value = path.value.value;
      if (!value) return;

      // Case 1: gap={8} or gap="8"
      if (value.type === 'JSXExpressionContainer') {
        const expression = value.expression;
        
        // Literal inside container: gap={8}
        if (expression.type === 'Literal' || expression.type === 'NumericLiteral') {
          const val = String(expression.value);
          if (spacingMap[val] !== undefined) {
            expression.value = spacingMap[val];
          }
        }
        
        // Object expression: gap={{ base: 4, md: 8 }}
        if (expression.type === 'ObjectExpression') {
          expression.properties.forEach(prop => {
            if (prop.type === 'Property' && (prop.value.type === 'Literal' || prop.value.type === 'NumericLiteral')) {
              const val = String(prop.value.value);
              if (spacingMap[val] !== undefined) {
                prop.value.value = spacingMap[val];
              }
            }
          });
        }
      } else if (value.type === 'Literal') {
        // Simple string literal: gap="8"
        const val = String(value.value);
        if (spacingMap[val] !== undefined) {
          value.value = spacingMap[val];
        }
      }
    }
  });

  // Also replace deprecated tokens in STORE_TOKENS
  root.find(j.MemberExpression).forEach(path => {
    if (path.value.object.name === 'STORE_TOKENS') {
      const propertyName = path.value.property.name;
      if (propertyName === 'GRID' || propertyName === 'STACK') {
        path.value.property.name = 'SPACING';
      } else if (propertyName === 'MAIN') {
        path.value.property.name = 'PADDING';
      }
    }
  });

  return root.toSource();
};
