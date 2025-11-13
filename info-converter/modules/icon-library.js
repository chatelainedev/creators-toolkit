// Item Icon Library
// This file is now deprecated - icons are loaded dynamically by scanning the folder structure
// Icons should be placed in: lore-codex/images/item-icons/{category}/{filename}
// Categories are determined by folder names, icons are any .png/.jpg/.gif files within

// Legacy helper function for getIconPath - kept for compatibility
function getIconPath(category, filename) {
    return `images/item-icons/${category}/${filename}`;
}

// Make function globally available for compatibility
window.getIconPath = getIconPath;