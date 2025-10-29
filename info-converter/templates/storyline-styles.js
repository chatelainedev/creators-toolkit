// Storyline Styles
// Controls styling for storyline section headers, subsection headers, and table of contents

// Storyline style definitions
const storylineStyles = {
    'default': {
        name: 'Default',
        description: 'Centered headers with decorative lines on both sides'
    },
    'minimal': {
        name: 'Minimal',
        description: 'Clean text-only headers with no decorations'
    },
    'boxed': {
        name: 'Boxed',
        description: 'Headers in bordered boxes with backgrounds'
    },
    'accent': {
        name: 'Accent Bar',
        description: 'Left accent bar with gradient backgrounds'
    },
    'underlined': {
        name: 'Underlined',
        description: 'Bold headers with colored bottom borders'
    },
    'compact': {
        name: 'Compact',
        description: 'Space-efficient headers with minimal vertical spacing'
    },
        'wuxia': {
        name: 'Wuxia',
        description: 'Elegant jade-inspired headers with diamond flourishes'
    },
    'sparkle': {
        name: 'Sparkle',
        description: 'Magical girl themed with stars and rainbow gradients'
    },
    'neonGlitch': {
        name: 'Neon Glitch',
        description: 'Cyberpunk style with angular shapes and electric accents'
    },
    'occult': {
        name: 'Occult',
        description: 'Dark mysterious headers with blood red accents and seals'
    },
    'manuscript': {
        name: 'Manuscript',
        description: 'Fantasy tome style with ornate corner flourishes'
    },
    'ribbon': {
        name: 'Ribbon',
        description: 'Decorative banner-style headers with elegant folds'
    }
};

function generateStorylineStyles(style, colors, fonts) {
    switch(style) {
        case 'minimal':
            return `
        /* Minimal - Clean text-only styling */
        .storyline-section-header {
            text-align: left;
            margin: 35px 0 20px 0;
        }

        .storyline-section-title {
            font-size: 1.4rem;
            font-weight: 600;
            color: ${colors.textPrimary};
            font-family: ${fonts.secondary};
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .storyline-subsection-header {
            text-align: left;
            margin: 20px 0 10px 0;
        }

        .storyline-subsection-title {
            font-size: 1.1rem;
            font-weight: 500;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
        }

        .storyline-toc {
            background: transparent;
            border: none;
            padding: 0;
            margin: 0 0 25px 0;
        }

        .storyline-toc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 8px 0;
            user-select: none;
            border-bottom: 1px solid ${colors.textMuted}33;
        }

        .storyline-toc-title {
            font-family: ${fonts.ui};
            font-size: 0.9rem;
            font-weight: 600;
            color: ${colors.textPrimary};
        }

        .storyline-toc-toggle {
            font-size: 0.75rem;
            color: ${colors.textMuted};
            margin-right: 15px;
        }

        .storyline-toc-content {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: max-height 0.3s ease, opacity 0.3s ease;
        }

        .storyline-toc-content:not(.collapsed) {
            max-height: 1000px;
            opacity: 1;
            padding: 8px 0 0 0;
        }

        .storyline-toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .storyline-toc-section {
            margin-bottom: 4px;
        }

        .storyline-toc-section > a {
            display: block;
            padding: 4px 0;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.9rem;
            transition: color 0.15s ease;
        }

        .storyline-toc-section > a:hover {
            color: ${colors.textPrimary};
        }

        .storyline-toc-subsections {
            list-style: none;
            padding: 4px 0 0 16px;
            margin: 0;
        }

        .storyline-toc-subsection a {
            display: block;
            padding: 3px 0;
            color: ${colors.textMuted};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.85rem;
            transition: color 0.15s ease;
        }

        .storyline-toc-subsection a:hover {
            color: ${colors.textSecondary};
        }
            `;

        case 'boxed':
            return `
        /* Boxed - Headers in bordered boxes */
        .storyline-section-header {
            margin: 30px 0 20px 0;
        }

        .storyline-section-title {
            font-size: 1.4rem;
            font-weight: 600;
            color: ${colors.textPrimary};
            font-family: ${fonts.secondary};
            background: ${colors.headerBg};
            border: 2px solid ${colors.textMuted}33;
            border-radius: 8px;
            padding: 12px 20px;
            text-align: center;
        }

        .storyline-subsection-header {
            margin: 15px 0 10px 0;
        }

        .storyline-subsection-title {
            font-size: 1.1rem;
            font-weight: 500;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
            background: ${colors.headerBg}80;
            border: 1px solid ${colors.textMuted}22;
            border-radius: 6px;
            padding: 8px 16px;
            text-align: center;
        }

        .storyline-toc {
            background: ${colors.headerBg};
            border: 2px solid ${colors.textMuted}33;
            border-radius: 8px;
            padding: 16px;
            margin: 0 0 25px 0;
        }

        .storyline-toc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 0;
            user-select: none;
        }

        .storyline-toc-title {
            font-family: ${fonts.ui};
            font-size: 1rem;
            font-weight: 700;
            color: ${colors.textPrimary};
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .storyline-toc-toggle {
            font-size: 0.75rem;
            color: ${colors.textMuted};
            margin-right: 10px;
        }

        .storyline-toc-content {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: max-height 0.3s ease, opacity 0.3s ease;
        }

        .storyline-toc-content:not(.collapsed) {
            max-height: 1000px;
            opacity: 1;
            padding: 12px 0 0 0;
        }

        .storyline-toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .storyline-toc-section {
            margin-bottom: 8px;
        }

        .storyline-toc-section > a {
            display: block;
            padding: 6px 12px;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.9rem;
            font-weight: 500;
            background: ${colors.containerBg};
            border-radius: 4px;
            transition: all 0.15s ease;
        }

        .storyline-toc-section > a:hover {
            background: ${colors.textMuted}22;
            color: ${colors.textPrimary};
        }

        .storyline-toc-subsections {
            list-style: none;
            padding: 8px 0 0 16px;
            margin: 0;
        }

        .storyline-toc-subsection a {
            display: block;
            padding: 4px 12px;
            color: ${colors.textMuted};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.85rem;
            border-radius: 3px;
            transition: all 0.15s ease;
        }

        .storyline-toc-subsection a:hover {
            background: ${colors.textMuted}18;
            color: ${colors.textSecondary};
        }
            `;

        case 'accent':
            return `
        /* Accent Bar - Left colored bar with gradient backgrounds */
        .storyline-section-header {
            margin: 30px 0 20px 0;
        }

        .storyline-section-title {
            font-size: 1.4rem;
            font-weight: 600;
            color: ${colors.textPrimary};
            font-family: ${fonts.secondary};
            background: linear-gradient(90deg, ${colors.headerBg} 0%, ${colors.containerBg} 100%);
            border-left: 4px solid ${colors.linkColor || colors.textSecondary};
            padding: 12px 20px;
            text-align: left;
        }

        .storyline-subsection-header {
            margin: 15px 0 10px 0;
        }

        .storyline-subsection-title {
            font-size: 1.1rem;
            font-weight: 500;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
            background: ${colors.headerBg}60;
            border-left: 3px solid ${colors.textMuted};
            padding: 8px 16px;
            text-align: left;
            font-style: italic;
        }

        .storyline-toc {
            background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.containerBg} 100%);
            border-left: 4px solid ${colors.linkColor || colors.textSecondary};
            border-radius: 4px;
            padding: 16px;
            margin: 0 0 25px 0;
        }

        .storyline-toc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 0 0 0 0;
            user-select: none;
        }

        .storyline-toc-title {
            font-family: ${fonts.ui};
            font-size: 0.95rem;
            font-weight: 600;
            color: ${colors.textPrimary};
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .storyline-toc-toggle {
            font-size: 0.75rem;
            color: ${colors.textMuted};
            margin-right: 10px;
        }

        .storyline-toc-content {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: max-height 0.3s ease, opacity 0.3s ease;
        }

        .storyline-toc-content:not(.collapsed) {
            max-height: 1000px;
            opacity: 1;
            padding: 8px 0 0 0;
        }

        .storyline-toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .storyline-toc-section {
            margin-bottom: 8px;
        }

        .storyline-toc-section > a {
            display: block;
            padding: 4px 8px;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.9rem;
            font-weight: 500;
            border-radius: 4px;
            transition: all 0.15s ease;
        }

        .storyline-toc-section > a:hover {
            background: ${colors.textMuted}22;
            color: ${colors.textPrimary};
            padding-left: 12px;
        }

        .storyline-toc-subsections {
            list-style: none;
            padding: 4px 0 0 16px;
            margin: 0;
        }

        .storyline-toc-subsection a {
            display: block;
            padding: 3px 8px;
            color: ${colors.textMuted};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.85rem;
            border-radius: 3px;
            transition: all 0.15s ease;
        }

        .storyline-toc-subsection a:hover {
            background: ${colors.textMuted}18;
            color: ${colors.textSecondary};
            padding-left: 12px;
        }
            `;

        case 'underlined':
            return `
        /* Underlined - Bold headers with colored bottom borders */
        .storyline-section-header {
            margin: 35px 0 20px 0;
        }

        .storyline-section-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: ${colors.textPrimary};
            font-family: ${fonts.secondary};
            text-align: left;
            padding-bottom: 10px;
            border-bottom: 3px solid ${colors.linkColor || colors.textSecondary};
        }

        .storyline-subsection-header {
            margin: 20px 0 10px 0;
        }

        .storyline-subsection-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
            text-align: left;
            padding-bottom: 6px;
            border-bottom: 2px solid ${colors.textMuted};
        }

        .storyline-toc {
            background: ${colors.containerBg};
            border-bottom: 3px solid ${colors.linkColor || colors.textSecondary};
            padding: 5px 5px 5px 5px;
            margin: 0 0 25px 0;
        }

        .storyline-toc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 0 0 0 0;
            user-select: none;
        }

        .storyline-toc-title {
            font-family: ${fonts.ui};
            font-size: 1rem;
            font-weight: 700;
            color: ${colors.textPrimary};
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .storyline-toc-toggle {
            font-size: 0.75rem;
            color: ${colors.textMuted};
            margin-right: 15px;
        }

        .storyline-toc-content {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: max-height 0.3s ease, opacity 0.3s ease;
        }

        .storyline-toc-content:not(.collapsed) {
            max-height: 1000px;
            opacity: 1;
            padding: 12px 0 0 0;
        }

        .storyline-toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .storyline-toc-section {
            margin-bottom: 8px;
        }

        .storyline-toc-section > a {
            display: block;
            padding: 6px 8px;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.9rem;
            font-weight: 500;
            border-radius: 4px;
            transition: all 0.15s ease;
        }

        .storyline-toc-section > a:hover {
            background: ${colors.textMuted}22;
            color: ${colors.textPrimary};
            padding-left: 12px;
        }

        .storyline-toc-subsections {
            list-style: none;
            padding: 4px 0 0 16px;
            margin: 0;
        }

        .storyline-toc-subsection a {
            display: block;
            padding: 4px 8px;
            color: ${colors.textMuted};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.85rem;
            border-radius: 3px;
            transition: all 0.15s ease;
        }

        .storyline-toc-subsection a:hover {
            background: ${colors.textMuted}18;
            color: ${colors.textSecondary};
            padding-left: 12px;
        }
            `;

        case 'compact':
            return `
        /* Compact - Space-efficient with minimal vertical spacing */
        .storyline-section-header {
            margin: 20px 0 10px 0;
        }

        .storyline-section-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: ${colors.textPrimary};
            font-family: ${fonts.secondary};
            text-align: left;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .storyline-subsection-header {
            margin: 10px 0 5px 0;
        }

        .storyline-subsection-title {
            font-size: 1rem;
            font-weight: 500;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
            text-align: left;
            font-style: italic;
        }

        .storyline-toc {
            background: ${colors.headerBg};
            border-radius: 4px;
            padding: 8px 12px;
            margin: 0 0 15px 0;
        }

        .storyline-toc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 4px 0;
            user-select: none;
        }

        .storyline-toc-title {
            font-family: ${fonts.ui};
            font-size: 0.85rem;
            font-weight: 600;
            color: ${colors.textPrimary};
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .storyline-toc-toggle {
            font-size: 0.7rem;
            color: ${colors.textMuted};
            margin-right: 10px;
        }

        .storyline-toc-content {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: max-height 0.3s ease, opacity 0.3s ease;
        }

        .storyline-toc-content:not(.collapsed) {
            max-height: 1000px;
            opacity: 1;
            padding: 6px 0 0 0;
        }

        .storyline-toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .storyline-toc-section {
            margin-bottom: 4px;
        }

        .storyline-toc-section > a {
            display: block;
            padding: 3px 6px;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.85rem;
            border-radius: 3px;
            transition: all 0.15s ease;
        }

        .storyline-toc-section > a:hover {
            background: ${colors.textMuted}22;
            color: ${colors.textPrimary};
        }

        .storyline-toc-subsections {
            list-style: none;
            padding: 2px 0 0 12px;
            margin: 0;
        }

        .storyline-toc-subsection a {
            display: block;
            padding: 2px 6px;
            color: ${colors.textMuted};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.8rem;
            border-radius: 3px;
            transition: all 0.15s ease;
        }

        .storyline-toc-subsection a:hover {
            background: ${colors.textMuted}18;
            color: ${colors.textSecondary};
        }
            `;

        case 'neonGlitch':
            return `
        /* Neon Glitch - Cyberpunk style with electric colors */
        .storyline-section-header {
            text-align: left;
            margin: 35px 0 20px 0;
            position: relative;
        }

        .storyline-section-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: ${colors.textPrimary};
            font-family: ${fonts.ui};
            text-transform: uppercase;
            letter-spacing: 2px;
            padding: 12px 20px 12px 16px;
            background: linear-gradient(90deg, ${colors.journalAccent}15 0%, transparent 100%);
            border-left: 4px solid ${colors.journalAccent};
            clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%);
            position: relative;
        }

        .storyline-section-title::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 4px;
            height: 100%;
            background: ${colors.journalAccent};
            box-shadow: 0 0 10px ${colors.journalAccent};
        }

        .storyline-subsection-header {
            text-align: left;
            margin: 20px 0 10px 0;
        }

        .storyline-subsection-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
            text-transform: uppercase;
            letter-spacing: 1px;
            padding-left: 12px;
            border-left: 2px solid ${colors.textMuted};
        }

        .storyline-toc {
            background: ${colors.containerBg};
            border: 1px solid ${colors.journalAccent}40;
            border-left: 3px solid ${colors.journalAccent};
            padding: 12px;
            margin: 0 0 25px 0;
            clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 100%, 0 100%);
            box-shadow: 0 0 15px ${colors.journalAccent}20;
        }

        .storyline-toc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 4px 0;
            user-select: none;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .storyline-toc-title {
            font-family: ${fonts.ui};
            font-size: 0.9rem;
            font-weight: 700;
            color: ${colors.journalAccent};
            text-shadow: 0 0 8px ${colors.journalAccent}60;
        }

        .storyline-toc-toggle {
            font-size: 0.75rem;
            color: ${colors.journalAccent};
            margin-right: 10px;
        }

        .storyline-toc-content {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: max-height 0.3s ease, opacity 0.3s ease;
        }

        .storyline-toc-content:not(.collapsed) {
            max-height: 1000px;
            opacity: 1;
            padding: 8px 0 0 0;
        }

        .storyline-toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .storyline-toc-section {
            margin-bottom: 4px;
        }

        .storyline-toc-section > a {
            display: block;
            padding: 6px 12px 6px 8px;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.9rem;
            border-left: 2px solid transparent;
            transition: all 0.15s ease;
        }

        .storyline-toc-section > a:hover {
            color: ${colors.journalAccent};
            border-left-color: ${colors.journalAccent};
            background: ${colors.journalAccent}10;
            padding-left: 12px;
        }

        .storyline-toc-subsections {
            list-style: none;
            padding: 4px 0 0 16px;
            margin: 0;
        }

        .storyline-toc-subsection a {
            display: block;
            padding: 4px 10px 4px 8px;
            color: ${colors.textMuted};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.85rem;
            border-left: 1px solid transparent;
            transition: all 0.15s ease;
        }

        .storyline-toc-subsection a:hover {
            color: ${colors.textSecondary};
            border-left-color: ${colors.textMuted};
            background: ${colors.textMuted}10;
            padding-left: 12px;
        }
            `;

        case 'wuxia':
            return `
        /* Wuxia - Elegant jade accents with traditional flourishes */
        .storyline-section-header {
            margin: 35px 0 20px 0;
        }

        .storyline-section-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: ${colors.textPrimary};
            font-family: ${fonts.secondary};
            padding: 12px 30px;
            background: linear-gradient(135deg, ${colors.wuxiaAccentLight}20 0%, ${colors.wuxiaAccent}15 100%);
            border-left: 3px solid ${colors.wuxiaAccent};
            border-right: 3px solid ${colors.wuxiaAccent};
            position: relative;
            text-align: center;
        }

        .storyline-section-title::before,
        .storyline-section-title::after {
            content: '◆';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: ${colors.wuxiaAccent};
            font-size: 0.7em;
        }

        .storyline-section-title::before {
            left: 8px;
        }

        .storyline-section-title::after {
            right: 8px;
        }

        .storyline-subsection-header {
            margin: 20px 0 10px 0;
        }

        .storyline-subsection-title {
            font-size: 1.1rem;
            font-weight: 500;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
            font-style: italic;
            padding: 8px 20px;
            border-bottom: 1px solid ${colors.wuxiaAccent}40;
            text-align: center;
        }

        .storyline-toc {
            background: linear-gradient(135deg, ${colors.wuxiaAccentLight}15 0%, ${colors.wuxiaAccent}10 100%);
            border-left: 3px solid ${colors.wuxiaAccent};
            border-radius: 4px;
            padding: 12px;
            margin: 0 0 25px 0;
            position: relative;
        }

        .storyline-toc::before {
            content: '◆';
            position: absolute;
            top: 12px;
            left: -9px;
            color: ${colors.wuxiaAccent};
            font-size: 0.8rem;
        }

        .storyline-toc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 4px 0;
            user-select: none;
        }

        .storyline-toc-title {
            font-family: ${fonts.secondary};
            font-size: 0.95rem;
            font-weight: 600;
            color: ${colors.textPrimary};
        }

        .storyline-toc-toggle {
            font-size: 0.75rem;
            color: ${colors.wuxiaAccent};
            margin-right: 10px;
        }

        .storyline-toc-content {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: max-height 0.3s ease, opacity 0.3s ease;
        }

        .storyline-toc-content:not(.collapsed) {
            max-height: 1000px;
            opacity: 1;
            padding: 8px 0 0 0;
        }

        .storyline-toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .storyline-toc-section {
            margin-bottom: 6px;
        }

        .storyline-toc-section > a {
            display: block;
            padding: 4px 8px;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.9rem;
            border-radius: 3px;
            transition: all 0.2s ease;
        }

        .storyline-toc-section > a:hover {
            color: ${colors.textPrimary};
            background: ${colors.wuxiaAccent}15;
            padding-left: 12px;
        }

        .storyline-toc-subsections {
            list-style: none;
            padding: 4px 0 0 16px;
            margin: 0;
        }

        .storyline-toc-subsection a {
            display: block;
            padding: 3px 8px;
            color: ${colors.textMuted};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.85rem;
            border-radius: 3px;
            transition: all 0.2s ease;
        }

        .storyline-toc-subsection a:hover {
            color: ${colors.textSecondary};
            background: ${colors.wuxiaAccent}10;
            padding-left: 12px;
        }
            `;

        case 'sparkle':
            return `
        /* Sparkle - Magical girl inspired with stars and gradients */
        .storyline-section-header {
            margin: 35px 0 20px 0;
        }

        .storyline-section-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: ${colors.textPrimary};
            font-family: ${fonts.secondary};
            padding: 14px 35px;
            background: linear-gradient(135deg, ${colors.kawaiiPink}25 0%, ${colors.kawaiiPurple}25 50%, ${colors.kawaiiBlue}25 100%);
            border-radius: 20px;
            box-shadow: 0 4px 12px ${colors.kawaiiPink}30;
            position: relative;
            text-align: center;
        }

        .storyline-section-title::before,
        .storyline-section-title::after {
            content: '★';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: ${colors.kawaiiPink};
            font-size: 1.2em;
            text-shadow: 0 0 8px ${colors.kawaiiPink}80;
        }

        .storyline-section-title::before {
            left: 10px;
        }

        .storyline-section-title::after {
            right: 10px;
        }

        .storyline-subsection-header {
            margin: 20px 0 12px 0;
        }

        .storyline-subsection-title {
            font-size: 1.1rem;
            font-weight: 500;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
            padding: 8px 20px;
            background: linear-gradient(135deg, ${colors.kawaiiPink}15 0%, ${colors.kawaiiPurple}15 100%);
            border-radius: 15px;
            text-align: center;
        }

        .storyline-toc {
            background: linear-gradient(135deg, ${colors.kawaiiPink}15 0%, ${colors.kawaiiPurple}15 50%, ${colors.kawaiiBlue}15 100%);
            border-radius: 16px;
            padding: 14px;
            margin: 0 0 25px 0;
            box-shadow: 0 4px 12px ${colors.kawaiiPink}25;
            border: 2px solid ${colors.kawaiiPink}30;
        }

        .storyline-toc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 4px 0;
            user-select: none;
        }

        .storyline-toc-title {
            font-family: ${fonts.secondary};
            font-size: 0.95rem;
            font-weight: 600;
            color: ${colors.textPrimary};
        }

        .storyline-toc-toggle {
            font-size: 0.75rem;
            color: ${colors.kawaiiPink};
            margin-right: 10px;
        }

        .storyline-toc-content {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: max-height 0.3s ease, opacity 0.3s ease;
        }

        .storyline-toc-content:not(.collapsed) {
            max-height: 1000px;
            opacity: 1;
            padding: 10px 0 0 0;
        }

        .storyline-toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .storyline-toc-section {
            margin-bottom: 6px;
        }

        .storyline-toc-section > a {
            display: block;
            padding: 6px 12px;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.9rem;
            border-radius: 10px;
            transition: all 0.2s ease;
        }

        .storyline-toc-section > a:hover {
            color: ${colors.textPrimary};
            background: ${colors.kawaiiPink}25;
            transform: translateX(4px);
        }

        .storyline-toc-subsections {
            list-style: none;
            padding: 4px 0 0 16px;
            margin: 0;
        }

        .storyline-toc-subsection a {
            display: block;
            padding: 4px 10px;
            color: ${colors.textMuted};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.85rem;
            border-radius: 8px;
            transition: all 0.2s ease;
        }

        .storyline-toc-subsection a:hover {
            color: ${colors.textSecondary};
            background: ${colors.kawaiiPurple}20;
            transform: translateX(4px);
        }
            `;

        case 'occult':
            return `
        /* Occult - Dark and mysterious with blood red accents */
        .storyline-section-header {
            margin: 35px 0 20px 0;
        }

        .storyline-section-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: ${colors.textPrimary};
            font-family: ${fonts.secondary};
            padding: 14px 40px;
            background: linear-gradient(135deg, ${colors.journalAccent}08 0%, ${colors.journalAccent}15 100%);
            border-top: 1px solid ${colors.journalAccent}40;
            border-bottom: 1px solid ${colors.journalAccent}40;
            position: relative;
            text-align: center;
        }

        .storyline-section-title::before,
        .storyline-section-title::after {
            content: '◈';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: ${colors.journalAccent};
            font-size: 1.2em;
            opacity: 0.6;
        }

        .storyline-section-title::before {
            left: 12px;
        }

        .storyline-section-title::after {
            right: 12px;
        }

        .storyline-subsection-header {
            margin: 20px 0 10px 0;
        }

        .storyline-subsection-title {
            font-size: 1.1rem;
            font-weight: 500;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
            font-style: italic;
            padding: 8px 20px;
            position: relative;
            text-align: center;
        }

        .storyline-subsection-title::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 50%;
            transform: translateX(-50%);
            width: 60%;
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, ${colors.journalAccent}60 50%, transparent 100%);
        }

        .storyline-toc {
            background: linear-gradient(135deg, ${colors.journalAccent}05 0%, ${colors.journalAccent}10 100%);
            border: 1px solid ${colors.journalAccent}30;
            border-radius: 4px;
            padding: 12px;
            margin: 0 0 25px 0;
            box-shadow: 0 2px 8px ${colors.journalAccent}15;
        }

        .storyline-toc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 4px 0;
            user-select: none;
            border-bottom: 1px solid ${colors.journalAccent}20;
        }

        .storyline-toc-title {
            font-family: ${fonts.secondary};
            font-size: 0.95rem;
            font-weight: 600;
            color: ${colors.textPrimary};
        }

        .storyline-toc-toggle {
            font-size: 0.75rem;
            color: ${colors.journalAccent};
            margin-right: 10px;
        }

        .storyline-toc-content {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: max-height 0.3s ease, opacity 0.3s ease;
        }

        .storyline-toc-content:not(.collapsed) {
            max-height: 1000px;
            opacity: 1;
            padding: 10px 0 0 0;
        }

        .storyline-toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .storyline-toc-section {
            margin-bottom: 6px;
        }

        .storyline-toc-section > a {
            display: block;
            padding: 5px 10px;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.9rem;
            border-radius: 3px;
            transition: all 0.2s ease;
        }

        .storyline-toc-section > a:hover {
            color: ${colors.textPrimary};
            background: ${colors.journalAccent}12;
            box-shadow: inset 0 0 8px ${colors.journalAccent}10;
        }

        .storyline-toc-subsections {
            list-style: none;
            padding: 4px 0 0 16px;
            margin: 0;
        }

        .storyline-toc-subsection a {
            display: block;
            padding: 4px 10px;
            color: ${colors.textMuted};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.85rem;
            border-radius: 3px;
            transition: all 0.2s ease;
        }

        .storyline-toc-subsection a:hover {
            color: ${colors.textSecondary};
            background: ${colors.journalAccent}08;
        }
            `;

        case 'manuscript':
            return `
        /* Manuscript - Fantasy tome with ornate styling */
        .storyline-section-header {
            margin: 35px 0 20px 0;
        }

        .storyline-section-title {
            font-size: 1.6rem;
            font-weight: 600;
            color: ${colors.textPrimary};
            font-family: ${fonts.secondary};
            padding: 14px 35px;
            background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.containerBg} 50%, ${colors.headerBg} 100%);
            border: 2px solid ${colors.textMuted}50;
            border-radius: 2px;
            box-shadow: inset 0 1px 0 ${colors.textMuted}20, 0 2px 4px ${colors.textMuted}30;
            position: relative;
            text-align: center;
        }

        .storyline-section-title::before,
        .storyline-section-title::after {
            content: '❖';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: ${colors.textSecondary};
            font-size: 0.9em;
        }

        .storyline-section-title::before {
            left: 10px;
        }

        .storyline-section-title::after {
            right: 10px;
        }

        .storyline-subsection-header {
            margin: 20px 0 10px 0;
        }

        .storyline-subsection-title {
            font-size: 1.15rem;
            font-weight: 500;
            color: ${colors.textSecondary};
            font-family: ${fonts.secondary};
            font-style: italic;
            padding: 8px 25px;
            position: relative;
            text-align: center;
        }

        .storyline-subsection-title::before,
        .storyline-subsection-title::after {
            content: '~';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: ${colors.textMuted};
            font-size: 1.2em;
        }

        .storyline-subsection-title::before {
            left: 5px;
        }

        .storyline-subsection-title::after {
            right: 5px;
        }

        .storyline-toc {
            background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.containerBg} 100%);
            border: 2px solid ${colors.textMuted}40;
            border-radius: 3px;
            padding: 14px;
            margin: 0 0 25px 0;
            box-shadow: 0 2px 4px ${colors.textMuted}30;
        }

        .storyline-toc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 6px 0;
            user-select: none;
            border-bottom: 1px solid ${colors.textMuted}30;
        }

        .storyline-toc-title {
            font-family: ${fonts.secondary};
            font-size: 1rem;
            font-weight: 600;
            color: ${colors.textPrimary};
        }

        .storyline-toc-toggle {
            font-size: 0.75rem;
            color: ${colors.textSecondary};
            margin-right: 10px;
        }

        .storyline-toc-content {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: max-height 0.3s ease, opacity 0.3s ease;
        }

        .storyline-toc-content:not(.collapsed) {
            max-height: 1000px;
            opacity: 1;
            padding: 10px 0 0 0;
        }

        .storyline-toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .storyline-toc-section {
            margin-bottom: 6px;
        }

        .storyline-toc-section > a {
            display: block;
            padding: 6px 12px;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.9rem;
            border-radius: 2px;
            transition: all 0.2s ease;
            border-left: 3px solid transparent;
        }

        .storyline-toc-section > a:hover {
            color: ${colors.textPrimary};
            background: ${colors.headerBg};
            border-left-color: ${colors.textSecondary};
        }

        .storyline-toc-subsections {
            list-style: none;
            padding: 4px 0 0 20px;
            margin: 0;
        }

        .storyline-toc-subsection a {
            display: block;
            padding: 4px 10px;
            color: ${colors.textMuted};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.85rem;
            border-radius: 2px;
            transition: all 0.2s ease;
        }

        .storyline-toc-subsection a:hover {
            color: ${colors.textSecondary};
            background: ${colors.headerBg}80;
        }
            `;

        case 'ribbon':
            return `
        /* Ribbon - Decorative banners with elegant folds */
        .storyline-section-header {
            margin: 40px 0 25px 0;
        }

        .storyline-section-title {
            font-size: 1.4rem;
            font-weight: 600;
            color: ${colors.textPrimary};
            font-family: ${fonts.secondary};
            padding: 12px 40px;
            background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.containerBg} 50%, ${colors.headerBg} 100%);
            box-shadow: 0 2px 4px ${colors.textMuted}40;
            position: relative;
            clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0 50%);
            text-align: center;
        }

        .storyline-section-title::before,
        .storyline-section-title::after {
            content: '';
            position: absolute;
            top: 0;
            width: 12px;
            height: 100%;
            background: ${colors.textMuted}15;
        }

        .storyline-section-title::before {
            left: 0;
            clip-path: polygon(0 0, 100% 0, 50% 50%, 100% 100%, 0 100%);
        }

        .storyline-section-title::after {
            right: 0;
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 50% 50%);
        }

        .storyline-subsection-header {
            margin: 20px 0 12px 0;
        }

        .storyline-subsection-title {
            font-size: 1.1rem;
            font-weight: 500;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
            padding: 8px 25px;
            background: ${colors.headerBg};
            border-radius: 20px 4px 20px 4px;
            box-shadow: 0 1px 3px ${colors.textMuted}30;
            text-align: center;
        }

        .storyline-toc {
            background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.containerBg} 100%);
            border-radius: 8px 2px 8px 2px;
            padding: 14px;
            margin: 0 0 25px 0;
            box-shadow: 0 2px 4px ${colors.textMuted}35;
            border: 1px solid ${colors.textMuted}25;
        }

        .storyline-toc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 4px 0;
            user-select: none;
        }

        .storyline-toc-title {
            font-family: ${fonts.secondary};
            font-size: 0.95rem;
            font-weight: 600;
            color: ${colors.textPrimary};
        }

        .storyline-toc-toggle {
            font-size: 0.75rem;
            color: ${colors.textSecondary};
            margin-right: 10px;
        }

        .storyline-toc-content {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: max-height 0.3s ease, opacity 0.3s ease;
        }

        .storyline-toc-content:not(.collapsed) {
            max-height: 1000px;
            opacity: 1;
            padding: 10px 0 0 0;
        }

        .storyline-toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .storyline-toc-section {
            margin-bottom: 6px;
        }

        .storyline-toc-section > a {
            display: block;
            padding: 6px 14px;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.9rem;
            border-radius: 12px 3px 12px 3px;
            transition: all 0.2s ease;
        }

        .storyline-toc-section > a:hover {
            color: ${colors.textPrimary};
            background: ${colors.headerBg};
            box-shadow: 0 1px 3px ${colors.textMuted}25;
        }

        .storyline-toc-subsections {
            list-style: none;
            padding: 4px 0 0 18px;
            margin: 0;
        }

        .storyline-toc-subsection a {
            display: block;
            padding: 4px 12px;
            color: ${colors.textMuted};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.85rem;
            border-radius: 10px 2px 10px 2px;
            transition: all 0.2s ease;
        }

        .storyline-toc-subsection a:hover {
            color: ${colors.textSecondary};
            background: ${colors.headerBg}70;
        }
            `;

        case 'default':
        default:
            return `
        /* Section headers - prominent dividers between major sections */
        .storyline-section-header {
            text-align: center;
            margin: 30px 0 -25px 0;
            padding-top: 0;
        }

        .storyline-section-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: ${colors.textPrimary};
            font-family: ${fonts.secondary};
            display: inline-block;
            padding: 0 20px;
            position: relative;
        }

        .storyline-section-title::before,
        .storyline-section-title::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 60px;
            height: 1px;
            background: ${colors.textMuted}66;
        }

        .storyline-section-title::before {
            right: 100%;
            margin-right: 10px;
        }

        .storyline-section-title::after {
            left: 100%;
            margin-left: 10px;
        }

        /* Subsection headers - smaller, less prominent */
        .storyline-subsection-header {
            text-align: center;
            margin: 0 0 10px 0;
        }

        .storyline-subsection-title {
            font-size: 1.1rem;
            font-weight: 500;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
            font-style: italic;
            display: inline-block;
            padding: 0 15px;
            opacity: 0.85;
        }

        /* Storyline Table of Contents */
        .storyline-toc {
            background: ${colors.containerBg};
            border-radius: 8px;
            padding: 12px;
            margin: 0 0 25px 0;
            border: 1px solid ${colors.textMuted}33;
        }

        .storyline-toc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 6px 0;
            user-select: none;
        }

        .storyline-toc-title {
            font-family: ${fonts.ui};
            font-size: 0.95rem;
            font-weight: 600;
            color: ${colors.textPrimary};
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .storyline-toc-toggle {
            font-size: 0.75rem;
            color: ${colors.textMuted};
            transition: transform 0.2s ease;
            margin-right: 10px;
        }

        .storyline-toc-content {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: max-height 0.3s ease, opacity 0.3s ease;
            padding: 0;
        }

        .storyline-toc-content:not(.collapsed) {
            max-height: 1000px;
            opacity: 1;
            padding: 8px 0 0 0;
        }

        .storyline-toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .storyline-toc-section {
            margin-bottom: 8px;
        }

        .storyline-toc-section > a {
            display: block;
            padding: 4px 8px;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.9rem;
            font-weight: 500;
            border-radius: 4px;
            transition: all 0.15s ease;
        }

        .storyline-toc-section > a:hover {
            background: ${colors.textMuted}22;
            color: ${colors.textPrimary};
            padding-left: 12px;
        }

        .storyline-toc-subsections {
            list-style: none;
            padding: 4px 0 0 16px;
            margin: 0;
        }

        .storyline-toc-subsection a {
            display: block;
            padding: 3px 8px;
            color: ${colors.textMuted};
            text-decoration: none;
            font-family: ${fonts.ui};
            font-size: 0.85rem;
            border-radius: 3px;
            transition: all 0.15s ease;
        }

        .storyline-toc-subsection a:hover {
            background: ${colors.textMuted}18;
            color: ${colors.textSecondary};
            padding-left: 12px;
        }
            `;
    }
}

export default storylineStyles;
export { generateStorylineStyles };