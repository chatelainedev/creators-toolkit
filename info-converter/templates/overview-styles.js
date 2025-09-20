// Overview Style Generation Functions
function generateOverviewStyles(overviewStyle, colors, fonts, generateOverviewMainBackgroundStyle) {
    switch (overviewStyle) {
        case 'journal':
            // FIXED: Generate the background style for journal
            const journalMainBg = generateOverviewMainBackgroundStyle();
            
            // Build the complete background style for journal
            let journalOverviewCSS = '';
            
            if (journalMainBg) {
                const data = infoData || {};
                const basic = data.basic || {};
                const bgImage = basic.overviewContentBgImage && basic.overviewContentBgImage.trim();
                const bgColor = basic.overviewContentBgColor && basic.overviewContentBgColor.trim();
                const opacity = basic.overviewContentOpacity || 100;
                const blur = basic.overviewContentBlur || 0;
                
                // Start with base background color
                journalOverviewCSS = `background: ${colors.containerBg};`;
                
                if (bgImage) {
                    // Layer lined paper over custom image (if not dark theme)
                    if (colors.bodyBg !== '#1a1a1a') {
                        journalOverviewCSS = `
                            background: ${colors.containerBg} url('${bgImage}') center/cover no-repeat;
                            background-image: repeating-linear-gradient(
                                transparent,
                                transparent 28px,
                                ${colors.textMuted} 28px,
                                ${colors.textMuted} 30px
                            ), url('${bgImage}');
                            background-size: auto, cover;
                            background-position: center, center;
                            background-repeat: repeat, no-repeat;`;
                    } else {
                        // Dark theme - just the image
                        journalOverviewCSS = `
                            background: ${colors.containerBg} url('${bgImage}') center/cover no-repeat;`;
                    }
                } else if (bgColor) {
                    // Custom color with lined paper overlay
                    journalOverviewCSS = `background: ${bgColor};`;
                    if (colors.bodyBg !== '#1a1a1a') {
                        journalOverviewCSS += `
                            background-image: repeating-linear-gradient(
                                transparent,
                                transparent 28px,
                                ${colors.textMuted} 28px,
                                ${colors.textMuted} 30px
                            );`;
                    }
                }
                
                // Add opacity and blur
                if (opacity !== 100) {
                    journalOverviewCSS += ` opacity: ${opacity / 100};`;
                }
                if (blur > 0) {
                    journalOverviewCSS += ` filter: blur(${blur}px);`;
                }
            } else {
                // No custom background - use original default
                journalOverviewCSS = `background: ${colors.containerBg};`;
                if (colors.bodyBg !== '#1a1a1a') {
                    journalOverviewCSS += `
                        background-image: repeating-linear-gradient(
                            transparent,
                            transparent 28px,
                            ${colors.textMuted} 28px,
                            ${colors.textMuted} 30px
                        );`;
                }
            }
            
            return `
                /* Overview - Journal Style */
                .overview-content {
                    ${journalOverviewCSS}
                    padding: 40px;
                    margin: 20px;
                    border-left: 50px solid ${colors.headerBg};
                    position: relative;
                    min-height: 300px;
                    border-radius: 0;
                }

                .overview-content::before {
                    content: '';
                    position: absolute;
                    left: -40px;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background: ${colors.journalAccent};
                }

                .overview-content p {
                    font-size: 16px;
                    margin-bottom: 20px;
                    text-indent: 20px;
                    position: relative;
                    z-index: 2;
                }
                
                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                }
            `;

        case 'modern':
            const modernMainBg = generateOverviewMainBackgroundStyle();
            const modernOverviewContentStyle = modernMainBg ? 
                modernMainBg : 
                `background: ${colors.containerBg};`;
            
            return `
                /* Overview - Modern Style */
                .overview-content {
                    ${modernOverviewContentStyle}
                    padding: 60px;
                    margin: 40px;
                    border-radius: 16px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
                    border: 1px solid ${colors.textMuted}33;
                    position: relative;
                    min-height: 400px;
                }

                .overview-content::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: ${colors.concepts};
                    border-radius: 16px 16px 0 0;
                }

                .overview-content p {
                    font-size: 18px;
                    margin-bottom: 24px;
                    text-indent: 0;
                    line-height: 1.8;
                    position: relative;
                    z-index: 2;
                }

                .overview-content p:first-child {
                    font-size: 20px;
                    color: ${colors.textTitle || colors.textPrimary};
                    font-weight: 500;
                    position: relative;
                    z-index: 2;
                }
                
                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                }
            `;

        case 'classic':
            const classicMainBg = generateOverviewMainBackgroundStyle();
            const classicOverviewContentStyle = classicMainBg ? 
                classicMainBg : 
                `background: ${colors.containerBg};`;
            
            return `
                /* Overview - Classic Style */
                .overview-content {
                    ${classicOverviewContentStyle}
                    padding: 50px;
                    margin: 30px auto;
                    max-width: 700px;
                    border: 2px solid ${colors.textMuted};
                    position: relative;
                    min-height: 350px;
                    border-radius: 0;
                }

                .overview-content::before {
                    content: '';
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    bottom: -2px;
                    border: 4px double ${colors.textSecondary};
                    pointer-events: none;
                    z-index: 1;
                }

                .overview-content p {
                    font-size: 16px;
                    margin-bottom: 18px;
                    text-indent: 30px;
                    text-align: justify;
                    position: relative;
                    z-index: 2;
                }

                .overview-content p:first-child {
                    font-variant: small-caps;
                    font-weight: 600;
                    text-indent: 0;
                    text-align: center;
                    font-size: 18px;
                    margin-bottom: 30px;
                    position: relative;
                    z-index: 2;
                }
                
                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                }
            `;

        case 'magazine':
            const magazineMainBg = generateOverviewMainBackgroundStyle();
            const magazineOverviewContentStyle = magazineMainBg ? 
                magazineMainBg : 
                `background: ${colors.containerBg};`;
            
            return `
                /* Overview - Magazine: Clean Editorial Layout */
                .overview-content {
                    ${magazineOverviewContentStyle}
                    padding: 50px 60px 40px;
                    margin: 20px auto;
                    max-width: 800px;
                    border-left: 4px solid ${colors.textMuted};
                    border-radius: 0;
                    position: relative;
                    min-height: 350px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .overview-content::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -4px;
                    width: 4px;
                    height: 60px;
                    background: ${colors.textSecondary};
                    z-index: 1;
                }

                .overview-content p {
                    font-size: 17px;
                    line-height: 1.7;
                    margin-bottom: 22px;
                    text-indent: 0;
                    position: relative;
                    z-index: 2;
                }

                .overview-content p:first-of-type {
                    font-size: 20px;
                    font-weight: 500;
                    color: ${colors.textTitle || colors.textPrimary};
                    margin-bottom: 30px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid ${colors.textMuted}33;
                    position: relative;
                    z-index: 2;
                }

                .overview-content p:first-of-type::first-letter {
                    font-size: 3.2em;
                    font-weight: 600;
                    float: left;
                    line-height: 0.9;
                    margin: 8px 8px 0 0;
                    color: ${colors.textSecondary};
                }
                
                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                }
            `;

        case 'minimal':
            const minimalMainBg = generateOverviewMainBackgroundStyle();
            const minimalOverviewContentStyle = minimalMainBg ? 
                minimalMainBg : 
                `background: ${colors.containerBg};`;
            
            return `
                /* Overview - Minimal: Ultra-Clean Design */
                .overview-content {
                    ${minimalOverviewContentStyle}
                    padding: 80px 100px;
                    margin: 60px auto;
                    max-width: 750px;
                    border: none;
                    border-radius: 8px;
                    position: relative;
                    min-height: 300px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                }

                .overview-content p {
                    font-size: 18px;
                    line-height: 1.8;
                    margin-bottom: 32px;
                    text-indent: 0;
                    position: relative;
                    z-index: 2;
                    font-weight: 400;
                }

                .overview-content p:first-of-type {
                    font-size: 22px;
                    font-weight: 300;
                    color: ${colors.textTitle || colors.textPrimary};
                    text-align: left;
                    margin-bottom: 50px;
                    position: relative;
                    z-index: 2;
                }
                
                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                }

                .overview-content h1.overview-title {
                    margin-bottom: 50px;
                    font-weight: 300;
                    letter-spacing: 1px;
                }
            `;

        case 'botanical':
            const botanicalMainBg = generateOverviewMainBackgroundStyle();
            const botanicalOverviewContentStyle = botanicalMainBg ? 
                botanicalMainBg : 
                `background: ${colors.containerBg};`;
            
            return `
                /* Overview - Botanical: Natural Growth Patterns */
                .overview-content {
                    ${botanicalOverviewContentStyle}
                    padding: 50px 60px;
                    margin: 25px;
                    border-radius: 20px 5px 20px 5px;
                    position: relative;
                    min-height: 400px;
                    overflow: hidden;
                    border: 2px solid ${colors.plants}66;
                    box-shadow: 0 8px 24px ${colors.plants}22;
                }

                /* Organic vine pattern along left edge */
                .overview-content::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 0;
                    width: 40px; height: 100%;
                    background: 
                        linear-gradient(45deg, 
                            ${colors.plants}33 0%, transparent 40%),
                        repeating-linear-gradient(
                            0deg,
                            ${colors.plants}22 0px,
                            transparent 8px,
                            transparent 16px,
                            ${colors.plants}11 24px
                        );
                    border-radius: 18px 0 0 18px;
                    pointer-events: none;
                    z-index: 1;
                }

                /* Floating leaf decorations */
                .overview-content::after {
                    content: '🌿 ◦ 🍃 ◦ 🌱';
                    position: absolute;
                    top: 20px; right: 30px;
                    color: ${colors.plants}77;
                    font-size: 14px;
                    letter-spacing: 12px;
                    pointer-events: none;
                    z-index: 1;
                    opacity: 0.6;
                }

                .overview-content p {
                    font-size: 17px;
                    line-height: 1.8;
                    margin-bottom: 24px;
                    text-indent: 0;
                    position: relative;
                    z-index: 2;
                    color: ${colors.textContent || colors.textSecondary};
                    margin-left: 50px;
                }

                .overview-content p:first-of-type {
                    font-size: 19px;
                    color: ${colors.textTitle || colors.textPrimary};
                    background: linear-gradient(135deg, 
                        ${colors.plants}11 0%, 
                        transparent 100%);
                    padding: 20px 25px;
                    border-radius: 12px;
                    border-left: 4px solid ${colors.plants}88;
                    margin: 20px 0 30px 50px;
                    position: relative;
                    z-index: 2;
                }
                
                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                    margin-left: 50px;
                }

                .overview-content h1.overview-title {
                    margin-left: 0;
                    padding-left: 50px;
                }
            `;

        case 'constellation':
            const constellationMainBg = generateOverviewMainBackgroundStyle();
            const constellationOverviewContentStyle = constellationMainBg ? 
                constellationMainBg : 
                `background: ${colors.containerBg};`;
            
            return `
                /* Overview - Constellation: Starfield Mapping */
                .overview-content {
                    ${constellationOverviewContentStyle}
                    background-image: 
                        ${constellationMainBg ? '' : `
                        /* Star field pattern */
                        radial-gradient(circle at 15% 25%, ${colors.textMuted}44 0%, transparent 2px),
                        radial-gradient(circle at 85% 15%, ${colors.linkColor}33 0%, transparent 1.5px),
                        radial-gradient(circle at 25% 75%, ${colors.textMuted}55 0%, transparent 1px),
                        radial-gradient(circle at 75% 85%, ${colors.linkColor}22 0%, transparent 2px),
                        radial-gradient(circle at 45% 35%, ${colors.textMuted}33 0%, transparent 1px),
                        radial-gradient(circle at 65% 55%, ${colors.linkColor}44 0%, transparent 1.5px),`}
                        /* Deep space gradient */
                        linear-gradient(135deg, 
                            ${colors.containerBg} 0%, 
                            ${colors.headerBg}44 50%,
                            ${colors.containerBg} 100%);
                    
                    padding: 60px;
                    margin: 30px;
                    border-radius: 0;
                    position: relative;
                    min-height: 450px;
                    border: 1px solid ${colors.textMuted}33;
                    box-shadow: 
                        0 0 40px ${colors.linkColor}11,
                        inset 0 1px 6px rgba(255,255,255,0.1);
                }

                /* Constellation lines connecting content */
                .overview-content::before {
                    content: '';
                    position: absolute;
                    top: 60px; left: 60px;
                    right: 60px; bottom: 60px;
                    border: 1px dashed ${colors.linkColor}44;
                    border-radius: 0;
                    pointer-events: none;
                    z-index: 1;
                }

                /* Navigation star cluster in corner */
                .overview-content::after {
                    content: '✦ ◦ ✧ ◦ ⋆ ◦ ✦';
                    position: absolute;
                    bottom: 25px; right: 30px;
                    color: ${colors.linkColor}66;
                    font-size: 12px;
                    letter-spacing: 6px;
                    pointer-events: none;
                    z-index: 1;
                }

                .overview-content p {
                    font-size: 17px;
                    line-height: 1.8;
                    margin-bottom: 28px;
                    text-indent: 0;
                    position: relative;
                    z-index: 2;
                    color: ${colors.textContent || colors.textSecondary};
                }

                .overview-content p:first-of-type {
                    font-size: 20px;
                    color: ${colors.textTitle || colors.textPrimary};
                    text-align: center;
                    padding: 25px;
                    background: linear-gradient(135deg, 
                        transparent 0%, 
                        ${colors.linkColor}11 50%,
                        transparent 100%);
                    border: 1px solid ${colors.linkColor}33;
                    margin-bottom: 35px;
                    position: relative;
                    z-index: 2;
                }
                
                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                }
            `;

        case 'manuscript':
            const manuscriptMainBg = generateOverviewMainBackgroundStyle();
            const manuscriptOverviewContentStyle = manuscriptMainBg ? 
                manuscriptMainBg : 
                `background: ${colors.containerBg};`;
            
            return `
                /* Overview - Manuscript: Illuminated Medieval Style */
                .overview-content {
                    ${manuscriptOverviewContentStyle}
                    background-image: 
                        ${manuscriptMainBg ? '' : `
                        /* Faint manuscript grid */
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 28px,
                            ${colors.textMuted}11 28px,
                            ${colors.textMuted}11 30px
                        ),`}
                        /* Subtle parchment aging */
                        radial-gradient(ellipse at 20% 80%, 
                            ${colors.headerBg}33 0%, transparent 60%),
                        radial-gradient(ellipse at 80% 20%, 
                            ${colors.softBg}44 0%, transparent 50%);
                    
                    padding: 80px 70px 60px;
                    margin: 40px auto;
                    max-width: 750px;
                    border: 4px double ${colors.journalAccent}44;
                    border-radius: 8px;
                    position: relative;
                    min-height: 500px;
                }

                /* Illuminated corner decorations */
                .overview-content::before {
                    content: '❦';
                    position: absolute;
                    top: 20px; left: 20px;
                    color: ${colors.journalAccent}77;
                    font-size: 24px;
                    pointer-events: none;
                    z-index: 1;
                }

                .overview-content::after {
                    content: '❦';
                    position: absolute;
                    bottom: 20px; right: 20px;
                    color: ${colors.journalAccent}77;
                    font-size: 24px;
                    transform: rotate(180deg);
                    pointer-events: none;
                    z-index: 1;
                }

                .overview-content p {
                    font-family: ${fonts.primary}, serif;
                    font-size: 16px;
                    line-height: 1.8;
                    margin-bottom: 24px;
                    text-indent: 35px;
                    text-align: justify;
                    position: relative;
                    z-index: 2;
                    color: ${colors.textContent || colors.textSecondary};
                }

                /* Drop cap effect for first paragraph */
                .overview-content p:first-of-type {
                    font-size: 18px;
                    color: ${colors.textTitle || colors.textPrimary};
                    margin-bottom: 35px;
                    position: relative;
                    z-index: 2;
                }

                .overview-content p:first-of-type::first-letter {
                    font-size: 4.2em;
                    font-weight: 700;
                    float: left;
                    line-height: 0.8;
                    margin: 12px 12px 0 0;
                    color: ${colors.journalAccent};
                    font-family: serif;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                }
                
                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                }

                .overview-content h1.overview-title {
                    text-align: center;
                    border-bottom: 2px solid ${colors.journalAccent}33;
                    padding-bottom: 15px;
                    margin-bottom: 40px;
                    font-variant: small-caps;
                    letter-spacing: 2px;
                }
            `;

        case 'neon':
            const neonMainBg = generateOverviewMainBackgroundStyle();
            const neonOverviewContentStyle = neonMainBg ? 
                neonMainBg : 
                `background: ${colors.containerBg === 'white' ? '#0a0a12' : colors.containerBg};`;
            
            return `
                /* Overview - Neon: Cyberpunk Retro-Future */
                .overview-content {
                    ${neonOverviewContentStyle}
                    background-image: 
                        ${neonMainBg ? '' : `
                        /* Circuit board pattern */
                        linear-gradient(90deg, ${colors.linkColor}22 1px, transparent 1px),
                        linear-gradient(180deg, ${colors.linkColor}22 1px, transparent 1px),`}
                        /* Neon glow gradient */
                        radial-gradient(circle at 50% 50%, 
                            ${colors.linkColor}08 0%, 
                            transparent 70%);
                    background-size: 
                        ${neonMainBg ? 'auto' : '20px 20px, 20px 20px,'} 
                        100% 100%;
                    
                    padding: 50px;
                    margin: 25px;
                    border: 2px solid ${colors.linkColor}66;
                    border-radius: 0;
                    position: relative;
                    min-height: 400px;
                    box-shadow: 
                        0 0 20px ${colors.linkColor}33,
                        inset 0 0 20px ${colors.linkColor}11;
                    color: ${colors.containerBg === 'white' ? '#e0e0e0' : colors.textPrimary};
                }

                /* Glowing corner brackets */
                .overview-content::before {
                    content: '┌─────────┐';
                    position: absolute;
                    top: 15px; left: 15px; right: 15px;
                    color: ${colors.linkColor};
                    font-family: monospace;
                    font-size: 14px;
                    text-shadow: 0 0 8px ${colors.linkColor}88;
                    pointer-events: none;
                    z-index: 1;
                    text-align: center;
                    letter-spacing: 2px;
                }

                .overview-content::after {
                    content: '└─────────┘';
                    position: absolute;
                    bottom: 15px; left: 15px; right: 15px;
                    color: ${colors.linkColor};
                    font-family: monospace;
                    font-size: 14px;
                    text-shadow: 0 0 8px ${colors.linkColor}88;
                    pointer-events: none;
                    z-index: 1;
                    text-align: center;
                    letter-spacing: 2px;
                }

                .overview-content p {
                    font-family: ${fonts.ui}, monospace;
                    font-size: 16px;
                    line-height: 1.7;
                    margin-bottom: 22px;
                    text-indent: 0;
                    position: relative;
                    z-index: 2;
                    color: ${colors.containerBg === 'white' ? '#d0d0d0' : colors.textContent || colors.textSecondary};
                }

                .overview-content p:first-of-type {
                    font-size: 18px;
                    color: ${colors.containerBg === 'white' ? '#ffffff' : colors.textTitle || colors.textPrimary};
                    background: linear-gradient(90deg, 
                        ${colors.linkColor}22 0%, 
                        transparent 100%);
                    padding: 20px 25px;
                    border-left: 3px solid ${colors.linkColor};
                    margin: 40px 0 30px 0;
                    position: relative;
                    z-index: 2;
                    text-shadow: 0 0 4px ${colors.linkColor}44;
                }
                
                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                    color: ${colors.containerBg === 'white' ? '#ffffff' : 'inherit'};
                }

                .overview-content h1.overview-title {
                    text-shadow: 0 0 8px ${colors.linkColor}66;
                    border-bottom: 2px solid ${colors.linkColor}88;
                    padding-bottom: 15px;
                }
            `;

        case 'archive':
            const archiveMainBg = generateOverviewMainBackgroundStyle();
            const archiveOverviewContentStyle = archiveMainBg ? 
                archiveMainBg : 
                `background: ${colors.containerBg};`;
            
            return `
                /* Overview - Archive: Research Library Filing System */
                .overview-content {
                    ${archiveOverviewContentStyle}
                    background-image: 
                        ${archiveMainBg ? '' : `
                        /* Filing cabinet lines */
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 32px,
                            ${colors.headerBg} 32px,
                            ${colors.headerBg} 34px
                        ),`}
                        /* Subtle paper texture */
                        linear-gradient(45deg, 
                            transparent 0%, 
                            ${colors.softBg}33 50%,
                            transparent 100%);
                    
                    padding: 45px 55px;
                    margin: 20px;
                    border: 1px solid ${colors.textMuted}44;
                    border-left: 8px solid ${colors.textSecondary};
                    border-radius: 0;
                    position: relative;
                    min-height: 380px;
                    box-shadow: 
                        2px 2px 8px rgba(0,0,0,0.08),
                        inset -2px 0 4px rgba(0,0,0,0.02);
                }

                /* Archive label in top corner */
                .overview-content::before {
                    content: 'OVERVIEW.TXT';
                    position: absolute;
                    top: 8px; right: 15px;
                    background: ${colors.headerBg};
                    color: ${colors.textSecondary};
                    font-family: monospace;
                    font-size: 11px;
                    font-weight: 600;
                    padding: 4px 8px;
                    border: 1px solid ${colors.textMuted}66;
                    border-radius: 2px;
                    pointer-events: none;
                    z-index: 1;
                    letter-spacing: 0.5px;
                }

                /* Classification mark */
                .overview-content::after {
                    content: '◉ RECORD';
                    position: absolute;
                    bottom: 12px; left: 15px;
                    color: ${colors.textMuted};
                    font-family: monospace;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    pointer-events: none;
                    z-index: 1;
                }

                .overview-content p {
                    font-family: ${fonts.ui};
                    font-size: 16px;
                    line-height: 1.7;
                    margin-bottom: 20px;
                    text-indent: 0;
                    position: relative;
                    z-index: 2;
                    color: ${colors.textContent || colors.textSecondary};
                }

                .overview-content p:first-of-type {
                    font-size: 17px;
                    color: ${colors.textTitle || colors.textPrimary};
                    background: ${colors.headerBg}66;
                    padding: 18px 22px;
                    border: 1px dashed ${colors.textMuted}66;
                    margin: 35px 0 25px 0;
                    position: relative;
                    z-index: 2;
                    font-weight: 500;
                }

                /* Add line numbers effect */
                .overview-content p:not(:first-of-type)::before {
                    content: counter(line-counter, decimal-leading-zero);
                    counter-increment: line-counter;
                    position: absolute;
                    left: -35px;
                    color: ${colors.textMuted};
                    font-family: monospace;
                    font-size: 12px;
                    width: 25px;
                    text-align: right;
                }

                .overview-content {
                    counter-reset: line-counter;
                }
                
                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                }

                .overview-content h1.overview-title {
                    font-family: ${fonts.ui};
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    border-bottom: 3px double ${colors.textMuted};
                    padding-bottom: 12px;
                    margin-bottom: 30px;
                }
            `;

        case 'kawaii':
            const kawaiiMainBg = generateOverviewMainBackgroundStyle();
            const kawaiiOverviewContentStyle = kawaiiMainBg ? 
                kawaiiMainBg : 
                `background: ${colors.containerBg};`;
            
            return `
                /* Overview - Kawaii: Cute Pastel Magic */
                .overview-content {
                    ${kawaiiOverviewContentStyle}
                    background-image: 
                        ${kawaiiMainBg ? '' : `
                        /* Floating hearts pattern */
                        radial-gradient(circle at 15% 25%, ${colors.linkColor}22 0%, transparent 8%),
                        radial-gradient(circle at 85% 15%, ${colors.linkColor}16 0%, transparent 6%),
                        radial-gradient(circle at 25% 75%, ${colors.linkColor}18 0%, transparent 7%),
                        radial-gradient(circle at 75% 85%, ${colors.linkColor}14 0%, transparent 5%),
                        /* Subtle sparkle dots */
                        radial-gradient(circle at 35% 45%, ${colors.textMuted}33 0%, transparent 3%),
                        radial-gradient(circle at 65% 35%, ${colors.textMuted}22 0%, transparent 2%),
                        radial-gradient(circle at 55% 65%, ${colors.textMuted}28 0%, transparent 3%),`}
                        /* Soft pastel gradient overlay */
                        linear-gradient(135deg, 
                            ${colors.containerBg}ee 0%, 
                            ${colors.linkColor}11 30%,
                            ${colors.headerBg}44 70%,
                            ${colors.containerBg}dd 100%);
                    
                    padding: 50px 60px;
                    margin: 30px;
                    border-radius: 25px;
                    position: relative;
                    min-height: 350px;
                    border: 3px solid ${colors.linkColor}44;
                    box-shadow: 
                        0 8px 32px ${colors.linkColor}22,
                        0 4px 16px rgba(0,0,0,0.06),
                        inset 0 2px 6px rgba(255,255,255,0.7);
                    overflow: hidden;
                }

                /* Floating sparkles decoration */
                .overview-content::before {
                    content: '✦ ✧ ⋆ ✦ ✧';
                    position: absolute;
                    top: 20px; right: 30px;
                    color: ${colors.linkColor}44;
                    font-size: 14px;
                    letter-spacing: 8px;
                    pointer-events: none;
                    z-index: 1;
                    animation: gentleFloat 4s ease-in-out infinite;
                }

                /* Cute heart decoration in bottom corner */
                .overview-content::after {
                    content: '♡';
                    position: absolute;
                    bottom: 20px; left: 30px;
                    color: ${colors.linkColor}55;
                    font-size: 24px;
                    pointer-events: none;
                    z-index: 1;
                    animation: heartPulse 3s ease-in-out infinite;
                }

                /* Soft, rounded typography */
                .overview-content p {
                    font-size: 17px;
                    line-height: 1.8;
                    margin-bottom: 24px;
                    text-indent: 0;
                    position: relative;
                    z-index: 2;
                    font-weight: 400;
                    color: ${colors.textContent || colors.textSecondary};
                }

                /* Special first paragraph styling - like a cute opening */
                .overview-content p:first-of-type {
                    font-size: 19px;
                    font-weight: 500;
                    color: ${colors.textTitle || colors.textPrimary};
                    text-align: center;
                    background: linear-gradient(135deg, 
                        rgba(255,255,255,0.6) 0%, 
                        ${colors.linkColor}22 50%,
                        rgba(255,255,255,0.4) 100%);
                    padding: 20px 25px;
                    margin: 30px 0 35px 0;
                    border-radius: 20px;
                    border: 2px solid ${colors.linkColor}33;
                    position: relative;
                    z-index: 2;
                    box-shadow: 
                        0 4px 16px ${colors.linkColor}16,
                        inset 0 1px 3px rgba(255,255,255,0.8);
                }

                /* Cute decorative elements around first paragraph */
                .overview-content p:first-of-type::before {
                    content: '♡';
                    position: absolute;
                    top: -8px; left: 20px;
                    color: ${colors.linkColor}66;
                    font-size: 16px;
                    animation: floatUp 2s ease-in-out infinite;
                }

                .overview-content p:first-of-type::after {
                    content: '♡';
                    position: absolute;
                    top: -8px; right: 20px;
                    color: ${colors.linkColor}66;
                    font-size: 16px;
                    animation: floatUp 2s ease-in-out infinite 1s;
                }

                /* Content positioning above decorations */
                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                }

                /* Kawaii title styling */
                .overview-content h1.overview-title {
                    text-align: center;
                    font-family: ${fonts.secondary};
                    font-weight: 600;
                    color: ${colors.textTitle || colors.textPrimary};
                    margin-bottom: 35px;
                    padding: 20px;
                    background: linear-gradient(135deg, 
                        ${colors.linkColor}22 0%, 
                        rgba(255,255,255,0.6) 50%,
                        ${colors.linkColor}16 100%);
                    border-radius: 20px;
                    border: 2px solid ${colors.linkColor}44;
                    position: relative;
                    letter-spacing: 0.5px;
                    box-shadow: 
                        0 6px 20px ${colors.linkColor}22,
                        inset 0 1px 4px rgba(255,255,255,0.8);
                }

                /* Kawaii animations */
                @keyframes gentleFloat {
                    0%, 100% { 
                        transform: translateY(0px) rotate(0deg);
                        opacity: 0.6;
                    }
                    33% { 
                        transform: translateY(-8px) rotate(2deg);
                        opacity: 0.8;
                    }
                    66% { 
                        transform: translateY(-4px) rotate(-1deg);
                        opacity: 0.7;
                    }
                }

                @keyframes heartPulse {
                    0%, 100% { 
                        transform: scale(1);
                        opacity: 0.5;
                    }
                    50% { 
                        transform: scale(1.3);
                        opacity: 0.8;
                    }
                }

                @keyframes floatUp {
                    0%, 100% { 
                        transform: translateY(0px) scale(1);
                        opacity: 0.6;
                    }
                    50% { 
                        transform: translateY(-6px) scale(1.1);
                        opacity: 1;
                    }
                }
            `;

        case 'candyPop':
            const candyPopMainBg = generateOverviewMainBackgroundStyle();
            const candyPopOverviewContentStyle = candyPopMainBg ? 
                candyPopMainBg : 
                `background: radial-gradient(circle at 30% 20%, 
                    ${colors.containerBg} 0%, 
                    ${colors.kawaiiPink}11 60%);`;
            
            return `
                /* Overview - Candy Pop: Sweet 3D Candy Styling */
                .overview-content {
                    ${candyPopOverviewContentStyle}
                    padding: 50px 60px;
                    margin: 30px;
                    border-radius: 25px;
                    border: 3px solid ${colors.kawaiiPink}66;
                    position: relative;
                    min-height: 350px;
                    overflow: hidden;
                    box-shadow: 
                        0 8px 25px ${colors.kawaiiPink}33,
                        inset 0 2px 0 rgba(255,255,255,0.7);
                }

                /* Candy shine effect across the top */
                .overview-content::before {
                    content: '';
                    position: absolute;
                    top: 5px; left: 5px; right: 5px;
                    height: 35%;
                    background: linear-gradient(135deg, 
                        rgba(255,255,255,0.5) 0%, 
                        rgba(255,255,255,0.15) 50%, 
                        transparent 100%);
                    border-radius: 20px 20px 40% 40%;
                    pointer-events: none;
                    z-index: 1;
                }

                /* Sweet candy typography */
                .overview-content p {
                    font-size: 17px;
                    line-height: 1.8;
                    margin-bottom: 24px;
                    text-indent: 0;
                    position: relative;
                    z-index: 2;
                    font-weight: 400;
                    color: ${colors.textContent || colors.textSecondary};
                }

                /* First paragraph as a candy button */
                .overview-content p:first-of-type {
                    font-size: 19px;
                    font-weight: 600;
                    color: ${colors.textTitle || colors.textPrimary};
                    text-align: center;
                    background: radial-gradient(circle at 30% 20%, 
                        ${colors.containerBg} 0%, 
                        ${colors.kawaiiPurple}22 60%);
                    padding: 25px 30px;
                    margin: 30px 0 35px 0;
                    border-radius: 20px;
                    border: 3px solid ${colors.kawaiiPurple}66;
                    position: relative;
                    z-index: 2;
                    box-shadow: 
                        0 6px 20px ${colors.kawaiiPurple}33,
                        inset 0 2px 0 rgba(255,255,255,0.8);
                }

                /* Candy shine on first paragraph */
                .overview-content p:first-of-type::before {
                    content: '';
                    position: absolute;
                    top: 3px; left: 3px; right: 3px;
                    height: 40%;
                    background: linear-gradient(135deg, 
                        rgba(255,255,255,0.6) 0%, 
                        rgba(255,255,255,0.2) 50%, 
                        transparent 100%);
                    border-radius: 17px 17px 40% 40%;
                    pointer-events: none;
                    z-index: 1;
                }

                /* Content positioning above shine effects */
                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                }

                /* Candy pop title styling */
                .overview-content h1.overview-title {
                    text-align: center;
                    font-family: ${fonts.secondary};
                    font-weight: 700;
                    color: ${colors.textTitle || colors.textPrimary};
                    margin-bottom: 35px;
                    padding: 25px;
                    background: radial-gradient(circle at 30% 20%, 
                        ${colors.containerBg} 0%, 
                        ${colors.kawaiiBlue}18 60%);
                    border-radius: 25px;
                    border: 3px solid ${colors.kawaiiBlue}66;
                    position: relative;
                    letter-spacing: 0.5px;
                    box-shadow: 
                        0 8px 25px ${colors.kawaiiBlue}33,
                        inset 0 2px 0 rgba(255,255,255,0.8);
                }

                /* Title candy shine */
                .overview-content h1.overview-title::before {
                    content: '';
                    position: absolute;
                    top: 3px; left: 3px; right: 3px;
                    height: 35%;
                    background: linear-gradient(135deg, 
                        rgba(255,255,255,0.5) 0%, 
                        rgba(255,255,255,0.15) 50%, 
                        transparent 100%);
                    border-radius: 22px 22px 40% 40%;
                    pointer-events: none;
                    z-index: 1;
                }

                /* Overview image gets candy treatment too */
                .overview-content .overview-image-container .overview-image {
                    border-radius: 15px !important;
                    border: 3px solid ${colors.kawaiiGold}66 !important;
                    box-shadow: 
                        0 6px 20px ${colors.kawaiiGold}33,
                        inset 0 1px 0 rgba(255,255,255,0.6) !important;
                }
            `;

        case 'cottagecoreDiary':
            const cottagecoreMainBg = generateOverviewMainBackgroundStyle();
            const cottagecoreOverviewContentStyle = cottagecoreMainBg ? 
                cottagecoreMainBg : 
                `background: radial-gradient(circle at 10% 10%, ${colors.softBg} 0%, transparent 80%),
                             radial-gradient(circle at 90% 85%, ${colors.containerBg} 0%, ${colors.softBg}99 100%);`;
            
            return `
                /* Overview - Cottagecore Diary: Cozy, rustic journal */
                .overview-content {
                    ${cottagecoreOverviewContentStyle}
                    padding: 50px 60px;
                    margin: 25px;
                    border: 1px solid ${colors.plants}33;
                    border-radius: 8px;
                    position: relative;
                    min-height: 400px;
                    box-shadow: 0 4px 16px ${colors.plants}1A;
                }

                /* Delicate vine decoration */
                .overview-content::before {
                    content: '🌿◦◦◦🌱◦◦◦🌿';
                    position: absolute;
                    left: 20px;
                    top: 25px;
                    bottom: 25px;
                    writing-mode: vertical-rl;
                    text-align: center;
                    color: ${colors.plants}77;
                    font-size: 12px;
                    letter-spacing: 8px;
                    pointer-events: none;
                    z-index: 1;
                }

                /* Pressed flower decoration */
                .overview-content::after {
                    content: '❀';
                    position: absolute;
                    bottom: 20px;
                    right: 25px;
                    font-size: 32px;
                    color: ${colors.journalAccent}55;
                    opacity: 0.6;
                    transform: rotate(-15deg);
                    pointer-events: none;
                    z-index: 1;
                }

                .overview-content p {
                    font-family: ${fonts.primary}, serif;
                    font-size: 16px;
                    line-height: 1.9;
                    margin-bottom: 22px;
                    text-indent: 25px;
                    position: relative;
                    z-index: 2;
                    margin-left: 30px; /* Space for vine */
                }
                
                .overview-content p:first-of-type {
                    font-size: 18px;
                    font-style: italic;
                    text-align: center;
                    text-indent: 0;
                    margin: 20px 0 35px 30px;
                    padding: 20px;
                    border-top: 1px solid ${colors.plants}22;
                    border-bottom: 1px solid ${colors.plants}22;
                    position: relative;
                    z-index: 2;
                }
                
                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                    margin-left: 30px;
                }

                .overview-content h1.overview-title {
                    margin-left: 0;
                    padding-left: 30px;
                    font-variant: small-caps;
                    letter-spacing: 1px;
                }
            `;

        case 'magicalGirlLocket':
            const locketMainBg = generateOverviewMainBackgroundStyle();
            const locketOverviewContentStyle = locketMainBg ? 
                locketMainBg : 
                `background: radial-gradient(circle at 50% 0%, ${colors.kawaiiPink}22 0%, ${colors.kawaiiPurple}11 80%);`;

            return `
                /* Overview - Magical Girl Locket: Sparkling transformation item */
                @keyframes sparkleFloat {
                    0%, 100% { transform: translateY(0); opacity: 0.9; }
                    50% { transform: translateY(-10px) scale(1.1); opacity: 1; }
                }

                .overview-content {
                    ${locketOverviewContentStyle}
                    padding: 60px;
                    margin: 40px;
                    border-radius: 60px 10px;
                    border: 4px solid ${colors.kawaiiGold}88;
                    position: relative;
                    min-height: 400px;
                    box-shadow: 
                        0 0 30px ${colors.kawaiiGold}44,
                        inset 0 0 20px ${colors.kawaiiGold}33,
                        inset 0 2px 5px rgba(255,255,255,0.8);
                }

                /* Ribbon at the top */
                .overview-content::before {
                    content: '🎀';
                    position: absolute;
                    top: -25px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 40px;
                    text-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    z-index: 3;
                }

                /* Floating sparkles */
                .overview-content::after {
                    content: '✦✧⋆';
                    position: absolute;
                    bottom: 25px;
                    right: 35px;
                    color: ${colors.kawaiiPink}99;
                    font-size: 16px;
                    letter-spacing: 6px;
                    pointer-events: none;
                    z-index: 1;
                    animation: sparkleFloat 5s ease-in-out infinite;
                }

                .overview-content p {
                    font-size: 17px;
                    line-height: 1.8;
                    margin-bottom: 24px;
                    text-indent: 0;
                    position: relative;
                    z-index: 2;
                    font-weight: 500;
                    color: ${colors.textContent || colors.textSecondary};
                }

                .overview-content p:first-of-type {
                    font-size: 19px;
                    color: ${colors.textTitle || colors.textPrimary};
                    text-align: center;
                    background: rgba(255,255,255,0.5);
                    border-radius: 20px;
                    padding: 25px;
                    margin: 30px 0;
                    border: 2px solid ${colors.kawaiiPink}44;
                    box-shadow: inset 0 1px 4px rgba(255,255,255,0.9);
                }

                .overview-content p:first-of-type::before {
                    content: '♡';
                    color: ${colors.kawaiiPink};
                    margin-right: 10px;
                }
                 .overview-content p:first-of-type::after {
                    content: '♡';
                    color: ${colors.kawaiiPink};
                    margin-left: 10px;
                }
                
                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                }
                
                .overview-content h1.overview-title {
                    font-family: ${fonts.secondary};
                    text-align: center;
                    color: ${colors.textTitle};
                    text-shadow: 0 0 10px ${colors.kawaiiPink}55, 0 0 20px ${colors.kawaiiGold}66;
                    letter-spacing: 1px;
                }
            `;

        case 'pastelSpells':
            const spellsMainBg = generateOverviewMainBackgroundStyle();
            const spellsOverviewContentStyle = spellsMainBg ? 
                spellsMainBg : 
                `background: ${colors.containerBg === 'white' ? '#2a2536' : colors.containerBg};`;
            
            return `
                /* Overview - Pastel Spells: Sweetly spooky grimoire */
                @keyframes crystalPulse {
                    0%, 100% { transform: scale(1); text-shadow: 0 0 10px ${colors.kawaiiPurple}66; }
                    50% { transform: scale(1.1); text-shadow: 0 0 20px ${colors.kawaiiPurple}99; }
                }

                .overview-content {
                    ${spellsOverviewContentStyle}
                    color: ${colors.containerBg === 'white' ? '#e0e0e0' : colors.textPrimary};
                    padding: 50px;
                    margin: 30px;
                    border: 6px double ${colors.kawaiiPurple}55;
                    border-radius: 12px;
                    position: relative;
                    min-height: 400px;
                    background-image: ${spellsMainBg ? '' : `
                        radial-gradient(circle at 15% 85%, ${colors.kawaiiPink}1A 0%, transparent 20%),
                        radial-gradient(circle at 85% 15%, ${colors.kawaiiPurple}22 0%, transparent 25%)`};
                }

                /* Floating crystal decoration */
                .overview-content::before {
                    content: '';
                    position: absolute;
                    top: 20px;
                    right: 25px;
                    font-size: 24px;
                    animation: crystalPulse 4s ease-in-out infinite;
                    z-index: 1;
                }
                
                /* Dripping potion effect */
                .overview-content::after {
                    content: '';
                    position: absolute;
                    top: -6px;
                    left: 30%;
                    width: 2px;
                    height: 50px;
                    background: linear-gradient(${colors.kawaiiGreen}99, transparent);
                    border-radius: 50%;
                    z-index: 1;
                }

                .overview-content p {
                    font-family: ${fonts.primary}, serif;
                    font-size: 17px;
                    line-height: 1.8;
                    margin-bottom: 24px;
                    position: relative;
                    z-index: 2;
                    text-shadow: 1px 1px 3px rgba(0,0,0,0.4);
                }

                .overview-content p:first-of-type {
                    font-size: 19px;
                    text-align: center;
                    padding: 20px;
                    margin-bottom: 35px;
                    border: 1px dashed ${colors.kawaiiPink}66;
                    border-radius: 8px;
                    background: ${colors.kawaiiPink}11;
                    color: ${colors.containerBg === 'white' ? '#ffffff' : colors.textTitle};
                }

                .overview-content p:first-of-type::before {
                    content: '☾ ';
                    opacity: 0.7;
                }
                 .overview-content p:first-of-type::after {
                    content: ' ☽';
                    opacity: 0.7;
                }

                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                    color: ${colors.containerBg === 'white' ? '#ffffff' : 'inherit'};
                }

                .overview-content h1.overview-title {
                    font-family: ${fonts.secondary};
                    text-align: center;
                    text-shadow: 0 0 8px ${colors.kawaiiPink}77, 0 0 15px ${colors.kawaiiPurple}55;
                    border-bottom: 1px solid ${colors.kawaiiPurple}44;
                    padding-bottom: 15px;
                }
            `;

        case 'strawberryPatch':
            const patchMainBg = generateOverviewMainBackgroundStyle();
            const patchOverviewContentStyle = patchMainBg ? 
                patchMainBg : 
                `background-color: #fff0f0;`;
            
            return `
                /* Overview - Strawberry Patch: Sweet picnic blanket */
                .overview-content {
                    ${patchOverviewContentStyle}
                    background-image: ${patchMainBg ? 'none' : `
                        repeating-linear-gradient(45deg, ${colors.journalAccent}11, ${colors.journalAccent}11 10px, transparent 10px, transparent 20px),
                        repeating-linear-gradient(-45deg, ${colors.journalAccent}11, ${colors.journalAccent}11 10px, transparent 10px, transparent 20px)`
                    };
                    padding: 50px;
                    margin: 25px;
                    border: 4px dashed ${colors.kawaiiGreen}aa;
                    border-radius: 20px;
                    position: relative;
                    min-height: 380px;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
                }

                /* Strawberry decorations in corners */
                .overview-content::before {
                    content: '🍓';
                    position: absolute;
                    top: 15px; left: 20px;
                    font-size: 28px;
                    transform: rotate(-20deg);
                    z-index: 1;
                }
                .overview-content::after {
                    content: '🍓';
                    position: absolute;
                    bottom: 15px; right: 20px;
                    font-size: 28px;
                    transform: rotate(15deg);
                    z-index: 1;
                }

                .overview-content p {
                    font-family: ${fonts.ui};
                    font-size: 17px;
                    line-height: 1.8;
                    margin-bottom: 24px;
                    position: relative;
                    z-index: 2;
                    color: ${colors.textContent || colors.textSecondary};
                }

                .overview-content p:first-of-type {
                    font-size: 19px;
                    font-weight: 500;
                    color: ${colors.textTitle || colors.textPrimary};
                    background: white;
                    border: 2px solid ${colors.journalAccent};
                    border-radius: 15px;
                    padding: 25px;
                    margin: 30px 0 35px 0;
                    text-align: center;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                }
                
                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                }

                .overview-content h1.overview-title {
                    text-align: center;
                    background: ${colors.kawaiiGreen}66;
                    color: white;
                    padding: 15px;
                    border-radius: 20px;
                    text-shadow: 1px 1px 2px ${colors.plants}88;
                    font-family: ${fonts.secondary};
                    letter-spacing: 0.5px;
                }
            `;    

        case 'industrial':
            const industrialMainBg = generateOverviewMainBackgroundStyle();
            
            // Define the wireframe grid overlay
            const meshGradient = `
                repeating-linear-gradient(0deg, ${colors.bannerBorder}33, ${colors.bannerBorder}33 1px, transparent 1px, transparent 20px),
                repeating-linear-gradient(90deg, ${colors.bannerBorder}33, ${colors.bannerBorder}33 1px, transparent 1px, transparent 20px)
            `;

            // Start building the style string for the content area
            let industrialOverviewContentStyle = '';

            if (industrialMainBg) {
                // If a custom background exists, layer the mesh on top of it
                industrialOverviewContentStyle = `${industrialMainBg} background-image: ${meshGradient};`;
            } else {
                // If no custom background, use container color with mesh
                industrialOverviewContentStyle = `background-color: ${colors.containerBg}; background-image: ${meshGradient};`;
            }

            return `
                /* Overview - Industrial Style */
                .overview-content {
                    ${industrialOverviewContentStyle}
                    padding: 40px;
                    margin: 20px;
                    border: 1px solid ${colors.bannerBorder};
                    border-radius: 4px;
                    position: relative;
                    min-height: 350px;
                    overflow: hidden; /* Ensures pseudo-elements don't spill out */
                }

                /* Data block / Header stamp */
                .overview-content::before {
                    content: 'SYSTEM OVERVIEW //';
                    position: absolute;
                    top: 0;
                    left: 0;
                    background: ${colors.journalAccent};
                    color: ${colors.bodyBg};
                    padding: 6px 15px 6px 40px;
                    font-family: ${fonts.accent};
                    font-weight: 700;
                    font-size: 12px;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    clip-path: polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0% 100%);
                }

                .overview-content p {
                    font-size: 16px;
                    line-height: 1.8;
                    margin-bottom: 20px;
                    text-indent: 0; /* No indentation for a blocky, modern feel */
                    position: relative;
                    z-index: 2; /* Keep text above the grid */
                }
                
                /* Style the first paragraph like an incoming transmission or log entry */
                .overview-content p:first-of-type {
                    font-family: ${fonts.accent}; /* Use monospaced font */
                    font-size: 17px;
                    color: ${colors.textPrimary};
                    background: ${colors.headerBg}80; /* Semi-transparent background */
                    padding: 15px;
                    margin-top: 40px; /* Push it down below the ::before stamp */
                    border-left: 3px solid ${colors.journalAccent};
                }
                
                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                }
            `;

        case 'wuxia':
            const wuxiaMainBg = generateOverviewMainBackgroundStyle();
            const wuxiaOverviewContentStyle = wuxiaMainBg ? 
                wuxiaMainBg : 
                `background: ${colors.containerBg};`;
            
            return `
                /* Overview - Wuxia: Elegant Cultivation Manual */
                .overview-content {
                    ${wuxiaOverviewContentStyle}
                    padding: 60px 80px;
                    margin: 40px auto;
                    max-width: 850px;
                    border: 2px solid ${colors.bannerBorder};
                    border-radius: 12px;
                    position: relative;
                    min-height: 400px;
                    overflow: hidden;
                    box-shadow: 
                        0 8px 32px rgba(0,0,0,0.06),
                        0 2px 8px rgba(0,0,0,0.08),
                        inset 0 1px 3px ${colors.containerBg}90;
                }

                /* Mist pattern overlay for overview content */
                .overview-content::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: url('images/styles/mist.png') center/cover no-repeat;
                    opacity: 0.08;
                    pointer-events: none;
                    z-index: 1;
                    background-blend-mode: soft-light;
                }

                /* Subtle traditional pattern overlay (layered under mist) */
                .overview-content {
                    background-image: 
                        ${wuxiaMainBg ? '' : `
                        repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 25px,
                            ${colors.wuxiaGlow}15 25px,
                            ${colors.wuxiaGlow}15 27px
                        ),
                        repeating-linear-gradient(
                            -45deg,
                            transparent,
                            transparent 25px,
                            ${colors.wuxiaGlow}10 25px,
                            ${colors.wuxiaGlow}10 27px
                        ),`}
                        linear-gradient(135deg, 
                            ${colors.containerBg}10 0%, 
                            transparent 50%,
                            ${colors.wuxiaGlow}05 100%);
                }

                /* Elegant typography - like brush calligraphy */
                .overview-content p {
                    font-family: ${fonts.primary}, serif;
                    font-size: 17px;
                    line-height: 1.8;
                    margin-bottom: 24px;
                    text-align: justify;
                    text-indent: 0;
                    position: relative;
                    z-index: 2;
                    color: ${colors.textContent || colors.textSecondary};
                }

                /* First paragraph - like an elegant opening inscription */
                .overview-content p:first-of-type {
                    font-size: 19px;
                    font-weight: 500;
                    color: ${colors.textTitle || colors.textPrimary};
                    text-align: center;
                    padding: 20px 40px;
                    margin: 20px 0 40px 0;
                    border: 1px solid ${colors.bannerBorder};
                    border-radius: 8px;
                    background: linear-gradient(135deg, 
                        ${colors.containerBg}60 0%, 
                        ${colors.wuxiaGlow}10 100%);
                    position: relative;
                    text-indent: 0;
                    line-height: 1.6;
                    z-index: 2;
                }

                .overview-content p:first-of-type::before {
                    left: 15px;
                }

                .overview-content p:first-of-type::after {
                    right: 15px;
                }
                
                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                }

                /* Style the overview title to match the elegant theme */
                .overview-content h1.overview-title {
                    text-align: center;
                    font-family: ${fonts.secondary};
                    font-weight: 500;
                    color: ${colors.textTitle || colors.textPrimary};
                    margin-bottom: 30px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid ${colors.wuxiaAccent}30;
                    letter-spacing: 1px;
                    position: relative;
                    z-index: 2;
                }

                /* Image styling to match the refined aesthetic */
                .overview-content .overview-image-container {
                    text-align: center;
                    margin: 35px 0;
                    position: relative;
                    z-index: 2;
                }

                /* ANIMATED BOTTOM MIST EFFECT - Only for wuxia overview style */
                body::after {
                    content: '';
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 150%;
                    height: 300px;
                    background: url('images/styles/fog.png') repeat-x bottom;
                    background-size: auto 100%;
                    pointer-events: none;
                    z-index: -1;
                    opacity: 0.4;
                    animation: gentleMist 8s ease-in-out infinite;
                    /* Gradient mask - more opaque at bottom, transparent at top */
                    mask: linear-gradient(to top, 
                        rgba(0,0,0,0.8) 0%, 
                        rgba(0,0,0,0.6) 30%, 
                        rgba(0,0,0,0.3) 60%, 
                        rgba(0,0,0,0.1) 80%, 
                        rgba(0,0,0,0) 100%);
                    -webkit-mask: linear-gradient(to top, 
                        rgba(0,0,0,0.8) 0%, 
                        rgba(0,0,0,0.6) 30%, 
                        rgba(0,0,0,0.3) 60%, 
                        rgba(0,0,0,0.1) 80%, 
                        rgba(0,0,0,0) 100%);
                }

                @keyframes gentleMist {
                    0% {
                        transform: translateX(0);
                    }
                    50% {
                        transform: translateX(-120px);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
            `;
        case 'horrific':
            const horrificMainBg = generateOverviewMainBackgroundStyle();
            
            // Build the background style for the cursed manuscript
            let horrificOverviewContentStyle = '';

            if (horrificMainBg) {
                // Use custom background with blood effects layered on top
                horrificOverviewContentStyle = horrificMainBg;
            } else {
                // Use container background as fallback
                horrificOverviewContentStyle = `background-color: ${colors.containerBg};`;
            }

            // Add the cursed manuscript texture regardless of custom background
            horrificOverviewContentStyle += `
                background-image: 
                    /* Blood drops in corners - using journalAccent */
                    radial-gradient(circle at 15% 10%, ${colors.journalAccent}4D 0%, ${colors.journalAccent}1A 2%, transparent 4%),
                    radial-gradient(circle at 85% 15%, ${colors.journalAccent}33 0%, ${colors.journalAccent}0D 3%, transparent 6%),
                    radial-gradient(circle at 10% 85%, ${colors.journalAccent}40 0%, ${colors.journalAccent}14 2.5%, transparent 5%),
                    
                    /* Dark stains and wear marks */
                    radial-gradient(ellipse at 75% 80%, rgba(0,0,0,0.15) 0%, transparent 8%),
                    radial-gradient(ellipse at 25% 20%, rgba(0,0,0,0.1) 0%, transparent 12%),
                    
                    /* Creeping shadows from edges */
                    linear-gradient(to right, rgba(0,0,0,0.2) 0%, transparent 8%),
                    linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 6%),
                    linear-gradient(to left, rgba(0,0,0,0.1) 0%, transparent 5%),
                    linear-gradient(to top, rgba(0,0,0,0.12) 0%, transparent 4%);`;

            return `
                /* Overview - Horrific: Cursed Grimoire Page */
                .overview-content {
                    ${horrificOverviewContentStyle}
                    padding: 60px 50px;
                    margin: 30px;
                    border: 3px solid ${colors.headerBg};
                    border-radius: 0;
                    position: relative;
                    min-height: 400px;
                    overflow: hidden;
                    box-shadow: 
                        0 8px 40px rgba(0,0,0,0.8),
                        inset 0 0 30px rgba(0,0,0,0.3),
                        inset 0 2px 6px ${colors.journalAccent}1A;
                }

                /* Torn manuscript edges */
                .overview-content::before {
                    content: '';
                    position: absolute;
                    top: -3px; left: -3px;
                    right: -3px; bottom: -3px;
                    border: 1px solid ${colors.journalAccent}66;
                    border-radius: 0;
                    background: 
                        /* Torn edge pattern on top */
                        linear-gradient(to right, 
                            transparent 0%, transparent 2%, 
                            ${colors.headerBg} 2%, ${colors.headerBg} 3%, 
                            transparent 3%, transparent 5%,
                            ${colors.headerBg} 5%, ${colors.headerBg} 6%,
                            transparent 6%, transparent 8%,
                            ${colors.headerBg} 8%, ${colors.headerBg} 9%,
                            transparent 9%, transparent 100%
                        ) top / 100% 4px no-repeat,
                        /* Torn edge pattern on bottom */
                        linear-gradient(to right, 
                            transparent 0%, transparent 1%, 
                            ${colors.headerBg} 1%, ${colors.headerBg} 2.5%, 
                            transparent 2.5%, transparent 4%,
                            ${colors.headerBg} 4%, ${colors.headerBg} 5.5%,
                            transparent 5.5%, transparent 7%,
                            ${colors.headerBg} 7%, ${colors.headerBg} 8.5%,
                            transparent 8.5%, transparent 100%
                        ) bottom / 100% 4px no-repeat;
                    pointer-events: none;
                    z-index: 0;
                }

                /* Blood drips cascading from top edge */
                .overview-content::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: 
                        /* Main blood drip from top center - using journalAccent */
                        linear-gradient(to bottom, 
                            ${colors.journalAccent}99 0%, 
                            ${colors.journalAccent}66 3%, 
                            ${colors.journalAccent}33 8%, 
                            transparent 15%
                        ) 50% 0 / 3px 80px no-repeat,
                        
                        /* Smaller drip from top left */
                        linear-gradient(to bottom, 
                            ${colors.journalAccent}66 0%, 
                            ${colors.journalAccent}33 4%, 
                            transparent 10%
                        ) 25% 0 / 2px 40px no-repeat,
                        
                        /* Tiny drip from top right */
                        linear-gradient(to bottom, 
                            ${colors.journalAccent}80 0%, 
                            ${colors.journalAccent}4D 2%, 
                            ${colors.journalAccent}1A 6%, 
                            transparent 12%
                        ) 75% 0 / 2px 50px no-repeat,
                        
                        /* Splatter stain near bottom right */
                        radial-gradient(ellipse at 80% 85%, 
                            ${colors.journalAccent}4D 0%, 
                            ${colors.journalAccent}1A 40%, 
                            transparent 70%
                        ) no-repeat;
                    pointer-events: none;
                    z-index: 1;
                    animation: bloodDrip 8s ease-in-out infinite;
                }

                /* Subtle blood drip animation */
                @keyframes bloodDrip {
                    0%, 100% { 
                        opacity: 0.7;
                    }
                    25% { 
                        opacity: 1;
                    }
                    50% { 
                        opacity: 0.8;
                    }
                    75% { 
                        opacity: 0.9;
                    }
                }

                /* Text styling - like handwritten in a dark tome */
                .overview-content p {
                    font-size: 17px;
                    line-height: 1.8;
                    margin-bottom: 24px;
                    text-indent: 0;
                    position: relative;
                    z-index: 3;
                    text-align: justify;
                    font-family: ${fonts.primary};
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                }

                /* First paragraph - like an ancient curse inscription */
                .overview-content p:first-of-type {
                    font-size: 20px;
                    font-family: ${fonts.ui};
                    color: ${colors.textTitle || colors.textPrimary};
                    text-align: center;
                    text-indent: 0;
                    margin-bottom: 35px;
                    padding: 20px;
                    background: linear-gradient(135deg, 
                        ${colors.journalAccent}14 0%, 
                        rgba(0,0,0,0.1) 50%, 
                        ${colors.journalAccent}0D 100%);
                    border: 1px solid ${colors.journalAccent}4D;
                    border-left: 3px solid ${colors.journalAccent}99;
                    border-right: 3px solid ${colors.journalAccent}99;
                    position: relative;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    font-weight: 600;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
                }

                /* Occult symbols flanking the first paragraph */
                .overview-content p:first-of-type::before {
                    content: "◈";
                    position: absolute;
                    left: 10px; top: 50%;
                    transform: translateY(-50%);
                    color: ${colors.journalAccent}99;
                    font-size: 16px;
                    text-shadow: 0 0 8px ${colors.journalAccent}4D;
                }

                .overview-content p:first-of-type::after {
                    content: "◈";
                    position: absolute;
                    right: 10px; top: 50%;
                    transform: translateY(-50%);
                    color: ${colors.journalAccent}99;
                    font-size: 16px;
                    text-shadow: 0 0 8px ${colors.journalAccent}4D;
                }

                /* All positioned content stays above blood effects */
                .overview-content h1.overview-title,
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 3;
                }

                /* Overview title gets a blood-stained header effect */
                .overview-content h1.overview-title {
                    background: linear-gradient(135deg, 
                        ${colors.journalAccent}1A 0%, 
                        rgba(0,0,0,0.15) 100%);
                    border-bottom: 2px solid ${colors.journalAccent}99;
                    margin: -60px -50px 30px -50px;
                    padding: 25px 50px;
                    font-family: ${fonts.ui};
                    font-weight: 700;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    text-shadow: 2px 2px 6px rgba(0,0,0,0.8);
                    position: relative;
                }

                /* Dripping effect under title */
                .overview-content h1.overview-title::after {
                    content: '';
                    position: absolute;
                    bottom: -2px; left: 30%;
                    width: 40%; height: 4px;
                    background: linear-gradient(to bottom, 
                        ${colors.journalAccent}B3 0%, 
                        ${colors.journalAccent}4D 50%, 
                        transparent 100%);
                    border-radius: 0 0 50% 50%;
                }

                /* Overview image gets a cursed frame */
                .overview-content .overview-image-container .overview-image {
                    border: 3px solid ${colors.headerBg} !important;
                    border-radius: 0 !important;
                    box-shadow: 
                        0 0 30px ${colors.journalAccent}66,
                        0 6px 25px rgba(0,0,0,0.7),
                        inset 0 0 15px rgba(0,0,0,0.3) !important;
                    filter: saturate(0.8) contrast(1.2) brightness(0.9);
                    transition: all 0.4s ease;
                }

                .overview-content .overview-image-container .overview-image:hover {
                    filter: saturate(0.9) contrast(1.1) brightness(1);
                    box-shadow: 
                        0 0 40px ${colors.journalAccent}99,
                        0 8px 35px rgba(0,0,0,0.8),
                        inset 0 0 15px rgba(0,0,0,0.2) !important;
                    transform: scale(1.02) rotate(0.2deg);
                }
            `;

        case 'foundFootage':
            const footageMainBg = generateOverviewMainBackgroundStyle();
            const footageOverviewContentStyle = footageMainBg ?
                footageMainBg :
                `background-color: ${colors.headerBg};`;

            return `
                /* Overview - Found Footage: Security Camera Feed */
                @keyframes rec-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                .overview-content {
                    ${footageOverviewContentStyle}
                    padding: 50px;
                    margin: 20px;
                    border: 4px solid ${colors.bodyBg}CC; /* Dark border */
                    border-radius: 12px;
                    position: relative;
                    min-height: 400px;
                    overflow: hidden;
                    box-shadow: inset 0 0 80px ${colors.bodyBg}E6; /* Dark vignette */
                    font-family: ${fonts.ui}, monospace;
                }

                /* Scanlines overlay using a thematic green */
                .overview-content::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: repeating-linear-gradient(
                        0deg,
                        ${colors.wuxiaGlow}0D,
                        ${colors.wuxiaGlow}0D 1px,
                        transparent 1px,
                        transparent 3px
                    );
                    pointer-events: none;
                    z-index: 1;
                }

                /* REC indicator using accent color */
                .overview-content::before {
                    content: '';
                    position: absolute;
                    top: 15px; left: 20px;
                    color: ${colors.journalAccent};
                    font-size: 14px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    text-shadow: 0 0 8px ${colors.journalAccent}99;
                    z-index: 3;
                    animation: rec-pulse 1.5s infinite;
                }

                /* Camera Info / Timestamp */
                .overview-content .overview-links-container::before {
                    content: 'CAM_01 // 03:14:22 AM';
                    position: absolute;
                    bottom: -20px; right: 0;
                    color: ${colors.textMuted};
                    font-size: 13px;
                    font-weight: 700;
                    z-index: 3;
                }

                /* Night-vision text styling */
                .overview-content p {
                    font-size: 16px;
                    line-height: 1.7;
                    color: ${colors.textPrimary};
                    text-shadow: 0 0 5px ${colors.wuxiaGlow}66, 0 0 10px ${colors.wuxiaGlow}33;
                    position: relative;
                    z-index: 2;
                }

                .overview-content h1.overview-title {
                    font-size: 24px;
                    color: ${colors.textPrimary};
                    text-shadow: 0 0 8px ${colors.wuxiaGlow}88;
                    text-transform: uppercase;
                    border: 1px solid ${colors.textMuted}44;
                    padding: 10px;
                    margin-bottom: 30px;
                    text-align: center;
                    background: ${colors.bodyBg}4D; /* Semi-transparent dark background */
                    position: relative;
                    z-index: 2;
                }

                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                }
                
                .overview-content .overview-image-container .overview-image {
                    filter: grayscale(1) contrast(1.5) brightness(1.2);
                    border: 2px solid ${colors.textMuted}33 !important;
                }
            `;

        case 'badSignal':
            const signalMainBg = generateOverviewMainBackgroundStyle();
            const signalOverviewContentStyle = signalMainBg ?
                signalMainBg :
                `background-color: ${colors.headerBg};`;
            
            return `
                /* Overview - Cursed Signal: Haunted Broadcast */
                @keyframes vhs-jitter {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
                @keyframes text-glitch {
                    0% { text-shadow: 1px 0 0 ${colors.journalAccent}, -1px 0 0 ${colors.linkColor}; }
                    25% { text-shadow: -1px 0 0 ${colors.journalAccent}, 1px 0 0 ${colors.linkColor}; }
                    50% { text-shadow: 1px 0 0 ${colors.journalAccent}, -1px 0 0 ${colors.linkColor}; opacity: 0.9; }
                    74% { opacity: 1; }
                    75% { text-shadow: none; opacity: 0.4; }
                    100% { text-shadow: 1px 0 0 ${colors.journalAccent}, -1px 0 0 ${colors.linkColor}; opacity: 1; }
                }

                .overview-content {
                    ${signalOverviewContentStyle}
                    padding: 50px;
                    margin: 20px;
                    border: 1px solid ${colors.bodyBg};
                    position: relative;
                    min-height: 400px;
                    overflow: hidden;
                    box-shadow: inset 0 0 50px ${colors.bodyBg}B3; /* Dark inset shadow */
                }
                
                /* Static noise overlay */
                .overview-content::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background-image:
                        repeating-linear-gradient(${colors.textPrimary}05 0, transparent 0.5%),
                        repeating-linear-gradient(90deg, ${colors.bodyBg}0A 0, transparent 0.2%);
                    background-size: 1px 4px, 2px 1px;
                    opacity: 0.8;
                    pointer-events: none;
                    z-index: 1;
                    animation: vhs-jitter 0.1s infinite;
                }

                /* Dark ring / well vignette */
                .overview-content {
                    background-image: radial-gradient(circle, transparent 40%, ${colors.bodyBg} 85%);
                }

                /* VHS tracking error line */
                .overview-content::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: ${colors.textPrimary}1A; /* Faint white line */
                    z-index: 3;
                    animation: vhs-jitter 0.2s infinite reverse;
                    top: 40%;
                }

                .overview-content p,
                .overview-content h1.overview-title {
                    position: relative;
                    z-index: 2;
                    color: ${colors.textPrimary};
                    animation: text-glitch 4s infinite linear;
                }

                .overview-content p {
                    font-size: 16px;
                    line-height: 1.8;
                }

                .overview-content h1.overview-title {
                    font-size: 32px;
                    text-align: center;
                    margin-bottom: 30px;
                    text-transform: uppercase;
                    font-weight: 900;
                }
                
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                }
                
                .overview-content .overview-image-container .overview-image {
                    filter: saturate(0) contrast(1.8) brightness(0.9);
                    opacity: 0.8;
                }
            `;

        case 'theFurther':
            const veilMainBg = generateOverviewMainBackgroundStyle();
            const veilOverviewContentStyle = veilMainBg ?
                veilMainBg :
                `background-color: ${colors.bodyBg};`;
            
            return `
                /* Overview - The Veil: Ethereal Shadow Realm */
                @keyframes smoke-drift {
                    0% { transform: translateX(0) translateY(0); opacity: 0.1; }
                    50% { transform: translateX(-20px) translateY(10px); opacity: 0.15; }
                    100% { transform: translateX(0) translateY(0); opacity: 0.1; }
                }
                @keyframes text-waver {
                    0%, 100% { transform: skewX(0); opacity: 0.7; }
                    50% { transform: skewX(0.5deg); opacity: 0.6; }
                }

                .overview-content {
                    ${veilOverviewContentStyle}
                    background-image:
                        /* Smoky/misty textures */
                        radial-gradient(ellipse at 20% 80%, ${colors.headerBg}99 0%, transparent 50%),
                        radial-gradient(ellipse at 80% 30%, ${colors.headerBg}88 0%, transparent 40%);
                    padding: 60px;
                    margin: 20px;
                    border: 1px solid ${colors.bodyBg};
                    position: relative;
                    min-height: 400px;
                    box-shadow: inset 0 0 100px ${colors.bodyBg}F2; /* Heavy dark inset */
                    overflow: hidden;
                }

                /* Drifting smoke/shadow overlay */
                .overview-content::before {
                    content: '';
                    position: absolute;
                    top: -50%; left: -50%;
                    width: 200%; height: 200%;
                    background-image:
                        radial-gradient(ellipse at 50% 50%, transparent 0%, ${colors.bodyBg}CC 60%);
                    animation: smoke-drift 12s ease-in-out infinite;
                    z-index: 1;
                }

                /* Ghostly, hard-to-read text */
                .overview-content p {
                    font-family: ${fonts.primary}, serif;
                    font-size: 18px;
                    line-height: 2;
                    text-align: center;
                    color: ${colors.textMuted};
                    /* Crucial effect: blurry, glowing, faint text */
                    text-shadow: 0 0 8px ${colors.journalAccent}33, 0 0 12px ${colors.headerBg}88;
                    position: relative;
                    z-index: 2;
                    animation: text-waver 8s ease-in-out infinite;
                }
                
                .overview-content h1.overview-title {
                    font-family: ${fonts.secondary}, serif;
                    font-size: 42px;
                    color: ${colors.textSecondary};
                    text-shadow: 0 0 15px ${colors.journalAccent}88, 0 0 25px ${colors.journalAccent}55;
                    text-align: center;
                    margin-bottom: 40px;
                    font-weight: 300;
                    letter-spacing: 4px;
                    position: relative;
                    z-index: 2;
                }
                
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                    filter: brightness(0.6) blur(1px);
                }
            `;

       case 'parchment':
            const parchmentMainBg = generateOverviewMainBackgroundStyle();
            const parchmentOverviewContentStyle = parchmentMainBg ? 
                parchmentMainBg : 
                `background: ${colors.containerBg};`;
            
            return `
                /* Overview - Parchment&Quill: Elegant Personal Correspondence */
                .overview-content {
                    ${parchmentOverviewContentStyle}
                    padding: 60px 80px 50px;
                    margin: 30px auto;
                    max-width: 800px;
                    border: 2px solid ${colors.journalAccent}33;
                    border-radius: 12px;
                    position: relative;
                    min-height: 450px;
                    overflow: hidden;
                    box-shadow: 
                        0 8px 32px ${colors.journalAccent}1F,
                        0 2px 8px rgba(0,0,0,0.08),
                        inset 0 1px 4px rgba(255,255,255,0.9);
                }

                /* Elegant parchment paper texture */
                .overview-content {
                    background-image: 
                        ${parchmentMainBg ? '' : `
                        /* Fine paper grain - using journalAccent */
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 18px,
                            ${colors.journalAccent}04 18px,
                            ${colors.journalAccent}04 20px
                        ),
                        repeating-linear-gradient(
                            90deg,
                            transparent,
                            transparent 25px,
                            ${colors.journalAccent}02 25px,
                            ${colors.journalAccent}02 26px
                        ),`}
                        /* Watermark flourishes - using background colors */
                        radial-gradient(circle at 15% 20%, 
                            ${colors.softBg}33 0%, 
                            transparent 30%),
                        radial-gradient(circle at 85% 80%, 
                            ${colors.headerBg}26 0%, 
                            transparent 25%),
                        /* Gentle aging gradient */
                        linear-gradient(135deg, 
                            rgba(255,255,255,0.4) 0%, 
                            ${colors.softBg}1A 50%,
                            ${colors.headerBg}33 100%);
                }

                /* Typography - like elegant handwritten correspondence */
                .overview-content p {
                    font-family: ${fonts.primary}, serif;
                    font-size: 17px;
                    line-height: 1.8;
                    margin-bottom: 28px;
                    text-align: justify;
                    text-indent: 25px;
                    position: relative;
                    z-index: 2;
                    color: ${colors.textContent || colors.textSecondary};
                    padding: 0 5px; /* Slight padding for justified text */
                }

                /* First paragraph - like an elegant letter opening */
                .overview-content p:first-of-type {
                    font-size: 19px;
                    font-weight: 500;
                    color: ${colors.textTitle || colors.textPrimary};
                    text-align: center;
                    text-indent: 0;
                    margin: 80px 0 40px 0; /* Space for the wax seal */
                    padding: 25px 30px;
                    background: linear-gradient(135deg, 
                        ${colors.softBg}4D 0%, 
                        ${colors.headerBg}33 50%,
                        ${colors.softBg}1A 100%);
                    border: 1px solid ${colors.journalAccent}26;
                    border-radius: 8px;
                    position: relative;
                    line-height: 1.7;
                    font-style: italic;
                    letter-spacing: 0.3px;
                }

                /* Elegant quotation marks for the opening - using journalAccent */
                .overview-content p:first-of-type::before {
                    content: """;
                    position: absolute;
                    top: -5px; left: 10px;
                    color: ${colors.journalAccent}66;
                    font-size: 48px;
                    font-family: serif;
                    line-height: 1;
                }

                .overview-content p:first-of-type::after {
                    content: """;
                    position: absolute;
                    bottom: -15px; right: 10px;
                    color: ${colors.journalAccent}66;
                    font-size: 48px;
                    font-family: serif;
                    line-height: 1;
                }

                /* Subsequent paragraphs with elegant indentation */
                .overview-content p:not(:first-of-type) {
                    position: relative;
                }

                /* Subtle ink dot to start each new paragraph */
                .overview-content p:not(:first-of-type)::before {
                    content: "•";
                    position: absolute;
                    left: 15px;
                    color: ${colors.journalAccent}4D;
                    font-size: 8px;
                    top: 0.8em;
                }

                /* Overview title with letterhead styling */
                .overview-content h1.overview-title {
                    text-align: center;
                    font-family: ${fonts.secondary};
                    font-weight: 600;
                    color: ${colors.textTitle || colors.textPrimary};
                    margin: -60px -80px 40px -80px;
                    padding: 35px 80px 25px;
                    background: linear-gradient(135deg, 
                        ${colors.softBg}66 0%, 
                        ${colors.headerBg}4D 50%,
                        ${colors.softBg}33 100%);
                    border-bottom: 2px solid ${colors.journalAccent}33;
                    position: relative;
                    z-index: 2;
                    letter-spacing: 1.5px;
                    text-transform: lowercase;
                    font-variant: small-caps;
                    font-size: 2.2em;
                    text-shadow: 0 1px 3px rgba(255,255,255,0.8);
                }

                /* Letterhead flourish under title */
                .overview-content h1.overview-title::after {
                    content: "❦";
                    position: absolute;
                    bottom: -15px; left: 50%;
                    transform: translateX(-50%);
                    color: ${colors.journalAccent}66;
                    font-size: 20px;
                    background: ${colors.containerBg};
                    padding: 0 8px;
                }

                /* Overview image with elegant frame */
                .overview-content .overview-image-container {
                    text-align: center;
                    margin: 35px 0;
                    position: relative;
                    z-index: 2;
                }

                /* Overview links positioned elegantly */
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                    margin-top: 35px;
                }

                /* Letter closing signature area */
                .overview-content {
                    padding-bottom: 70px; /* Extra space for signature effect */
                }

                /* Elegant signature line at bottom */
                .overview-content .overview-links-container::after {
                    content: "";
                    position: absolute;
                    bottom: -40px; right: 20px;
                    width: 120px; height: 1px;
                    background: linear-gradient(to right, 
                        transparent, 
                        ${colors.journalAccent}4D);
                    z-index: 1;
                }

                /* "With warm regards" flourish */
                .overview-content .overview-links-container::before {
                    content: "~";
                    position: absolute;
                    bottom: -30px; right: 25px;
                    color: ${colors.journalAccent}40;
                    font-size: 24px;
                    font-style: italic;
                    z-index: 1;
                }
            `;

        case 'dataTerminal':
            const dataTerminalMainBg = generateOverviewMainBackgroundStyle();
            const dataTerminalOverviewContentStyle = dataTerminalMainBg ? 
                dataTerminalMainBg : 
                `background: ${colors.containerBg};`;
            
            return `
                /* Overview - Data Terminal: Cyberpunk console interface */
                .overview-content {
                    ${dataTerminalOverviewContentStyle}
                    background-image: 
                        ${dataTerminalMainBg ? '' : `
                        /* Terminal scanlines */
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 2px,
                            ${colors.journalAccent}11 2px,
                            ${colors.journalAccent}11 4px,
                            transparent 4px,
                            transparent 8px
                        ),
                        /* Circuit board grid */
                        repeating-linear-gradient(90deg, 
                            transparent, 
                            transparent 25px, 
                            ${colors.journalAccent}08 25px, 
                            ${colors.journalAccent}08 27px),
                        repeating-linear-gradient(0deg, 
                            transparent, 
                            transparent 25px, 
                            ${colors.journalAccent}08 25px, 
                            ${colors.journalAccent}08 27px),`}
                        /* Terminal glow gradient */
                        radial-gradient(ellipse at 50% 0%, 
                            ${colors.journalAccent}22 0%, 
                            transparent 70%);
                    
                    padding: 40px 50px;
                    margin: 20px;
                    border: 2px solid ${colors.journalAccent}66;
                    border-radius: 0;
                    position: relative;
                    min-height: 400px;
                    overflow: hidden;
                    font-family: 'Courier New', monospace;
                    
                    box-shadow: 
                        0 0 30px ${colors.journalAccent}44,
                        inset 0 0 20px ${colors.journalAccent}11;
                }

                /* Terminal header bar */
                .overview-content::before {
                    content: '> SYSTEM_OVERVIEW.EXE | STATUS: ONLINE | USER: AUTHENTICATED';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    background: ${colors.journalAccent};
                    color: ${colors.containerBg};
                    font-family: 'Courier New', monospace;
                    font-weight: 700;
                    font-size: 11px;
                    padding: 8px 15px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    border-bottom: 1px solid ${colors.journalAccent}88;
                    z-index: 1;
                    animation: terminalFlicker 3s infinite;
                }

                /* Blinking cursor in bottom corner */
                .overview-content::after {
                    content: '█';
                    position: absolute;
                    bottom: 15px; right: 20px;
                    color: ${colors.journalAccent};
                    font-family: 'Courier New', monospace;
                    font-size: 14px;
                    font-weight: 700;
                    animation: cursorBlink 1s infinite;
                    pointer-events: none;
                    z-index: 3;
                }

                /* Terminal typography */
                .overview-content p {
                    font-family: 'Courier New', monospace;
                    font-size: 14px;
                    line-height: 1.6;
                    margin-bottom: 20px;
                    margin-top: 50px; /* Space for terminal header */
                    text-indent: 0;
                    position: relative;
                    z-index: 2;
                    color: ${colors.textContent || colors.textSecondary};
                    text-shadow: 0 0 8px ${colors.journalAccent}33;
                }

                /* Command prompt styling for first paragraph */
                .overview-content p:first-of-type {
                    font-size: 15px;
                    color: ${colors.journalAccent};
                    background: ${colors.headerBg}66;
                    padding: 15px 20px;
                    margin: 50px 0 25px 0;
                    border: 1px solid ${colors.journalAccent}66;
                    border-left: 4px solid ${colors.journalAccent};
                    position: relative;
                    z-index: 2;
                    text-shadow: 0 0 10px ${colors.journalAccent}66;
                    animation: dataLoad 2s ease-in-out;
                }

                /* Command prompt prefix */
                .overview-content p:first-of-type::before {
                    content: 'root@system:~$ cat overview.txt\\A';
                    white-space: pre;
                    display: block;
                    color: ${colors.journalAccent}cc;
                    font-weight: 700;
                    margin-bottom: 10px;
                    font-size: 12px;
                    letter-spacing: 0.5px;
                }

                /* Line numbers for other paragraphs */
                .overview-content p:not(:first-of-type)::before {
                    content: counter(line-counter, decimal-leading-zero) ' | ';
                    counter-increment: line-counter;
                    position: absolute;
                    left: -40px;
                    color: ${colors.journalAccent}66;
                    font-family: 'Courier New', monospace;
                    font-size: 11px;
                    width: 35px;
                    text-align: right;
                    font-weight: 700;
                }

                .overview-content {
                    counter-reset: line-counter;
                    padding-left: 60px; /* Space for line numbers */
                }

                /* Overview title styling */
                .overview-content h1.overview-title {
                    font-family: 'Courier New', monospace;
                    font-weight: 700;
                    color: ${colors.journalAccent};
                    margin: 50px -50px 30px -50px;
                    padding: 20px 50px;
                    background: linear-gradient(135deg, 
                        ${colors.headerBg} 0%, 
                        ${colors.journalAccent}22 100%);
                    border-top: 2px solid ${colors.journalAccent};
                    border-bottom: 2px solid ${colors.journalAccent};
                    position: relative;
                    z-index: 2;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    text-shadow: 0 0 15px ${colors.journalAccent}88;
                    text-align: center;
                }

                /* ASCII art decoration for title */
                .overview-content h1.overview-title::before {
                    content: '┌─────────────────────────────────────────┐';
                    display: block;
                    margin-bottom: 10px;
                    color: ${colors.journalAccent}88;
                    font-size: 12px;
                    letter-spacing: 0;
                }

                .overview-content h1.overview-title::after {
                    content: '└─────────────────────────────────────────┘';
                    display: block;
                    margin-top: 10px;
                    color: ${colors.journalAccent}88;
                    font-size: 12px;
                    letter-spacing: 0;
                }

                /* Content positioning */
                .overview-content .overview-image-container,
                .overview-links-container {
                    position: relative;
                    z-index: 2;
                    margin-left: -10px; /* Align with line numbers */
                }

                /* Terminal image frame */
                .overview-content .overview-image-container .overview-image {
                    border: 2px solid ${colors.journalAccent}66 !important;
                    border-radius: 0 !important;
                    box-shadow: 
                        0 0 20px ${colors.journalAccent}33,
                        inset 0 0 10px ${colors.journalAccent}11 !important;
                    filter: saturate(1.3) contrast(1.1);
                }

                @keyframes terminalFlicker {
                    0%, 94% { opacity: 1; }
                    95%, 97% { opacity: 0.8; }
                    98%, 100% { opacity: 1; }
                }

                @keyframes cursorBlink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }

                @keyframes dataLoad {
                    0% { 
                        transform: translateX(-20px);
                        opacity: 0;
                    }
                    100% { 
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
 
        default:
            return '';
    }
}

export { generateOverviewStyles };
