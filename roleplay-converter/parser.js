// Function to parse basic markdown
function parseMarkdown(text) {
    if (!text) return '';
    
    // Make a copy to avoid modifying the original
    let parsed = text.toString();

    // Convert various dash patterns to em dashes
    // Handle spaced dash first (most specific)
    parsed = parsed.replace(/ - /g, ' — ');

    // Handle double dash
    parsed = parsed.replace(/--/g, '—');
    
    // Process headings first (convert to bold since we don't want actual heading tags in roleplay text)
    // # Heading -> <strong>Heading</strong>
    parsed = parsed.replace(/^# (.+)$/gm, '<strong>$1</strong>');
    // ## Heading -> <strong>Heading</strong> (same as #, just bold)
    parsed = parsed.replace(/^## (.+)$/gm, '<strong>$1</strong>');
    // ### Heading -> <strong>Heading</strong>
    parsed = parsed.replace(/^### (.+)$/gm, '<strong>$1</strong>');
    // #### and beyond -> just bold
    parsed = parsed.replace(/^#{4,} (.+)$/gm, '<strong>$1</strong>');
    
    // Process other markdown elements that we haven't handled yet
    
    // Horizontal rules -> em dash (since HR tags might not work well in roleplay)
    //parsed = parsed.replace(/^---+$/gm, '—————————————');
    //parsed = parsed.replace(/^\*\*\*+$/gm, '—————————————');
    
    // Code blocks (convert to italics for subtle formatting)
    // Single backticks `code` -> <em>code</em>
    parsed = parsed.replace(/`([^`]+)`/g, '<em>$1</em>');
    
    // Triple backticks (code blocks) -> preserve as is but in italics
    parsed = parsed.replace(/```[\s\S]*?```/g, function(match) {
        const codeContent = match.replace(/```/g, '').trim();
        return '<em>' + codeContent + '</em>';
    });
    
    // Bold (keep our existing logic)
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    parsed = parsed.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic (keep our existing logic)
    parsed = parsed.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    parsed = parsed.replace(/_([^_]+)_/g, '<em>$1</em>');
    
    // Strikethrough (keep our existing logic)
    parsed = parsed.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // Blockquotes -> use italics with a visual indicator
    parsed = parsed.replace(/^> (.+)$/gm, '<em>"$1"</em>');
    
    // Lists - convert to simple text with bullets
    // Unordered lists
    parsed = parsed.replace(/^\* (.+)$/gm, '• $1');
    parsed = parsed.replace(/^- (.+)$/gm, '• $1');
    parsed = parsed.replace(/^\+ (.+)$/gm, '• $1');
    
    // Ordered lists (convert to simple numbered format)
    parsed = parsed.replace(/^\d+\. (.+)$/gm, function(match, content, offset, string) {
        // Count how many numbered items we've seen so far
        const beforeThis = string.substring(0, offset);
        const numberedItems = (beforeThis.match(/^\d+\. /gm) || []).length;
        return `${numberedItems + 1}. ${content}`;
    });
    
    // Links - convert to just the link text with the URL in parentheses
    parsed = parsed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');
    
    // Images - convert to just the alt text with a note
    parsed = parsed.replace(/!\[([^\]]*)\]\([^)]+\)/g, '[Image: $1]');
    
    // Find dialogue (text in quotes) and wrap with dialogue class (keep our existing logic)
    // This looks for text between double quotes and wraps it with a span
    parsed = parsed.replace(/"([^"]+)"/g, '<span class="dialogue">"$1"</span>');
    
    return parsed;
}

// Helper function to convert character name to valid CSS class
function getCharacterCSSClass(characterName) {
    // Convert to lowercase and replace spaces and special characters with hyphens
    return characterName.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')  // Replace any non-alphanumeric character with hyphen
        .replace(/-+/g, '-')         // Replace multiple consecutive hyphens with single hyphen
        .replace(/^-|-$/g, '');      // Remove leading/trailing hyphens
}

// Helper function to create CSS class for character
function createCharClass(character, characterData) {
    const charInfo = characterData.find(c => c.name.toLowerCase() === character.toLowerCase());
    if (charInfo) {
        const cssClass = getCharacterCSSClass(charInfo.name);
        return 'character-name ' + cssClass;
    }
    return 'character-name';
}

// Function to count words in text
function countWords(text) {
    if (!text) return 0;
    
    // Make a copy of the text
    let processedText = text.toString();
    
    // Ensure we have consistent line breaks
    processedText = processedText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Remove HTML tags
    processedText = processedText.replace(/<[^>]+>/g, ' ');
    
    // Remove special markers
    processedText = processedText.replace(/&&&PART&&&/g, ' ');
    
    // Process the text line by line to better handle character names
    const lines = processedText.split('\n');
    let cleanedText = '';
    
    for (let line of lines) {
        // Check if line starts with a character name (something followed by a colon)
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            // Keep only the part after the colon
            cleanedText += ' ' + line.substring(colonIndex + 1);
        } else {
            cleanedText += ' ' + line;
        }
    }
    
    // Remove markdown syntax
    cleanedText = cleanedText.replace(/\*\*(.*?)\*\*/g, '$1'); // Bold
    cleanedText = cleanedText.replace(/\*(.*?)\*/g, '$1');     // Italic
    cleanedText = cleanedText.replace(/~~(.*?)~~/g, '$1');     // Strikethrough
    cleanedText = cleanedText.replace(/__(.*?)__/g, '$1');     // Underscore bold
    
    // Normalize whitespace (replace all whitespace with single spaces)
    cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
    
    // Split by space and filter out empty strings
    const words = cleanedText.split(' ').filter(word => word.length > 0);
    
    return words.length;
}

// Function to calculate page count (based on 275 words per page)
function calculatePageCount(wordCount) {
    return Math.ceil(wordCount / 275);
}

// Function to parse roleplay text into structured data
function parseRoleplayText(text, characterData) {
    const lines = text.split('\n');
    const entries = [];
    let currentEntry = null;
    let currentParagraph = '';
    let partIndex = 0;
    
    // Check if we should use part markers
    const usePartMarkers = document.getElementById('use-part-markers').checked;
    const noCharacters = document.getElementById('no-characters').checked;
    
    // Special marker for parts
    const PART_MARKER = '&&&PART&&&';
    
    // If no characters mode is enabled, treat all text as one big entry
    if (noCharacters) {
        let fullText = '';
        let hasPartBreaks = false;
        
        // Process line by line to handle part markers
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check for part marker - only if part markers are enabled
            if (usePartMarkers && line === PART_MARKER) {
                // If we have accumulated text, create an entry
                if (fullText.trim() !== '') {
                    const paragraphs = fullText.trim().split(/\n\s*\n/).filter(p => p.trim() !== '');
                    entries.push({
                        type: 'character',
                        character: 'Narrator', // Use a default name for processing
                        paragraphs: paragraphs
                    });
                    fullText = '';
                }
                
                // Add part break if not the first one
                if (partIndex > 0 || entries.length > 0) {
                    partIndex++;
                    entries.push({ type: 'partBreak', partIndex });
                }
                hasPartBreaks = true;
                continue;
            }
            
            // Accumulate all other text
            fullText += line + '\n';
        }
        
        // Add the final text if there is any
        if (fullText.trim() !== '') {
            const paragraphs = fullText.trim().split(/\n\s*\n/).filter(p => p.trim() !== '');
            entries.push({
                type: 'character',
                character: 'Narrator', // Use a default name for processing
                paragraphs: paragraphs
            });
        }
        
        return entries;
    }
    
    // Original character-based parsing
    // Create regex patterns for each character
    const characterPatterns = characterData.map(char => ({
        name: char.name,
        pattern: new RegExp(`^${char.name}\\s*:`, 'i')
    }));
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check for part marker - only if part markers are enabled
        if (usePartMarkers && line === PART_MARKER) {
            if (currentEntry) {
                if (currentParagraph.trim() !== '') {
                    currentEntry.paragraphs.push(currentParagraph.trim());
                    currentParagraph = '';
                }
                entries.push(currentEntry);
                currentEntry = null;
            }
            
            // Add a part break - only if not the first one (we already start with part 1)
            if (partIndex > 0 || entries.length > 0) {
                partIndex++;
                entries.push({ type: 'partBreak', partIndex });
            }
            continue;
        }
        
        // Check for character line
        let foundCharacter = null;
        
        for (const { name, pattern } of characterPatterns) {
            if (pattern.test(line)) {
                foundCharacter = name;
                break;
            }
        }
        
        if (foundCharacter) {
            // If we were working on another entry, save it
            if (currentEntry && currentParagraph.trim() !== '') {
                currentEntry.paragraphs.push(currentParagraph.trim());
                currentParagraph = '';
            }
            
            // If we had a current entry, save it
            if (currentEntry) {
                entries.push(currentEntry);
            }
            
            // Start a new entry
            const contentStart = line.indexOf(':') + 1;
            const content = line.substring(contentStart).trim();
            
            currentEntry = {
                type: 'character',
                character: foundCharacter,
                paragraphs: []
            };
            
            if (content) {
                currentParagraph = content;
            }
        } 
        // Empty line means end of paragraph
        else if (line === '' && currentParagraph.trim() !== '') {
            if (currentEntry) {
                currentEntry.paragraphs.push(currentParagraph.trim());
                currentParagraph = '';
            }
        }
        // Continue building current paragraph
        else if (currentEntry) {
            if (currentParagraph) {
                currentParagraph += ' ' + line;
            } else {
                currentParagraph = line;
            }
        }
    }
    
    // Add the final paragraph and entry if there is one
    if (currentEntry) {
        if (currentParagraph.trim() !== '') {
            currentEntry.paragraphs.push(currentParagraph.trim());
        }
        entries.push(currentEntry);
    }
    
    return entries;
}

function containsHTML(text) {
    return /<[a-z][\s\S]*>/i.test(text);
}