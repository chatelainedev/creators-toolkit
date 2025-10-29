// Initialize HEX code copy/paste functionality
// Initialize HEX code copy/paste functionality
function initializeHexCopyPaste() {
    console.log('🎨 Initializing HEX copy/paste functionality...');
    
    // Get context menu elements
    const colorContextMenu = document.getElementById('color-picker-context-menu');
    const hexInput = document.getElementById('color-hex-input');
    let currentColorPicker = null;

    console.log('Context menu found:', !!colorContextMenu);
    console.log('Hex input found:', !!hexInput);

    if (!colorContextMenu || !hexInput) {
        console.error('❌ Required elements not found');
        return;
    }

    // Right-click color picker to show context menu
    document.addEventListener('contextmenu', (e) => {
        console.log('Right click detected on:', e.target.tagName, e.target.type);
        
        if (e.target.type === 'color') {
            console.log('✅ Color picker right-clicked!', e.target.id);
            e.preventDefault();
            currentColorPicker = e.target;
            
            // Set current hex value in input
            hexInput.value = e.target.value;
            
            // Position menu - EXACTLY like Lore Codex
            colorContextMenu.style.left = e.pageX + 'px';
            colorContextMenu.style.top = e.pageY + 'px';
            colorContextMenu.style.display = 'block';
            
            // Focus and select the hex input
            setTimeout(() => {
                hexInput.focus();
                hexInput.select();
            }, 10);
        }
    });

    // Apply hex color
    const applyBtn = document.getElementById('apply-hex-color');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            console.log('Apply button clicked');
            if (currentColorPicker && hexInput.value) {
                const hexValue = hexInput.value.trim();
                // Add # if missing
                const validHex = hexValue.startsWith('#') ? hexValue : '#' + hexValue;
                
                if (isValidHexColor(validHex)) {
                    currentColorPicker.value = validHex;
                    
                    // Find corresponding text input and update it
                    const textInput = document.querySelector(`input[type="text"][id="${currentColorPicker.id.replace('-picker', '')}"]`);
                    if (textInput) {
                        textInput.value = validHex;
                    }
                    
                    // Trigger events to update any listeners
                    currentColorPicker.dispatchEvent(new Event('input'));
                    currentColorPicker.dispatchEvent(new Event('change'));
                }
            }
            colorContextMenu.style.display = 'none';
        });
    }
    
    // Apply on Enter key
    hexInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('apply-hex-color').click();
        }
    });
    
    // Hide menu when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!colorContextMenu.contains(e.target)) {
            colorContextMenu.style.display = 'none';
        }
    });

    // Double-click color picker to copy hex value
    let colorPickerClicks = new Map();

    document.addEventListener('mousedown', (e) => {
        if (e.target.type === 'color') {
            console.log('Mouse down on color picker:', e.target.id);
            const now = Date.now();
            const lastClick = colorPickerClicks.get(e.target) || 0;
            
            if (now - lastClick < 400) { // Double-click detected
                console.log('🎯 Double-click detected!');
                // Prevent the color picker from opening
                e.target.style.pointerEvents = 'none';
                e.preventDefault();
                e.stopPropagation();
                
                // Copy the hex value
                const hexValue = e.target.value;
                
                // Add visual feedback
                e.target.classList.add('copied');
                setTimeout(() => e.target.classList.remove('copied'), 300);
                
                // Copy to clipboard
                copyToClipboard(hexValue);
                
                // Re-enable pointer events after a short delay
                setTimeout(() => {
                    e.target.style.pointerEvents = 'auto';
                }, 500);
            } else {
                colorPickerClicks.set(e.target, now);
            }
        }
    });

    console.log('✅ HEX copy/paste functionality initialized');
}

// Toast notification function
function showToast(type, message, duration = 3000) {
    console.log(`📢 Showing toast: ${type} - ${message}`);
    const container = createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Create toast container if it doesn't exist
function createToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
        console.log('✅ Created toast container');
    }
    return container;
}

// Copy to clipboard utility
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('success', `Copied ${text} to clipboard`, 2000);
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

// Fallback copy method
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showToast('success', `Copied ${text} to clipboard`, 2000);
}

// Utility function to validate hex colors
function isValidHexColor(color) {
    return /^#[0-9A-Fa-f]{3,6}$/.test(color);
}

window.initializeHexCopyPaste = initializeHexCopyPaste;
// Make functions globally available
window.showToast = showToast;
window.createToastContainer = createToastContainer;
window.copyToClipboard = copyToClipboard;