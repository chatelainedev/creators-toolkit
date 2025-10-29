// Character Import Functions - PNG/JSON Character Card Import for Character Manager
let parsedCharacterData = [];

class CharacterImporter {
    constructor() {
        this.supportedFormats = ['.json', '.png'];
    }

    // Process multiple character files
    async processCharacterFiles(files) {
        const results = [];
        
        for (const file of files) {
            try {
                const result = await this.processSingleFile(file);
                if (result) {
                    results.push(result);
                }
            } catch (error) {
                console.error(`Error processing ${file.name}:`, error);
                // Continue with other files
            }
        }
        
        return results;
    }

    // Process a single file (PNG or JSON)
    async processSingleFile(file) {
        const isImage = file.type.startsWith('image/');
        const isJson = file.type === 'application/json' || file.name.toLowerCase().endsWith('.json');

        if (!isImage && !isJson) {
            throw new Error(`Unsupported file type: ${file.name}`);
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    let characterJson;
                    
                    if (isJson) {
                        // Handle JSON files directly
                        const jsonString = e.target.result;
                        characterJson = JSON.parse(jsonString);
                    } else {
                        // Handle PNG files - extract character data only
                        const arrayBuffer = e.target.result;
                        const extractResult = this.extractCharacterDataFromPNG(arrayBuffer);
                        
                        if (!extractResult) {
                            reject(new Error('No character data found in PNG file'));
                            return;
                        }
                        
                        characterJson = extractResult.characterData;
                    }
                    
                    const parsedCharacter = this.parseCharacterJson(characterJson, file.name, null);
                    
                    if (!parsedCharacter.name) {
                        reject(new Error('Invalid character data - missing name'));
                        return;
                    }
                    
                    // Store ONLY for immediate upload, will be deleted right after
                    parsedCharacter._hasImageFile = isImage;
                    resolve({ character: parsedCharacter, file: isImage ? file : null });
                    
                    resolve(parsedCharacter);
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
            
            if (isJson) {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        });
    }

    // Add this new method to CharacterImporter class
    generateThumbnailFromArrayBuffer(arrayBuffer, maxWidth = 160, maxHeight = 200, quality = 0.8) {
        return new Promise((resolve, reject) => {
            try {
                // Convert ArrayBuffer to base64
                const base64 = this.arrayBufferToBase64(arrayBuffer);
                const imageDataUri = `data:image/png;base64,${base64}`;
                
                const img = new Image();
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        // Calculate dimensions maintaining aspect ratio
                        let { width, height } = img;
                        if (width > height) {
                            if (width > maxWidth) {
                                height = (height * maxWidth) / width;
                                width = maxWidth;
                            }
                        } else {
                            if (height > maxHeight) {
                                width = (width * maxHeight) / height;
                                height = maxHeight;
                            }
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        
                        // Draw and compress to JPEG for smaller size
                        ctx.drawImage(img, 0, 0, width, height);
                        const thumbnailDataUri = canvas.toDataURL('image/jpeg', quality);
                        resolve(thumbnailDataUri);
                    } catch (error) {
                        reject(error);
                    }
                };
                
                img.onerror = () => reject(new Error('Failed to load image for thumbnail generation'));
                img.src = imageDataUri;
                
            } catch (error) {
                reject(error);
            }
        });
    }

    // Enhanced extractCharacterDataFromPNG method with comprehensive encoding fixes
    extractCharacterDataFromPNG(arrayBuffer) {
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Check for PNG signature
        if (uint8Array[0] !== 0x89 || uint8Array[1] !== 0x50 || uint8Array[2] !== 0x4E || uint8Array[3] !== 0x47) {
            throw new Error('Not a valid PNG file');
        }
        
        let offset = 8; // Skip PNG signature
        let characterData = null;
        
        while (offset < uint8Array.length) {
            // Read chunk length (big-endian)
            const length = (uint8Array[offset] << 24) | (uint8Array[offset + 1] << 16) | 
                        (uint8Array[offset + 2] << 8) | uint8Array[offset + 3];
            offset += 4;
            
            // Read chunk type
            const type = String.fromCharCode(uint8Array[offset], uint8Array[offset + 1], 
                                        uint8Array[offset + 2], uint8Array[offset + 3]);
            offset += 4;
            
            // Handle both tEXt and iTXt chunks
            if (type === 'tEXt' || type === 'iTXt') {
                const textData = uint8Array.slice(offset, offset + length);
                let keyword, text;
                
                if (type === 'iTXt') {
                    // iTXt format supports UTF-8 natively
                    const textString = new TextDecoder('utf-8').decode(textData);
                    const parts = textString.split('\0');
                    if (parts.length >= 5) {
                        keyword = parts[0];
                        text = parts.slice(4).join('\0');
                    }
                } else {
                    // tEXt format - need to detect encoding intelligently
                    keyword = '';
                    text = '';
                    
                    // Find the null separator
                    let nullIndex = -1;
                    for (let i = 0; i < textData.length; i++) {
                        if (textData[i] === 0) {
                            nullIndex = i;
                            break;
                        }
                    }
                    
                    if (nullIndex !== -1) {
                        // Extract keyword (always ASCII)
                        keyword = new TextDecoder('ascii').decode(textData.slice(0, nullIndex));
                        
                        // Extract text part and detect encoding
                        const textBytes = textData.slice(nullIndex + 1);
                        
                        // Try multiple encoding strategies with better UTF-8 validation
                        const encodingStrategies = [
                            () => new TextDecoder('utf-8', { fatal: true }).decode(textBytes),
                            () => new TextDecoder('utf-8').decode(textBytes),
                            () => new TextDecoder('windows-1252').decode(textBytes),
                            () => new TextDecoder('iso-8859-1').decode(textBytes)
                        ];

                        for (let i = 0; i < encodingStrategies.length; i++) {
                            try {
                                text = encodingStrategies[i]();
                                
                                // For UTF-8 decodings, check for corruption markers before accepting
                                if (i < 2) { // First two are UTF-8 variants
                                    if (text.includes('â') || text.includes('ï¿½') || text.includes('\uFFFD')) {
                                        throw new Error('UTF-8 corruption detected');
                                    }
                                }
                                
                                // Test if this looks reasonable by trying to decode base64
                                if (keyword === 'chara') {
                                    const testDecode = atob(text);
                                    JSON.parse(testDecode); // Will throw if not valid JSON
                                }
                                break; // Success!
                            } catch (e) {
                                continue; // Try next encoding
                            }
                        }
                    }
                }
                
                if (keyword === 'chara' && text) {
                    try {
                        const decodedJson = new TextDecoder('utf-8').decode(
                            Uint8Array.from(atob(text), c => c.charCodeAt(0))
                        );
                        console.log('Before JSON.parse - raw JSON sample:', decodedJson.substring(0, 200));
                        characterData = JSON.parse(decodedJson);
                        break; // Found valid character data
                    } catch (e) {
                        console.error('Error decoding character data:', e);
                    }
                }
            }
            
            offset += length + 4; // Skip chunk data and CRC
        }
        
        if (!characterData) {
            return null;
        }

        // DELETE the massive avatar base64 to free memory
        if (characterData.avatar) {
            delete characterData.avatar;
        }
        if (characterData.data && characterData.data.avatar) {
            delete characterData.data.avatar;
        }

        return {
            characterData: characterData
            // No imageData - we handle the original file separately
        };
    }

    // Convert ArrayBuffer to base64
    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    // Parse character JSON data (handles both v2 and v3 formats)
    parseCharacterJson(jsonData, filename, avatarData = null) {
        const character = {
            id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            _sourceFile: filename,
            _importTimestamp: Date.now(),
            cardName: '', // User can set this later
            folderId: null, // No folder assignment by default
        };

        // Handle different character card formats
        if (jsonData.data) {
            // V3 format
            // In the V3 format section, add this after getting the data:
            const data = jsonData.data;
            character.name = data.name || '';
            character.description = data.description || '';
            console.log('parseCharacterJson - description sample for', character.name + ':', character.description.substring(0, 100));
            character.personality = data.personality || '';
            character.scenario = data.scenario || '';
            character.first_mes = data.first_mes || '';
            character.mes_example = data.mes_example || '';
            character.creator_notes = data.creator_notes || '';
            character.system_prompt = data.system_prompt || '';
            character.post_history_instructions = data.post_history_instructions || '';
            character.tags = data.tags || [];
            character.alternate_greetings = data.alternate_greetings || [];
            character.character_book = data.character_book || null;
            
            // Handle extensions
            if (data.extensions) {
                character.depth_prompt = data.extensions.depth_prompt || null;
            }
            
        } else {
            // V2 format fallback
            character.name = jsonData.name || '';
            character.description = jsonData.description || '';
            character.personality = jsonData.personality || '';
            character.scenario = jsonData.scenario || '';
            character.first_mes = jsonData.first_mes || '';
            // Add this logging right after:
            console.log('parseCharacterJson - first_mes sample:', character.first_mes.substring(0, 100));
            character.mes_example = jsonData.mes_example || '';
            character.creator_notes = jsonData.creatorcomment || '';
            character.system_prompt = '';
            character.post_history_instructions = '';
            character.tags = jsonData.tags || [];
            character.alternate_greetings = jsonData.alternate_greetings || [];
            
            // Handle character book (could be at root level in some formats)
            character.character_book = jsonData.character_book || null;
            
            // Handle depth prompt (could be at root level or in extensions)
            character.depth_prompt = jsonData.depth_prompt || 
                                    jsonData.extensions?.depth_prompt || 
                                    null;
        }

        // Initialize avatars array (will be populated during import)
        character.avatars = [];
        character.avatar = null;
        character.avatarThumbnail = null;

        // Ensure tags is an array
        if (!Array.isArray(character.tags)) {
            character.tags = [];
        }

        // Set default depth prompt if none exists
        if (!character.depth_prompt) {
            character.depth_prompt = {
                prompt: character.creator_notes || '',
                depth: 4,
                role: 'system'
            };
        }

        // Calculate total tokens for this character
        character.totalTokens = this.calculateCharacterTokens(character);

        return character;
    }

    // Calculate total token count for a character
    calculateCharacterTokens(character) {
        const fields = [
            character.description || '',
            character.personality || '',
            character.scenario || '',
            character.first_mes || '',
            character.mes_example || '',
            character.depth_prompt?.prompt || '',
            character.post_history_instructions || ''
        ];

        let totalTokens = 0;
        fields.forEach(field => {
            if (field && typeof field === 'string') {
                totalTokens += Math.ceil(field.length / 4); // Approximate token calculation
            }
        });

        return totalTokens;
    }

    // Get supported file extensions
    getSupportedExtensions() {
        return this.supportedFormats;
    }

    // Validate if a file is supported
    isFileSupported(filename) {
        const extension = '.' + filename.toLowerCase().split('.').pop();
        return this.supportedFormats.includes(extension);
    }
}

// Create global instance
const characterImporter = new CharacterImporter();

// Global functions for backward compatibility and easy access
function processCharacterFiles(files) {
    return characterImporter.processCharacterFiles(files);
}

async function processSingleCharacterFile(file) {
    const result = await characterImporter.processSingleFile(file);
    return result.character;
}

function extractCharacterDataFromPNG(arrayBuffer) {
    return characterImporter.extractCharacterDataFromPNG(arrayBuffer);
}

function parseCharacterJson(jsonData, filename, avatarData = null) {
    return characterImporter.parseCharacterJson(jsonData, filename, avatarData);
}

function calculateCharacterTokens(character) {
    return characterImporter.calculateCharacterTokens(character);
}

function isCharacterFileSupported(filename) {
    return characterImporter.isFileSupported(filename);
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CharacterImporter,
        characterImporter,
        processCharacterFiles,
        processSingleCharacterFile,
        extractCharacterDataFromPNG,
        parseCharacterJson,
        calculateCharacterTokens,
        isCharacterFileSupported
    };
}

// Make available globally
window.CharacterImporter = CharacterImporter;
window.characterImporter = characterImporter;
window.processCharacterFiles = processCharacterFiles;
window.processSingleCharacterFile = processSingleCharacterFile;
window.extractCharacterDataFromPNG = extractCharacterDataFromPNG;
window.parseCharacterJson = parseCharacterJson;
window.calculateCharacterTokens = calculateCharacterTokens;
window.isCharacterFileSupported = isCharacterFileSupported;