/**
 * fix-primitives.cjs
 * jscodeshift AST codemod — RepTrail Design System
 *
 * What it fixes (precision AST-based, not regex):
 *  1. <span> with no attributes → unwraps children in-place (text/expression nodes)
 *  2. <div>  with no attributes → <Box>  + adds Box import if missing
 *  3. <strong> with no attributes → <Font weight="bold"> + adds Font import if missing
 *  4. <br /> → removed (block Font variants naturally stack; if layout breaks, wrap in <Stack gap="none">)
 *
 * What it does NOT touch:
 *  - <form>, <button>, <canvas>, SVG elements (legitimate exceptions)
 *  - <span className="..."> or any element with attributes (needs manual review)
 *  - files inside base/ (already excluded by ESLint ignores)
 *
 * Run from the web/ directory:
 *   npx jscodeshift --extensions=tsx,ts --parser=tsx -t fix-primitives.cjs \
 *     src/components/store/intermediary \
 *     src/components/store/advanced \
 *     src/components/store/sections
 */

'use strict';

const BASE_IMPORT_MAP = {
    Box:  '@/components/store/base/box',
    Font: '@/components/store/base/font',
    Stack: '@/components/store/base/stack',
};

module.exports = function transformer(fileInfo, api) {
    const j = api.jscodeshift;
    const root = j(fileInfo.source);
    let dirty = false;

    // ─── Helpers ────────────────────────────────────────────────────────────────

    /** Check if a JSXOpeningElement has zero JSX attributes */
    function hasNoAttrs(openingElement) {
        return openingElement.attributes.length === 0;
    }

    /** Check if a component name (string) is already imported in this file */
    function isImported(name) {
        return root.find(j.ImportDeclaration).some(path =>
            path.node.specifiers.some(
                s => s.type === 'ImportSpecifier' && s.imported && s.imported.name === name
            )
        );
    }

    /** Add a named import to an existing import declaration, or create a new one */
    function ensureImport(name) {
        const from = BASE_IMPORT_MAP[name];
        if (!from) return;

        // Try to find an existing import from that path and add the specifier
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
            // Create a brand-new import declaration and insert after last import
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

    /** Strip whitespace-only JSXText nodes from a children array */
    function meaningfulChildren(children) {
        return children.filter(child => {
            if (child.type === 'JSXText') {
                return child.value.trim() !== '';
            }
            return true;
        });
    }

    // ─── Transform 1: Unwrap <span> with no attributes ───────────────────────
    root.find(j.JSXElement).filter(path => {
        const oe = path.node.openingElement;
        return (
            oe.name.type === 'JSXIdentifier' &&
            oe.name.name === 'span' &&
            hasNoAttrs(oe)
        );
    }).forEach(path => {
        const kids = meaningfulChildren(path.node.children);

        if (kids.length === 0) {
            // Empty span → remove entirely
            j(path).remove();
        } else if (kids.length === 1) {
            // Single child → lift it up, removing the span wrapper
            j(path).replaceWith(kids[0]);
        } else {
            // Multiple children → lift all of them (rare case)
            // jscodeshift supports replaceWith an array in recent versions
            j(path).replaceWith(kids);
        }
        dirty = true;
    });

    // ─── Transform 2: <div> with no attributes → <Box> ──────────────────────
    root.find(j.JSXElement).filter(path => {
        const oe = path.node.openingElement;
        return (
            oe.name.type === 'JSXIdentifier' &&
            oe.name.name === 'div' &&
            hasNoAttrs(oe)
        );
    }).forEach(path => {
        path.node.openingElement.name = j.jsxIdentifier('Box');
        if (path.node.closingElement) {
            path.node.closingElement.name = j.jsxIdentifier('Box');
        }
        dirty = true;
    });

    // Add Box import if needed after the transform
    if (
        root.find(j.JSXIdentifier, { name: 'Box' }).length > 0 &&
        !isImported('Box')
    ) {
        ensureImport('Box');
    }

    // ─── Transform 3: <strong> with no attributes → <Font weight="bold"> ────
    root.find(j.JSXElement).filter(path => {
        const oe = path.node.openingElement;
        return (
            oe.name.type === 'JSXIdentifier' &&
            oe.name.name === 'strong' &&
            hasNoAttrs(oe)
        );
    }).forEach(path => {
        path.node.openingElement.name = j.jsxIdentifier('Font');
        path.node.openingElement.attributes = [
            j.jsxAttribute(
                j.jsxIdentifier('weight'),
                j.stringLiteral('bold')
            ),
        ];
        if (path.node.closingElement) {
            path.node.closingElement.name = j.jsxIdentifier('Font');
        }
        dirty = true;
    });

    if (
        root.find(j.JSXIdentifier, { name: 'Font' }).length > 0 &&
        !isImported('Font')
    ) {
        ensureImport('Font');
    }

    // ─── Transform 4: Remove <br /> ──────────────────────────────────────────
    // <Font variant="hero/heading/..."> renders as a block element, so siblings
    // naturally stack without a <br />. If layout breaks, add <Stack gap="none">.
    root.find(j.JSXElement).filter(path => {
        const oe = path.node.openingElement;
        return (
            oe.name.type === 'JSXIdentifier' &&
            oe.name.name === 'br' &&
            oe.selfClosing === true &&
            hasNoAttrs(oe)
        );
    }).forEach(path => {
        j(path).remove();
        dirty = true;
    });

    // ─── Return ──────────────────────────────────────────────────────────────
    if (!dirty) return null; // No changes → jscodeshift will skip writing the file

    return root.toSource({
        quote: 'single',
        trailingComma: true,
        reuseWhitespace: true,
    });
};
