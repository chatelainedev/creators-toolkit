// Bundle configuration
// Add the small template files you want to combine here

module.exports = {
    // Files to combine (relative to project root)
    targetFiles: [
        '../info-converter/templates/backtotop-styles.js',
        '../info-converter/templates/color-schemes.js',
        '../info-converter/templates/font-sets.js', 
        '../info-converter/templates/titlefonts.js',
        '../info-converter/templates/button-styles.js',
        '../info-converter/templates/card-styles.js',
        // Add more template files here as needed
    ],
    
    // Where to output the combined file (can be higher up in hierarchy)
    outputDir: '../dist',
    
    // Name of the combined file
    combinedFileName: '_combined-templates.js',
    
    // Suffix for backup originals
    originalSuffix: '.original'
};