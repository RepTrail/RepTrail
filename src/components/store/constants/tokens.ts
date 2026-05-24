/**
 * STORE_TOKENS: The central source of truth for the RepTrail Store design system.
 * These tokens define the spacing, geometry, and typographic patterns used across
 * base, intermediary, and section layers.
 */

export const STORE_TOKENS = {
    PADDING: {
        /** 20px - Universal container padding and layout gap */
        CONTAINER: 'container' as const,
        /** 10px - Inner element spacing and small padding */
        ELEMENT: 'element' as const,
        /** 100px (PC) / 50px (Mobile) - Major section separation */
        SECTION: 'section' as const,
        /** 50px - Large padding for empty states or specialized sections */
        EMPTY_STATE: 'empty_state' as const,
        /** 4px - Tiny spacing for small elements */
        TINY: 'tiny' as const,
        /** 0px - No spacing */
        NONE: 'none' as const,

        /* Para ritmo vertical “hero” no `RegistryMain`, use `MAIN` no mobile — ver Design System §11–12.*/
        SAFE_AREA_INSET: 'safe_area' as const,
    },
    /** Spacing tokens for padding and gaps */
    SPACING: {
        /** 20px - Universal container padding and layout gap */
        CONTAINER: 'container' as const,
        /** 10px - Inner element spacing and small padding */
        ELEMENT: 'element' as const,
        /** 100px (PC) / 50px (Mobile) - Major section separation */
        SECTION: 'section' as const,
        /** 50px - Large padding for empty states or specialized sections */
        EMPTY_STATE: 'empty_state' as const,
        /** 4px - Tiny spacing for small elements */
        TINY: 'tiny' as const,
        /** 0px - No spacing */
        NONE: 'none' as const,
        /** 20px - Large padding for empty states or specialized sections */
        SECTION_MOBILE: 'container' as const,
        /** 20px - Large padding for empty states or specialized sections */
        TITLE_CONTENT: { base: '30px', md: '50px' } as const,
    },

    /** Geometry and Border Radius tokens */
    RADIUS: {
        /** 5px - The standard system radius */
        SYSTEM: 'system' as const,
        /** 9999px - Perfect circle/pill radius */
        FULL: 'full' as const,
        NONE: 'none' as const
    },

    /** Color tokens mapping to system palette */
    COLORS: {
        /** Identity colors */
        BRAND: 'primary' as const,
        SUCCESS: 'emerald' as const,
        ERROR: 'red' as const,
        WARNING: 'amber' as const,
        INFO: 'blue' as const,

        /** Structural colors (Zinc scale) */
        BACKGROUND: 'zinc' as const,
        SURFACE: 'zinc' as const,
        SHELF: 'zinc' as const,

        /** Text semantic colors (Font component compatible) */
        TEXT: {
            PRIMARY: 'white' as const,
            SECONDARY: 'zinc-400' as const,
            MUTED: 'zinc-500' as const,
            DIM: 'zinc-600' as const,
        },

        /** Divider semantic colors */
        DIVIDER: {
            SUBTLE: 'white/5' as const,
            STANDARD: 'white/10' as const,
            STRONG: 'white/20' as const,
        },

        /** Neutral colors */
        WHITE: 'white' as const,
        BLACK: 'black' as const,
        TRANSPARENT: 'transparent' as const,
    },

    /** Opacity tokens for backgrounds and tints */
    OPACITY: {
        /** Core structural layers */
        BACKGROUND: 100 as const,
        SURFACE: 95 as const,
        SHELF: 90 as const,

        /** Glass & Overlay effects */
        OVERLAY: 60 as const,
        MODAL: 50 as const,
        SIDEBAR: 40 as const,
        INTERMEDIATE: 30 as const,

        /** Feedback & Subtle layers */
        HIGH: 30 as const,
        MEDIUM: 20 as const,
        SUBTLE: 10 as const,
        LOW: 5 as const,
        NONE: 0 as const,
        FULL: 100 as const
    },

    /** Z-Index layer hierarchy */
    Z_INDEX: {
        /** Content floating over backgrounds/images */
        CONTENT: 10,
        /** Top-level overlays and badges */
        OVERLAY: 20
    },

    /** Typographic Presets (Combinations of Font props) */
    TYPOGRAPHY: {
        /** The signature Brutalist Label/Eyebrow style */
        LABEL: {
            variant: 'sub-tiny' as const,
            weight: 'black' as const,
            uppercase: true,
            italic: true,
            tracking: 'widest' as const
        },
        /** Primary Heading style for banners and sections */
        HEADING: {
            variant: 'heading' as const,
            weight: 'black' as const,
            uppercase: true,
            italic: true
        },
        /** Secondary body text for descriptions */
        DESCRIPTION: {
            variant: 'sub-tiny' as const,
            weight: 'bold' as const,
            uppercase: false,
            tracking: 'wide' as const
        }
    }
} as const;
