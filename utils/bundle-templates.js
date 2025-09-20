#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load configuration
let config;
try {
    config = require('./bundle.config.js');
} catch (error) {
    console.error('❌ Could not load bundle.config.js');
    console.error('   Make sure bundle.config.js exists in the project root');
    process.exit(1);
}

class TemplateBundler {
    constructor(bundleConfig) {
        this.config = {
            targetFiles: [],
            outputDir: 'templates',
            combinedFileName: '_combined-templates.js',
            originalSuffix: '.original',
            ...bundleConfig
        };
        this.isBundled = false;
    }

    // Convert filename to valid JavaScript identifier
    sanitizeIdentifier(fileName) {
        return fileName.replace(/[^a-zA-Z0-9_$]/g, '_');
    }

    // Check if we're currently in bundled mode
    checkBundledState() {
        const combinedPath = path.join(this.config.outputDir, this.config.combinedFileName);
        this.isBundled = fs.existsSync(combinedPath);
        return this.isBundled;
    }

    // Read and parse a JS file to extract its exports
    parseJSFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath, '.js');
        const safeIdentifier = this.sanitizeIdentifier(fileName);
        
        // Check for export default pattern
        const hasDefaultExport = /export\s+default\s+/.test(content);
        
        return {
            fileName: fileName,
            safeIdentifier: safeIdentifier,
            content: content,
            hasDefaultExport: hasDefaultExport,
            originalPath: filePath
        };
    }

    // Combine all target files into one big file
    combineFiles() {
        console.log('🔄 Combining template files...');
        
        let combinedContent = '// Auto-generated combined templates file\n';
        combinedContent += '// Generated at: ' + new Date().toISOString() + '\n\n';
        
        const exportMap = new Map();

        for (let i = 0; i < this.config.targetFiles.length; i++) {
            const filePath = this.config.targetFiles[i];
            
            if (!fs.existsSync(filePath)) {
                console.warn('⚠️  File not found: ' + filePath);
                continue;
            }

            const parsed = this.parseJSFile(filePath);
            console.log('   📁 Processing: ' + parsed.fileName + ' -> ' + parsed.safeIdentifier);

            // Remove export statements from content
            let fileContent = parsed.content;
            
            if (parsed.hasDefaultExport) {
                // Remove the export default line and capture what's being exported
                const exportMatch = fileContent.match(/export\s+default\s+(\w+)/);
                if (exportMatch) {
                    const exportedName = exportMatch[1];
                    fileContent = fileContent.replace(/export\s+default\s+\w+/, '');
                    
                    // Store mapping for re-export
                    exportMap.set(parsed.fileName, {
                        safeIdentifier: parsed.safeIdentifier,
                        exportedName: exportedName,
                        type: 'default'
                    });
                }
            }

            combinedContent += '// === ' + parsed.fileName + '.js ===\n';
            combinedContent += fileContent + '\n\n';
        }

        // Add re-export section at the end
        combinedContent += '// === RE-EXPORTS ===\n';
        for (const [fileName, exportInfo] of exportMap) {
            combinedContent += 'export { ' + exportInfo.exportedName + ' as ' + exportInfo.safeIdentifier + '_default };\n';
        }

        // Write combined file
        const outputPath = path.join(this.config.outputDir, this.config.combinedFileName);
        
        // Make sure output directory exists
        if (!fs.existsSync(this.config.outputDir)) {
            fs.mkdirSync(this.config.outputDir, { recursive: true });
        }
        
        fs.writeFileSync(outputPath, combinedContent);
        console.log('✅ Combined file created: ' + outputPath);
        console.log('   📊 Size: ' + (combinedContent.length / 1024).toFixed(1) + ' KB');

        return exportMap;
    }

    // Create proxy files that re-export from the combined file
    createProxyFiles(exportMap) {
        console.log('🔄 Creating proxy files...');

        for (let i = 0; i < this.config.targetFiles.length; i++) {
            const filePath = this.config.targetFiles[i];
            
            if (!fs.existsSync(filePath)) {
                continue;
            }

            const fileName = path.basename(filePath, '.js');
            const fileDir = path.dirname(filePath);
            const combinedFilePath = path.join(this.config.outputDir, this.config.combinedFileName);
            
            // Calculate relative path from proxy file to combined file
            const relativePath = path.relative(fileDir, combinedFilePath).replace(/\\/g, '/');
            
            console.log('   📄 ' + fileName + '.js -> ' + relativePath);
            
            // Create proxy content
            let proxyContent = '// Auto-generated proxy file for ' + fileName + '.js\n';
            proxyContent += '// Points to: ' + relativePath + '\n\n';
            
            const exportInfo = exportMap.get(fileName);
            if (exportInfo && exportInfo.type === 'default') {
                proxyContent += 'export { ' + exportInfo.safeIdentifier + '_default as default } from \'' + relativePath + '\';\n';
            } else {
                // Fallback - just re-export everything (this shouldn't happen but provides safety)
                proxyContent += 'export * from \'' + relativePath + '\';\n';
            }

            // Write proxy file with .proxy extension first
            const proxyPath = filePath + '.proxy';
            fs.writeFileSync(proxyPath, proxyContent);
        }
        
        console.log('✅ Proxy files created');
    }

    // Rename files to switch between original and proxy versions
    switchToBundle() {
        console.log('🔄 Switching to bundled mode...');
        
        for (let i = 0; i < this.config.targetFiles.length; i++) {
            const filePath = this.config.targetFiles[i];
            
            if (!fs.existsSync(filePath)) {
                continue;
            }

            const originalBackup = filePath + this.config.originalSuffix;
            const proxyFile = filePath + '.proxy';
            
            // Backup original
            if (fs.existsSync(filePath)) {
                fs.renameSync(filePath, originalBackup);
            }
            
            // Move proxy to original location
            if (fs.existsSync(proxyFile)) {
                fs.renameSync(proxyFile, filePath);
            }
        }
        
        console.log('✅ Switched to bundled mode');
    }

    switchToDevelopment() {
        console.log('🔄 Switching to development mode...');
        
        for (let i = 0; i < this.config.targetFiles.length; i++) {
            const filePath = this.config.targetFiles[i];
            const originalBackup = filePath + this.config.originalSuffix;
            
            // Remove proxy (current file)
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            
            // Restore original
            if (fs.existsSync(originalBackup)) {
                fs.renameSync(originalBackup, filePath);
            }
        }

        // Clean up combined file
        const combinedPath = path.join(this.config.outputDir, this.config.combinedFileName);
        if (fs.existsSync(combinedPath)) {
            fs.unlinkSync(combinedPath);
        }
        
        console.log('✅ Switched to development mode');
    }

    bundle() {
        if (this.checkBundledState()) {
            console.log('⚠️  Already in bundled mode. Run with --dev to switch back.');
            return;
        }

        const exportMap = this.combineFiles();
        this.createProxyFiles(exportMap);
        this.switchToBundle();
        console.log('🎉 Bundling complete!');
    }

    unbundle() {
        if (!this.checkBundledState()) {
            console.log('⚠️  Already in development mode.');
            return;
        }

        this.switchToDevelopment();
        console.log('🎉 Switched back to development mode!');
    }

    debug() {
        console.log('🐛 DEBUG MODE\n');
        
        console.log('Configuration:');
        console.log('  Target files:', this.config.targetFiles);
        console.log('  Output dir:', this.config.outputDir);
        console.log('  Combined file:', this.config.combinedFileName);
        console.log('');
        
        console.log('File analysis:');
        for (let i = 0; i < this.config.targetFiles.length; i++) {
            const filePath = this.config.targetFiles[i];
            
            if (fs.existsSync(filePath)) {
                const parsed = this.parseJSFile(filePath);
                console.log('  📁 ' + parsed.fileName);
                console.log('     Safe identifier: ' + parsed.safeIdentifier);
                console.log('     Has default export: ' + parsed.hasDefaultExport);
                console.log('     File size: ' + (parsed.content.length / 1024).toFixed(1) + ' KB');
                
                // Show first few lines
                const preview = parsed.content.split('\n').slice(0, 3).join('\\n');
                console.log('     Preview: ' + preview.substring(0, 100) + '...');
                console.log('');
            } else {
                console.log('  ❌ ' + filePath + ' (not found)');
            }
        }
        
        // Test path generation
        console.log('Path generation test:');
        if (this.config.targetFiles.length > 0) {
            const testFile = this.config.targetFiles[0];
            const fileDir = path.dirname(testFile);
            const combinedFilePath = path.join(this.config.outputDir, this.config.combinedFileName);
            const relativePath = path.relative(fileDir, combinedFilePath);
            
            console.log('  From: ' + fileDir);
            console.log('  To: ' + combinedFilePath);
            console.log('  Relative: ' + relativePath);
        }
    }

    status() {
        const bundled = this.checkBundledState();
        console.log('Current mode: ' + (bundled ? '📦 BUNDLED' : '🛠️  DEVELOPMENT'));
        
        console.log('\nTarget files:');
        for (let i = 0; i < this.config.targetFiles.length; i++) {
            const filePath = this.config.targetFiles[i];
            const exists = fs.existsSync(filePath);
            const hasBackup = fs.existsSync(filePath + this.config.originalSuffix);
            const isProxy = exists && hasBackup; // If both exist, current file is probably proxy
            
            const statusText = isProxy ? '(proxy)' : hasBackup ? '(has backup)' : '(original)';
            console.log('  ' + (exists ? '✅' : '❌') + ' ' + filePath + ' ' + statusText);
            
            // Show proxy content if in bundled mode and file exists
            if (bundled && exists && isProxy) {
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    const lines = content.split('\n').slice(0, 5); // First 5 lines
                    console.log('      Content preview: ' + lines.join(' ').substring(0, 100) + '...');
                } catch (e) {
                    console.log('      ⚠️ Could not read proxy content: ' + e.message);
                }
            }
        }
        
        // Show combined file info if it exists
        const combinedPath = path.join(this.config.outputDir, this.config.combinedFileName);
        if (fs.existsSync(combinedPath)) {
            const stats = fs.statSync(combinedPath);
            console.log('\n📦 Combined file: ' + combinedPath + ' (' + (stats.size / 1024).toFixed(1) + ' KB)');
        }
    }
}

const bundler = new TemplateBundler(config);

// Command line interface
const args = process.argv.slice(2);
const command = args[0] || 'bundle';

if (command === 'bundle' || command === '--bundle') {
    bundler.bundle();
} else if (command === 'dev' || command === '--dev') {
    bundler.unbundle();
} else if (command === 'status' || command === '--status') {
    bundler.status();
} else if (command === 'debug' || command === '--debug') {
    bundler.debug();
} else {
    console.log('\n📦 Template Bundler\n');
    console.log('Usage: node bundle-templates.js [command]\n');
    console.log('Commands:');
    console.log('  bundle    Combine templates and switch to bundled mode (default)');
    console.log('  dev       Switch back to development mode');
    console.log('  status    Show current bundling status');
    console.log('  debug     Show detailed debug information\n');
    console.log('Examples:');
    console.log('  node bundle-templates.js           # Bundle templates');
    console.log('  node bundle-templates.js dev       # Switch to development mode');
    console.log('  node bundle-templates.js status    # Check current status');
    console.log('  node bundle-templates.js debug     # Debug configuration');
}