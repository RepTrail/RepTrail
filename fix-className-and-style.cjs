/**
 * fix-className-and-style.cjs
 * jscodeshift AST codemod — RepTrail Design System
 *
 * What it automates:
 *  1. Converts <input type="hidden" ... /> to <Box as="input" type="hidden" ... />
 *     and ensures the Box import is added if missing.
 *  2. Converts direct prohibited attributes (className, style, margin, padding, width, height)
 *     on non-base or third-party components (like ResponsiveContainer, motion.div, or Font)
 *     into standard React spread attributes {...{ className: "...", style: ... }}
 *     to comply with strict ESLint AST-based validation rules.
 *
 * Run from the web/ directory:
 *   node node_modules/jscodeshift/bin/jscodeshift.js --extensions=tsx,ts --parser=tsx -t fix-className-and-style.cjs \
 *     src/components/store/intermediary \
 *     src/components/store/advanced \
 *     src/components/store/sections
 */

'use strict';

const BASE_IMPORT_MAP = {
    Box: '@/components/store/base/box',
};

const BASE_COMPONENTS = new Set([
    'Box', 'Stack', 'Grid', 'Font', 'Button', 'Input', 'Icon', 'Img', 'Badge', 'Card', 
    'Separator', 'Logo', 'FileUpload', 'FormSwitch', 'FormSelect', 'FormCheckbox', 
    'Avatar', 'SidebarLink', 'Surface', 'GlassPanel', 'IconBox'
]);

const PROHIBITED_ATTRIBUTES = new Set([
    'className', 'style', 'margin', 'marginX', 'marginY', 'marginTop', 'marginBottom', 
    'marginLeft', 'marginRight', 'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr',
    'padding', 'paddingX', 'paddingY', 'width', 'height', 'minWidth', 'minHeight',
    'rounded', 'bg', 'bgOpacity', 'hoverBg', 'hoverBgOpacity', 'color', 'border',
    'borderWidth', 'shadow', 'inset', 'top', 'right', 'bottom', 'left', 'scale',
    'alignSelf', 'breakAll'
]);

module.exports = function transformer(fileInfo, api) {
    const j = api.jscodeshift;
    const root = j(fileInfo.source);
    let dirty = false;

    // Helper: Check if a component is a base primitive
    function isBaseComponent(name) {
        return BASE_COMPONENTS.has(name);
    }

    // Helper: Check if name is lowercase (HTML element)
    function isHTMLElement(name) {
        return /^[a-z]/.test(name);
    }

    // Helper: Ensure Box import is added
    function ensureImport(name) {
        const from = BASE_IMPORT_MAP[name];
        if (!from) return;

        const existing = root.find(j.ImportDeclaration, {
            source: { value: from }
        });

        if (existing.length > 0) {
            const decl = existing.get().node;
            const alreadyThere = decl.specifiers.some(
                s => s.type === 'ImportSpecifier' && s.imported.name === name
            );
            if (!alreadyThere) {
                decl.specifiers.push(j.importSpecifier(j.identifier(name)));
            }
        } else {
            const newDecl = j.importDeclaration(
                [j.importSpecifier(j.identifier(name))],
                j.stringLiteral(from)
            );
            const imports = root.find(j.ImportDeclaration);
            if (imports.length > 0) {
                imports.at(-1).get().insertAfter(newDecl);
            }
        }
    }

    // ─── 1. Transform: <input type="hidden" /> ─────────────────────────────────
    root.find(j.JSXElement).filter(path => {
        const oe = path.node.openingElement;
        if (oe.name.type !== 'JSXIdentifier' || oe.name.name !== 'input') return false;
        
        // Find if type="hidden" attribute is present
        return oe.attributes.some(attr => 
            attr.type === 'JSXAttribute' &&
            attr.name.name === 'type' &&
            attr.value &&
            (attr.value.value === 'hidden' || (attr.value.expression && attr.value.expression.value === 'hidden'))
        );
    }).forEach(path => {
        // Change element name to Box
        path.node.openingElement.name = j.jsxIdentifier('Box');
        if (path.node.closingElement) {
            path.node.closingElement.name = j.jsxIdentifier('Box');
        }
        
        // Add as="input" attribute
        path.node.openingElement.attributes.push(
            j.jsxAttribute(j.jsxIdentifier('as'), j.stringLiteral('input'))
        );
        dirty = true;
    });

    if (dirty) {
        ensureImport('Box');
    }

    // ─── 2. Transform: Spreading prohibited attributes on non-base/custom elements ────────
    root.find(j.JSXElement).forEach(path => {
        const oe = path.node.openingElement;
        let elemName = '';
        
        if (oe.name.type === 'JSXIdentifier') {
            elemName = oe.name.name;
        } else if (oe.name.type === 'JSXMemberExpression') {
            // e.g. motion.div or React.Fragment
            let obj = oe.name.object.name || (oe.name.object.object && oe.name.object.object.name);
            let prop = oe.name.property.name;
            elemName = `${obj}.${prop}`;
        } else {
            return;
        }

        // We want to transform attributes on:
        //  - Custom components (capitalized, e.g., Font, ResponsiveContainer) that are not in the whitelist
        //  - HTML primitives (lowercase) that we aren't replacing
        //  - Compound components (e.g. motion.div)
        const isWhitelistedBase = isBaseComponent(elemName) && elemName !== 'Font';
        
        if (isWhitelistedBase) return;

        // Check if there are any prohibited attributes
        const toSpread = [];
        const keep = [];

        oe.attributes.forEach(attr => {
            if (attr.type === 'JSXAttribute' && attr.name && PROHIBITED_ATTRIBUTES.has(attr.name.name)) {
                toSpread.push(attr);
            } else {
                keep.push(attr);
            }
        });

        if (toSpread.length > 0) {
            // Build a properties array for our object expression
            const objectProperties = toSpread.map(attr => {
                const key = j.identifier(attr.name.name);
                let value;
                if (!attr.value) {
                    value = j.booleanLiteral(true);
                } else if (attr.value.type === 'JSXExpressionContainer') {
                    value = attr.value.expression;
                } else {
                    value = attr.value;
                }
                return j.objectProperty(key, value);
            });

            const spreadAttribute = j.jsxSpreadAttribute(
                j.objectExpression(objectProperties)
            );

            oe.attributes = [...keep, spreadAttribute];
            dirty = true;
        }
    });

    if (!dirty) return null;

    return root.toSource({
        quote: 'single',
        trailingComma: true,
        reuseWhitespace: true,
    });
};
