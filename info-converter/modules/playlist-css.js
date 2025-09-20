// Playlist CSS Generation Functions
// This file contains functions to generate CSS for the playlist feature

// Main function to generate playlist CSS
function generatePlaylistCSS(colors, fonts) {
    return `
        /* Responsive grid - adjust breakpoints as needed */
        @media (max-width: 1200px) {
            .playlists-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 768px) {
            .playlists-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }
        }

        /* Playlist Header */
        .playlist-header {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .playlist-title {
            font-family: ${fonts.heading};
            font-size: 1.2em;
            font-weight: 600;
            color: ${colors.textPrimary};
            margin: 0;
            line-height: 1.3;
        }

        /* Playlist Description */
        .playlist-description {
            font-family: ${fonts.body};
            font-size: 0.9em;
            color: ${colors.textSecondary};
            line-height: 1.4;
            margin: 0;
        }

        .playlist-description p {
            margin: 0 0 8px 0;
        }

        .playlist-description p:last-child {
            margin-bottom: 0;
        }

        /* Spotify Embed Container */
        .playlist-embed {
            width: 100%;
            border-radius: 8px;
            overflow: hidden;
            background: ${colors.textMuted}10;
        }

        .playlist-embed iframe {
            border-radius: 8px;
            display: block;
        }

        /* Fallback for Invalid URLs */
        .playlist-embed-fallback {
            width: 100%;
            height: 380px;
            background: linear-gradient(135deg, ${colors.textMuted}20 0%, ${colors.textMuted}10 100%);
            border: 2px dashed ${colors.textMuted}60;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
        }

        .fallback-icon {
            font-size: 3em;
            color: ${colors.textMuted};
            margin-bottom: 16px;
        }

        .fallback-text {
            font-family: ${fonts.ui};
            font-size: 1.1em;
            font-weight: 600;
            color: ${colors.textSecondary};
            margin-bottom: 8px;
        }

        .fallback-url {
            font-family: ${fonts.ui};
            font-size: 0.8em;
            color: ${colors.textMuted};
            word-break: break-all;
            max-width: 100%;
        }


    `;
}

// Make function globally available
export { generatePlaylistCSS };