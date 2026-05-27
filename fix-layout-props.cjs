/**
 * fix-layout-props.cjs
 * jscodeshift AST codemod — RepTrail Design System
 *
 * What it fixes:
 *  1. Removes ALL margin props (margin, m, mx, my, mt, mb, ml, mr, marginTop, etc.)
 *     → Reason: Rule 2 — "Use <Stack gap> instead"
 *  2. Normalizes prohibited padding string literals: "6" → "5", "8" → "5"
 *     → Reason: Rule 9 — only 5, 2.5, 12 are authorized
 *  3. Removes directional padding with direct string/number literals
 *     (paddingTop="5", pt="4", py="element", etc.)
 *     → Reason: Rule 4 — directional padding must be responsive expression containers
 *     → NOTE: px/py with expression containers (responsive objects) are kept intact
 *
 * Run from web/ directory:
 *   npx jscodeshift --extensions=tsx,ts --parser=tsx -t fix-layout-props.cjs \
 *     src/components/store/intermediary \
 *     src/components/store/advanced \
 *     src/components/store/sections
 */

'use strict';

const MARGIN_PROPS = new Set([
    'margin', 'marginX', 'marginY',
    'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
    'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr',
]);

const DIRECTIONAL_PADDING_PROPS = new Set([
    'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
    'px', 'py', 'pt', 'pb', 'pl', 'pr',
]);

const SIDEBAR_TOKENS = ['sidebar', 'sidebar-wide'];

function isSidebarValue(node) {
    if (!node) return false;
    if (node.type === 'StringLiteral' && SIDEBAR_TOKENS.some(t => node.value.includes(t))) return true;
    if (node.type === 'Literal' && typeof node.value === 'string' && SIDEBAR_TOKENS.some(t => node.value.includes(t))) return true;
    return false;
}

function isExpressionContainer(node) {
    return node && node.type === 'JSXExpressionContainer';
}

module.exports = function transformer(fileInfo, api) {
    const j = api.jscodeshift;
    const root = j(fileInfo.source);
    let dirty = false;

    // ─── 1. Remove ALL margin props ────────────────────────────────────────────
    root.find(j.JSXAttribute).filter(path => {
        const nameNode = path.node.name;
        const name = nameNode.type === 'JSXIdentifier' ? nameNode.name : null;
        return name && MARGIN_PROPS.has(name);
    }).forEach(path => {
        j(path).remove();
        dirty = true;
    });

    // ─── 2. Normalize forbidden padding literal values ─────────────────────────
    // Matches: padding="6", paddingX="8", paddingY="6" (direct string literals, not {})
    root.find(j.JSXAttribute).filter(path => {
        const nameNode = path.node.name;
        const name = nameNode.type === 'JSXIdentifier' ? nameNode.name : null;
        if (!name) return false;
        if (!['padding', 'paddingX', 'paddingY'].includes(name)) return false;
        const val = path.node.value;
        // Direct string literal: padding="6" or padding="8"
        if (val && (val.type === 'StringLiteral' || val.type === 'Literal')) {
            return val.value === '6' || val.value === '8';
        }
        // Inside ExpressionContainer with numeric literal: padding={6} or padding={8}
        if (val && val.type === 'JSXExpressionContainer') {
            const expr = val.expression;
            if (expr && (expr.type === 'NumericLiteral' || expr.type === 'Literal')) {
                return expr.value === 6 || expr.value === 8;
            }
        }
        return false;
    }).forEach(path => {
        const val = path.node.value;
        // Replace string literal "6"/"8" → "5"
        if (val.type === 'StringLiteral' || val.type === 'Literal') {
            path.node.value = j.stringLiteral('5');
        } else if (val.type === 'JSXExpressionContainer') {
            // Replace numeric {6}/{8} → {5}
            path.node.value = j.jsxExpressionContainer(j.numericLiteral(5));
        }
        dirty = true;
    });

    // ─── 3. Remove directional padding with static (non-responsive) values ──────
    // Removes: paddingTop="5", pt="element", py="section", etc.
    // Keeps:   paddingY={{ base: 5, md: 10 }}  (JSXExpressionContainer → responsive)
    // Keeps:   paddingY="sidebar" / paddingY="sidebar-wide" (exception tokens)
    root.find(j.JSXAttribute).filter(path => {
        const nameNode = path.node.name;
        const name = nameNode.type === 'JSXIdentifier' ? nameNode.name : null;
        if (!name || !DIRECTIONAL_PADDING_PROPS.has(name)) return false;
        const val = path.node.value;
        // Keep if the value is a JSXExpressionContainer (responsive object allowed)
        if (isExpressionContainer(val)) return false;
        // Keep sidebar exception tokens
        if (isSidebarValue(val)) return false;
        // Remove everything else (direct string or number literals)
        return true;
    }).forEach(path => {
        j(path).remove();
        dirty = true;
    });

    if (!dirty) return null;
    return root.toSource({ quote: 'single', reuseWhitespace: true });
};
