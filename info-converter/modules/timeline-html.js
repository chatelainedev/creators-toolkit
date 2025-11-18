// Timeline HTML Generation Functions
// Helper function to get time system by ID (needed for timeline)
function getTimeSystemById(id) {
    if (id === 'default') {
        return window.DEFAULT_CALENDAR;
    }
    
    // ADD THIS:
    if (id === 'preset-chinese') {
        return window.PRESET_CHINESE_CALENDAR;
    }
    
    // Fallback to user-created time systems
    const systems = window.userTimeSystems || [];
    return systems.find(ts => ts.id === id) || null;
}
//GENERATING
// Generate the new timeline view with NAMESPACED classes
function generateTimelineView(data) {
    // Collect all events from all plans with timing data
    const allEvents = collectAllEventsWithTiming(data.plans);
    
    if (allEvents.length === 0) {
        return `
            <div class="tl-timeline-empty">
                <h3>No Timed Events</h3>
                <p>No events with timing information found. Add timing details (like "Month 3, Year 300") to your events to see them in the timeline.</p>
            </div>`;
    }
    
    // FIXED: Pass both allEvents AND plans to get plan-level tags
    const { uniqueTags, yearRange } = collectTimelineFilterData(allEvents, data.plans);
    
    let timelineHTML = '';
    
    // Add timeline navigation
    timelineHTML += generateTimelineNavigation(uniqueTags, yearRange);
    
    // Generate both chronological and arc timeline views
    timelineHTML += generateChronologicalTimeline(allEvents);
    
    return timelineHTML;
}

// Generate the chronological timeline with month grouping
function generateChronologicalTimeline(allEvents) {
    // Get the selected time system
    const selectedTimeSystemId = infoData.plansOptions?.selectedTimeSystemId || 'default';
    const timeSystem = getTimeSystemById(selectedTimeSystemId);
    
    // Group events by year
    const eventsByYear = groupEventsByYear(allEvents);
    
    let chronoHTML = '<div class="tl-timeline-container tl-chronological-view" id="tl-chronological-container">';
    
    // Generate each year section
    Object.keys(eventsByYear).sort((a, b) => parseInt(a) - parseInt(b)).forEach(year => {
        // Group events within this year by month
        const eventsByMonth = {};
        eventsByYear[year].forEach(event => {
            const month = event.parsedTiming.month !== null ? event.parsedTiming.month : -1;
            if (!eventsByMonth[month]) {
                eventsByMonth[month] = [];
            }
            eventsByMonth[month].push(event);
        });
        
        chronoHTML += `
            <div class="tl-timeline-year" data-year="${year}">
                <div class="tl-year-label">
                    <h3>Year ${year}</h3>
                </div>
                <div class="tl-timeline-events">`;
        
        // Track which side we're on (start with left)
        let currentSide = 'left';
        
        // Sort months and generate events for each month
        Object.keys(eventsByMonth).sort((a, b) => parseInt(a) - parseInt(b)).forEach(monthIndex => {
            const monthNum = parseInt(monthIndex);
            
            // Add month label if we have a valid month and time system
            if (monthNum >= 0 && timeSystem && timeSystem.months && timeSystem.months[monthNum]) {
                chronoHTML += `<div class="tl-month-label">${timeSystem.months[monthNum].name}</div>`;
            } else if (monthNum === -1) {
                chronoHTML += `<div class="tl-month-label tl-no-month">Unspecified Month</div>`;
            }
            
            // Generate events for this month, passing and receiving the current side
            const result = generateYearEventsWithSide(eventsByMonth[monthNum], currentSide);
            chronoHTML += result.html;
            currentSide = result.endSide;
        });
        
        chronoHTML += `
                </div>
            </div>`;
    });
    
    chronoHTML += '</div>';
    return chronoHTML;
}

// Generate node color based on character tags
function generateCharacterBasedColor(characterTags, fallbackColor) {
    if (!characterTags || characterTags.length === 0) {
        return fallbackColor;
    }
    
    // Get visible character tags and their colors
    const visibleTags = getVisibleTags(characterTags);
    const characterColors = visibleTags.map(tag => getCharacterColor(tag)).filter(color => color !== '#6c757d');
    
    if (characterColors.length === 0) {
        return fallbackColor;
    }
    
    if (characterColors.length === 1) {
        return characterColors[0];
    }
    
    // Mix multiple character colors by averaging HSL values
    return mixCharacterColors(characterColors);
}

// Helper function to get CSS variable value
function getCSSVariableValue(variableName) {
    const computedStyle = getComputedStyle(document.documentElement);
    return computedStyle.getPropertyValue(variableName).trim();
}
// Helper to expand yearly events into multiple instances
function expandYearlyEvents(events, yearsWithEvents) {
    const expandedEvents = [];
    
    events.forEach(event => {
        if (!event.yearly || !event.parsedTiming || event.parsedTiming.year === null) {
            expandedEvents.push(event);
            return;
        }
        
        const startYear = event.parsedTiming.year;
        const endYear = event.yearlyPerennial ? 
            Math.max(...yearsWithEvents) : 
            startYear + (event.yearlyDuration || 1) - 1;
        
        // Only create instances for years that have other (non-yearly) events
        yearsWithEvents.forEach(targetYear => {
            if (targetYear >= startYear && targetYear <= endYear) {
                const instance = { 
                    ...event, 
                    parsedTiming: { 
                        ...event.parsedTiming, 
                        year: targetYear 
                    },
                    isYearlyInstance: true,
                    originalYear: startYear
                };
                expandedEvents.push(instance);
            }
        });
    });
    
    return expandedEvents;
}

function collectAllEventsWithTiming(plans) {
    const allEvents = [];
    const regularEvents = []; // Non-yearly events
    const yearlyEvents = []; // Yearly events to expand
    
    plans.forEach(plan => {
        // Collect main arc events
        if (plan.events && Array.isArray(plan.events)) {
            plan.events.forEach(event => {
                const parsed = parseTiming(event.timing);
                if (parsed) {
                    // --- FIX 1 START ---
                    // Create a single 'arcTitle' property instead of 'planTitle'
                    const eventWithParsing = { ...event, parsedTiming: parsed, arcTitle: plan.title };
                    // --- FIX 1 END ---
                    if (event.yearly) {
                        yearlyEvents.push(eventWithParsing);
                    } else {
                        regularEvents.push(eventWithParsing);
                    }
                }
            });
        }
        
        // Collect sub-arc events
        if (plan.subArcs && Array.isArray(plan.subArcs)) {
            plan.subArcs.forEach(subArc => {
                if (subArc.events && Array.isArray(subArc.events)) {
                    subArc.events.forEach(event => {
                        const parsed = parseTiming(event.timing);
                        if (parsed) {
                            // --- FIX 2 START ---
                            // Create a combined 'arcTitle' property with the correct arrow separator
                            const eventWithParsing = { 
                                ...event, 
                                parsedTiming: parsed, 
                                arcTitle: `${plan.title} → ${subArc.title}` // Use the actual arrow character with spaces
                            };
                            // --- FIX 2 END ---
                            if (event.yearly) {
                                yearlyEvents.push(eventWithParsing);
                            } else {
                                regularEvents.push(eventWithParsing);
                            }
                        }
                    });
                }
            });
        }
    });
    
    // Get years that have regular events
    const yearsWithEvents = [...new Set(regularEvents.map(e => e.parsedTiming.year))];
    
    // Expand yearly events only for those years
    const expandedYearlyEvents = expandYearlyEvents(yearlyEvents, yearsWithEvents);
    
    return [...regularEvents, ...expandedYearlyEvents];
}

// FIXED: collectTimelineFilterData function in timeline-html.js
// Change this function to collect from plan.tags instead of plan.characterTags
function collectTimelineFilterData(allEvents, plans) {
    const uniqueTags = new Set();
    let minYear = Infinity;
    let maxYear = -Infinity;
    
    // Collect VISIBLE tags from plan-level filter tags (plan.tags) 
    if (plans && Array.isArray(plans)) {
        plans.forEach(plan => {
            if (plan.tags && Array.isArray(plan.tags)) {
                const visibleTags = getVisibleTags(plan.tags);
                visibleTags.forEach(tag => {
                    if (tag && tag.trim()) {
                        uniqueTags.add(tag.trim());
                    }
                });
            }
        });
    }
    
    // Still collect year range from events
    allEvents.forEach(event => {
        if (event.parsedTiming.year !== null) {
            minYear = Math.min(minYear, event.parsedTiming.year);
            maxYear = Math.max(maxYear, event.parsedTiming.year);
        }
    });
    
    // Handle case where no years are found
    if (minYear === Infinity) {
        minYear = null;
        maxYear = null;
    }
    
    return {
        uniqueTags: Array.from(uniqueTags).sort(),
        yearRange: { min: minYear, max: maxYear }
    };
}


// FIXED: Generate timeline navigation with proper arrow character and theme colors
function generateTimelineNavigation(uniqueTags, yearRange) {
    let navHTML = `
        <div class="timeline-navigation" id="timeline-nav">
            <div class="timeline-nav-header" onclick="toggleTimelineNavigation()">
                <span class="timeline-nav-title">Filter Timeline</span>
                <span class="timeline-nav-toggle">&#9654;</span>
            </div>
            <div class="timeline-nav-content collapsed">
                <div class="timeline-filter-controls">
                    <input type="text" class="timeline-search" id="timeline-search" placeholder="Search events...">
                    <div class="timeline-filter-mode-buttons">
                        <button class="timeline-filter-mode-option active" id="timeline-filter-mode-any" onclick="setTimelineFilterMode('any')">Any</button>
                        <button class="timeline-filter-mode-option" id="timeline-filter-mode-all" onclick="setTimelineFilterMode('all')">All</button>
                    </div>
                    <button class="timeline-clear-selected-btn" id="timeline-clear-selected-btn" onclick="clearAllTimelineTags()">Clear</button>
                </div>`;

    // Character tags section - only show visible tags
    if (uniqueTags.length > 0) {
        navHTML += '<div class="timeline-tag-links">';
        
        uniqueTags.forEach(tag => {
            const parsed = parseTagWithColor(tag);
            let styleAttr = '';
            if (parsed.bgColor) {
                const textColor = parsed.textColor || getContrastingTextColor(parsed.bgColor);
                const hoverColor = parsed.hoverColor || parsed.bgColor;
                styleAttr = ` style="background-color: ${parsed.bgColor}; color: ${textColor}; --hover-color: ${hoverColor};"`;
            }
            const escapedTag = tag.replace(/\\\\/g, '\\\\\\\\').replace(/'/g, "\\\\'");
            navHTML += `<div class="timeline-tag-link" onclick="toggleTimelineTag('${escapedTag}')"${styleAttr}>${parsed.name}</div>`;
        });
        
        navHTML += '</div>';
    }

    // Year range section
    if (yearRange.min !== null && yearRange.max !== null) {
        navHTML += `
                <div class="timeline-year-range">
                    <label>From: <input type="number" class="timeline-year-input" id="timeline-year-from" min="${yearRange.min}" max="${yearRange.max}" placeholder="${yearRange.min}"></label>
                    <label>To: <input type="number" class="timeline-year-input" id="timeline-year-to" min="${yearRange.min}" max="${yearRange.max}" placeholder="${yearRange.max}"></label>
                </div>`;
    }

    navHTML += `
            </div>
        </div>`;
    
    return navHTML;
}

// Parse timing string (Hour X, Day Y, Month Z, Year W)
// Parse timing - handles both NEW object format and LEGACY string format
function parseTiming(timing) {
    // NEW FORMAT: Object with date/time/timeSystemId
    if (timing && typeof timing === 'object' && timing.date) {
        const timeSystem = getTimeSystemById(timing.timeSystemId || 'default');
        
        const result = {
            hour: null,
            day: timing.date.day || null,
            month: timing.date.month || null,
            year: timing.date.year || null,
            endYear: null,
            endMonth: null,
            endDay: null,
            endHour: null,
            originalText: '',
            hasEndDate: false
        };
        
        // Add time if present
        if (timing.time) {
            if (timing.time.hour !== undefined) {
                result.hour = timing.time.hour;
            } else if (timing.time.division !== undefined) {
                result.hour = timing.time.division;
            }
        }
        
        // Add end date if present
        if (timing.endDate) {
            result.hasEndDate = true;
            result.endYear = timing.endDate.year || null;
            result.endMonth = timing.endDate.month || null;
            result.endDay = timing.endDate.day || null;
            
            if (timing.endTime) {
                if (timing.endTime.hour !== undefined) {
                    result.endHour = timing.endTime.hour;
                } else if (timing.endTime.division !== undefined) {
                    result.endHour = timing.endTime.division;
                }
            }
        }
        
        // Format display text using the time system
        if (timeSystem) {
            result.originalText = formatDateWithFormat(timing.date, timeSystem.settings.dateFormat, timeSystem);
            
            // Add start time if present
            if (timing.time) {
                const timeFormat = timeSystem.settings.timeFormat;
                let timeStr = '';
                
                if (timeFormat === '12') {
                    timeStr = ` ${timing.time.hour}:${String(timing.time.minute).padStart(2, '0')} ${timing.time.period}`;
                } else if (timeFormat === '24') {
                    timeStr = ` ${String(timing.time.hour).padStart(2, '0')}:${String(timing.time.minute).padStart(2, '0')}`;
                } else if (timeFormat === 'custom') {
                    const divName = timeSystem.timeDivisions.useDivisionNames && timeSystem.timeDivisions.divisionNames?.[timing.time.division]
                        ? timeSystem.timeDivisions.divisionNames[timing.time.division]
                        : `Division ${timing.time.division}`;
                    const subdivisionName = timeSystem.timeDivisions.subdivisionName || 'minutes';
                    timeStr = ` ${divName}, ${timing.time.subdivision} ${subdivisionName}`;
                }
                
                result.originalText += timeStr;
            }
            
            // Add end date if present
            if (timing.endDate) {
                let endText = formatDateWithFormat(timing.endDate, timeSystem.settings.dateFormat, timeSystem);
                
                // Add end time if present
                if (timing.endTime) {
                    const timeFormat = timeSystem.settings.timeFormat;
                    let endTimeStr = '';
                    
                    if (timeFormat === '12') {
                        endTimeStr = ` ${timing.endTime.hour}:${String(timing.endTime.minute).padStart(2, '0')} ${timing.endTime.period}`;
                    } else if (timeFormat === '24') {
                        endTimeStr = ` ${String(timing.endTime.hour).padStart(2, '0')}:${String(timing.endTime.minute).padStart(2, '0')}`;
                    } else if (timeFormat === 'custom') {
                        const divName = timeSystem.timeDivisions.useDivisionNames && timeSystem.timeDivisions.divisionNames?.[timing.endTime.division]
                            ? timeSystem.timeDivisions.divisionNames[timing.endTime.division]
                            : `Division ${timing.endTime.division}`;
                        const subdivisionName = timeSystem.timeDivisions.subdivisionName || 'minutes';
                        endTimeStr = ` ${divName}, ${timing.endTime.subdivision} ${subdivisionName}`;
                    }
                    
                    endText += endTimeStr;
                }
                
                result.originalText += ` → ${endText}`;
            }
        } else {
            // Fallback if time system not found
            result.originalText = `Month ${result.month + 1}, Day ${result.day}, Year ${result.year}`;
            if (result.hasEndDate) {
                result.originalText += ` → Month ${result.endMonth + 1}, Day ${result.endDay}, Year ${result.endYear}`;
            }
        }
        
        return result;
    }
    
    // LEGACY FORMAT: String like "Hour 12, Day 5, Month 3, Year 1"
    if (timing && typeof timing === 'string' && typeof timing.trim === 'function') {
        const timingStr = timing;
        const result = {
            hour: null,
            day: null,
            month: null,
            year: null,
            endYear: null,
            endMonth: null,
            endDay: null,
            endHour: null,
            hasEndDate: false,
            originalText: timingStr
        };
        
        const patterns = [
            /Hour\s+(\d+)/i,
            /Day\s+(\d+)/i,
            /Month\s+(\d+)/i,
            /Year\s+(\d+)/i
        ];
        
        const hourMatch = timingStr.match(patterns[0]);
        const dayMatch = timingStr.match(patterns[1]);
        const monthMatch = timingStr.match(patterns[2]);
        const yearMatch = timingStr.match(patterns[3]);
        
        if (hourMatch) result.hour = parseInt(hourMatch[1]);
        if (dayMatch) result.day = parseInt(dayMatch[1]);
        if (monthMatch) result.month = parseInt(monthMatch[1]) - 1;
        if (yearMatch) result.year = parseInt(yearMatch[1]);
        
        // Must have at least one timing component
        if (result.hour !== null || result.day !== null || result.month !== null || result.year !== null) {
            return result;
        }
    }
    
    return null;
}

// Group events by year
function groupEventsByYear(events) {
    const eventsByYear = {};
    
    events.forEach(event => {
        const year = event.parsedTiming.year || 0; // Default to Year 0 if no year specified
        if (!eventsByYear[year]) {
            eventsByYear[year] = [];
        }
        eventsByYear[year].push(event);
    });
    
    // Sort events within each year
    Object.keys(eventsByYear).forEach(year => {
        eventsByYear[year].sort((a, b) => {
            const aTime = a.parsedTiming;
            const bTime = b.parsedTiming;
            
            // Sort by month, then day, then hour
            if ((aTime.month || 0) !== (bTime.month || 0)) {
                return (aTime.month || 0) - (bTime.month || 0);
            }
            if ((aTime.day || 0) !== (bTime.day || 0)) {
                return (aTime.day || 0) - (bTime.day || 0);
            }
            if ((aTime.hour || 0) !== (bTime.hour || 0)) {
                return (aTime.hour || 0) - (bTime.hour || 0);
            }
            
            // If timing is identical, sort alphabetically by title
            return (a.title || '').localeCompare(b.title || '');
        });
    });
    
    return eventsByYear;
}

// Generate events for a specific year with NAMESPACED classes
function generateYearEvents(events) {
    let eventsHTML = '';
    
    // Group events with identical timing for stacking
    const stackedEvents = {};
    events.forEach((event, index) => {
        const timingKey = `${event.parsedTiming.month || 0}-${event.parsedTiming.day || 0}-${event.parsedTiming.hour || 0}`;
        if (!stackedEvents[timingKey]) {
            stackedEvents[timingKey] = [];
        }
        stackedEvents[timingKey].push(event);
    });
    
    let eventIndex = 0;
    Object.values(stackedEvents).forEach(eventGroup => {
        if (eventGroup.length === 1) {
            // Single event
            eventsHTML += generateSingleTimelineEvent(eventGroup[0], eventIndex);
        } else {
            // Multiple events with same timing
            eventsHTML += generateStackedTimelineEvents(eventGroup, eventIndex);
        }
        eventIndex++;
    });
    
    return eventsHTML;
}

// Generate events for a specific year WITH side tracking
function generateYearEventsWithSide(events, startSide) {
    let eventsHTML = '';
    let currentSide = startSide;
    
    // Group events with identical timing for stacking
    const stackedEvents = {};
    events.forEach((event, index) => {
        const timingKey = `${event.parsedTiming.month || 0}-${event.parsedTiming.day || 0}-${event.parsedTiming.hour || 0}`;
        if (!stackedEvents[timingKey]) {
            stackedEvents[timingKey] = [];
        }
        stackedEvents[timingKey].push(event);
    });
    
    let eventIndex = 0;
    Object.values(stackedEvents).forEach(eventGroup => {
        if (eventGroup.length === 1) {
            // Single event
            eventsHTML += generateSingleTimelineEventWithSide(eventGroup[0], eventIndex, currentSide);
        } else {
            // Multiple events with same timing
            eventsHTML += generateStackedTimelineEventsWithSide(eventGroup, eventIndex, currentSide);
        }
        // Toggle side for next event
        currentSide = currentSide === 'left' ? 'right' : 'left';
        eventIndex++;
    });
    
    return { html: eventsHTML, endSide: currentSide };
}

// =============================================================================
// HELPER FUNCTIONS FOR COLORS AND TOOLTIPS - KEEP ALL OF THESE
// =============================================================================

// Get arc/subarc color from arcTitle
function getArcColorFromTitle(arcTitle) {
    if (!arcTitle || typeof infoData === 'undefined' || !infoData.plans) {
        return '#6c757d'; // Default gray
    }
    
    // Check if it's a sub-arc (contains →)
    if (arcTitle.includes('→')) {
        const [mainArcTitle, subArcTitle] = arcTitle.split('→').map(s => s.trim());
        
        // Find the main arc
        const mainArc = infoData.plans.find(p => p.title === mainArcTitle);
        if (!mainArc) return '#6c757d';
        
        // Find the sub-arc
        if (mainArc.subArcs) {
            const subArc = mainArc.subArcs.find(sa => sa.title === subArcTitle);
            if (subArc && subArc.color) {
                return subArc.color;
            }
            // If sub-arc doesn't have its own color, use adjusted main arc color
            if (mainArc.color) {
                return adjustColorBrightness(mainArc.color, 30);
            }
        }
    } else {
        // It's a main arc
        const arc = infoData.plans.find(p => p.title === arcTitle);
        if (arc && arc.color) {
            return arc.color;
        }
    }
    
    return '#6c757d';
}

// Utility function to adjust color brightness
function adjustColorBrightness(hex, percent) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Adjust brightness
    const newR = Math.min(255, Math.max(0, r + (255 - r) * percent / 100));
    const newG = Math.min(255, Math.max(0, g + (255 - g) * percent / 100));
    const newB = Math.min(255, Math.max(0, b + (255 - b) * percent / 100));
    
    // Convert back to hex
    return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
}

// Get character color by name
function getCharacterColor(characterName) {
    if (typeof infoData !== 'undefined' && infoData.characters) {
        const character = infoData.characters.find(char => 
            char.name && char.name.toLowerCase() === characterName.toLowerCase()
        );
        if (character && character.color) {
            return character.color;
        }
    }
    
    // Fallback to a default color
    return '#6c757d';
}

// Helper function to convert hex to HSL
function hexToHsl(hex) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return {
        h: h * 360,
        s: s * 100,
        l: l * 100
    };
}

// Mix multiple character colors
function mixCharacterColors(colors) {
    let totalH = 0, totalS = 0, totalL = 0;
    let validColors = 0;
    
    colors.forEach(color => {
        const hsl = hexToHsl(color);
        totalH += hsl.h;
        totalS += hsl.s;
        totalL += hsl.l;
        validColors++;
    });
    
    const avgH = totalH / validColors;
    const avgS = totalS / validColors;
    const avgL = Math.max(30, Math.min(70, totalL / validColors)); // Keep it readable
    
    return `hsl(${Math.round(avgH)}, ${Math.round(avgS)}%, ${Math.round(avgL)}%)`;
}

// Generate rich tooltip content with character tags using their colors
function generateRichTooltip(event) {
    let content = event.title || 'Untitled Event';
    
    // Add timing information with full date range
    if (event.parsedTiming && event.parsedTiming.originalText) {
        content += `<div class="tl-tooltip-timing">${event.parsedTiming.originalText}</div>`;
    }
    
    // Add duration indicator if it's a date range
    if (event.parsedTiming && event.parsedTiming.hasEndDate) {
        content += `<div class="tl-tooltip-duration" style="font-style: italic; color: var(--text-muted); font-size: 0.85em;">Duration event</div>`;
    }
    
    // Add character tags with colors if they exist - only show visible tags
    if (event.characterTags && event.characterTags.length > 0) {
        const visibleCharacterTags = getVisibleTags(event.characterTags);
        if (visibleCharacterTags.length > 0) {
            const characterTagsHTML = visibleCharacterTags.map(tag => {
                const characterColor = getCharacterColor(tag);
                return `<span class="tl-tooltip-character-tag" style="color: ${characterColor}">${tag}</span>`;
            }).join(' ');
            
            content += `<div class="tl-tooltip-characters">Characters: ${characterTagsHTML}</div>`;
        }
    }
    
    // Add notes preview if available
    if (event.notes && event.notes.trim()) {
        const notesPreview = event.notes.length > 100 
            ? event.notes.substring(0, 100) + '...' 
            : event.notes;
        content += `<div class="tl-tooltip-notes">${notesPreview}</div>`;
    }
    
    return `<div class="tl-node-tooltip">${content}</div>`;
}

// =============================================================================
// UPDATED CHRONOLOGICAL TIMELINE EVENT GENERATION
// =============================================================================

// UPDATED: Single timeline event - now uses arc color for marker and rich tooltips
// UPDATED: Single timeline event with explicit side
function generateSingleTimelineEventWithSide(event, index, side) {
    const isYearly = event.isYearlyInstance === true;
    const yearlyClass = isYearly ? ' tl-yearly-event' : '';
    const hasNotes = event.notes && event.notes.trim();
    const hasImage = event.image && event.image.trim();
    const hasDuration = event.parsedTiming && event.parsedTiming.hasEndDate;
    
    const arcColor = getArcColorFromTitle(event.arcTitle);
    const borderColor = hasImage ? arcColor : '';
    const allCharacterTagsStripped = event.characterTags ? event.characterTags.map(stripHiddenPrefix).join(',').toLowerCase() : '';
    const eventId = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const seasonalBg = setSeasonalBackground(event);
    const richTooltip = generateRichTooltip(event);

    return `
            <div class="tl-timeline-event tl-${side}-side ${hasImage ? 'has-image' : ''}${yearlyClass}"
            data-character-tags="${allCharacterTagsStripped}"
            data-event-type="${event.type || 'rising'}"
            data-year="${event.parsedTiming.year || 0}">
            <div class="tl-event-card" ${seasonalBg} ${hasNotes ? `onclick="showEventNotesModal('${eventId}')" data-event-id="${eventId}"` : ''}>
                <div class="tl-event-arc-title"><span class="tl-arc-link" data-arc-title="${(event.arcTitle || 'Unknown Arc').replace(/"/g, '&quot;')}" onclick="event.stopPropagation(); openPlanModalFromTimeline(this.dataset.arcTitle)">${event.arcTitle || 'Unknown Arc'}</span></div>
                <div class="tl-event-title">
                    ${event.title || 'Untitled Event'}
                    ${hasDuration ? '<span class="tl-duration-badge" title="Duration event">⏱</span>' : ''}
                </div>
                <div class="tl-event-timing">${event.parsedTiming.originalText}</div>
                ${hasImage ? `<div class="tl-event-image" style="border-color: ${borderColor};"><img src="${event.image}" alt="${event.title}" /></div>` : ''}
                ${hasNotes ? '<div class="tl-chrono-notes-indicator">♦</div>' : ''}
                ${richTooltip}
            </div>
            <div class="tl-timeline-marker" style="background-color: ${arcColor};"></div>
            ${hasNotes ? `<script>window.eventData = window.eventData || {}; window.eventData['${eventId}'] = ${JSON.stringify({
                title: event.title || 'Untitled Event',
                arcTitle: event.arcTitle || 'Unknown Arc',
                timing: event.parsedTiming.originalText,
                notes: event.notes || '',
                characterTags: event.characterTags || []
            })};</script>` : ''}
        </div>`;
}

// UPDATED: Stacked timeline events - now uses arc color for marker and rich tooltips
// UPDATED: Stacked timeline events with explicit side
function generateStackedTimelineEventsWithSide(events, index, side) {
    const isYearly = events.isYearlyInstance === true;
    const yearlyClass = isYearly ? ' tl-yearly-event' : '';
    const allCharacterTags = new Set();
    events.forEach(event => {
        if (event.characterTags && Array.isArray(event.characterTags)) {
            event.characterTags.forEach(tag => allCharacterTags.add(stripHiddenPrefix(tag)));
        }
    });
    const combinedTagsForFiltering = Array.from(allCharacterTags).join(',').toLowerCase();
    const containerSeasonalBg = setSeasonalBackground(events[0]);
    const arcColor = getArcColorFromTitle(events[0].arcTitle);

// Check if any event in the stack has an image
    const stackHasImage = events.some(e => e.image && e.image.trim());

    let stackedHTML = `
        <div class="tl-timeline-event tl-${side}-side ${stackHasImage ? 'has-image' : ''}${yearlyClass}"
            data-character-tags="${combinedTagsForFiltering}"
            data-event-type="${events[0].type || 'rising'}"
            data-year="${events[0].parsedTiming.year || 0}">
            <div class="tl-stacked-events" ${containerSeasonalBg}>`;
    
    events.forEach((event, eventIndex) => {
        const hasNotes = event.notes && event.notes.trim();
        const hasImage = event.image && event.image.trim();
        const hasDuration = event.parsedTiming && event.parsedTiming.hasEndDate;
        const eventArcColor = getArcColorFromTitle(event.arcTitle);
        const borderColor = hasImage ? eventArcColor : '';
        const eventId = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const richTooltip = generateRichTooltip(event);
        
        stackedHTML += `
            <div class="tl-event-card" ${hasNotes ? `onclick="showEventNotesModal('${eventId}')" data-event-id="${eventId}"` : ''}>
                <div class="tl-event-arc-title"><span class="tl-arc-link" data-arc-title="${(event.arcTitle || 'Unknown Arc').replace(/"/g, '&quot;')}" onclick="event.stopPropagation(); openPlanModalFromTimeline(this.dataset.arcTitle)">${event.arcTitle || 'Unknown Arc'}</span></div>
                <div class="tl-event-title">
                    ${event.title || 'Untitled Event'}
                    ${hasDuration ? '<span class="tl-duration-badge" title="Duration event">⏱</span>' : ''}
                </div>
                <div class="tl-event-timing">${event.parsedTiming.originalText}</div>
                ${hasImage ? `<div class="tl-event-image" style="border-color: ${borderColor};"><img src="${event.image}" alt="${event.title}" /></div>` : ''}
                ${hasNotes ? '<div class="tl-chrono-notes-indicator">♦</div>' : ''}
                ${richTooltip}
            </div>
            ${hasNotes ? `<script>window.eventData = window.eventData || {}; window.eventData['${eventId}'] = ${JSON.stringify({
                title: event.title || 'Untitled Event',
                arcTitle: event.arcTitle || 'Unknown Arc',
                timing: event.parsedTiming.originalText,
                notes: event.notes || '',
                characterTags: event.characterTags || []
            })};</script>` : ''}`;
    });
    
    stackedHTML += `
            </div>
            <div class="tl-timeline-marker" style="background-color: ${arcColor};"></div>
        </div>`;
    
    return stackedHTML;
}

// SEASONAL BACKGROUND FUNCTION with debug logging
function setSeasonalBackground(event) {
    // Extract timing info from event
    let month = null;
    let day = null;
    // Use the project's selected time system instead of always defaulting to Gregorian
    let timeSystemId = (typeof infoData !== 'undefined' && infoData.plansOptions?.selectedTimeSystemId) 
        ? infoData.plansOptions.selectedTimeSystemId 
        : 'default';
    
    // Check if event has parsedTiming (from timeline)
    if (event.parsedTiming?.month !== undefined && event.parsedTiming?.month !== null) {
        month = event.parsedTiming.month;
        day = event.parsedTiming.day || 1;
    } 
    // Check if event has new structured timing format
    else if (event.timing && typeof event.timing === 'object' && event.timing.date) {
        month = event.timing.date.month;
        day = event.timing.date.day || 1;
        timeSystemId = event.timing.timeSystemId || 'default';
    }
    // Check if event has legacy string timing
    else if (event.timing && typeof event.timing === 'string') {
        const timing = event.timing;
        
        // Try to match number patterns like "Month 3" or "Day 15 Month 3"
        const monthMatch = timing.match(/month\s+(\d+)|(\d+)\s*(?:st|nd|rd|th)?\s*month/i);
        if (monthMatch) {
            month = parseInt(monthMatch[1] || monthMatch[2]) - 1; // Convert to 0-indexed
        }
        
        const dayMatch = timing.match(/day\s+(\d+)|(\d+)\s*(?:st|nd|rd|th)?\s*day/i);
        if (dayMatch) {
            day = parseInt(dayMatch[1] || dayMatch[2]);
        }
    }
    
    // If we have a month, find which season it belongs to
    if (month !== null) {
        const timeSystem = getTimeSystemById(timeSystemId);
        
        if (timeSystem && timeSystem.seasons && timeSystem.seasons.length > 0) {
            const seasonColor = getSeasonColorForDate(month, day || 1, timeSystem);
            if (seasonColor) {
                return `style="--seasonal-bg: ${seasonColor}"`;
            }
        }
    }
    
    // Fallback to default container background
    const colors = (typeof getColorScheme === 'function') ? getColorScheme() : {
        containerBg: '#ffffff'
    };
    return `style="--seasonal-bg: ${colors.containerBg}"`;
}

// Helper function to determine which season a date falls into
function getSeasonColorForDate(month, day, timeSystem) {
    if (!timeSystem.seasons || timeSystem.seasons.length === 0) {
        return null;
    }
    
    // Sort seasons by start date
    const sortedSeasons = [...timeSystem.seasons].sort((a, b) => {
        if (a.startDate.month !== b.startDate.month) {
            return a.startDate.month - b.startDate.month;
        }
        return a.startDate.day - b.startDate.day;
    });
    
    // Find which season the date falls into
    let currentSeason = sortedSeasons[sortedSeasons.length - 1]; // Default to last season
    
    for (let i = 0; i < sortedSeasons.length; i++) {
        const season = sortedSeasons[i];
        const nextSeason = sortedSeasons[(i + 1) % sortedSeasons.length];
        
        // Check if date is after this season's start
        const isAfterStart = (month > season.startDate.month) || 
                            (month === season.startDate.month && day >= season.startDate.day);
        
        // Check if date is before next season's start
        const isBeforeNext = (month < nextSeason.startDate.month) || 
                             (month === nextSeason.startDate.month && day < nextSeason.startDate.day);
        
        // Handle year wrap-around (e.g., Season 1 from Month 10 to Month 3)
        if (nextSeason.startDate.month < season.startDate.month) {
            // Next season wraps to next year
            if (isAfterStart || (month < nextSeason.startDate.month) || 
                (month === nextSeason.startDate.month && day < nextSeason.startDate.day)) {
                currentSeason = season;
                break;
            }
        } else {
            // Normal case: seasons don't wrap
            if (isAfterStart && isBeforeNext) {
                currentSeason = season;
                break;
            }
        }
    }
    
    return currentSeason.color || null;
}

function getEventTypeColor(type) {
    // You can access your color scheme here
    const colors = (typeof getColorScheme === 'function') ? getColorScheme() : {};
    
    switch (type) {
        case 'none':
            return colors.textMuted || '#696764';
        case 'exposition':
            return colors.physical || '#4D96E4';
        case 'rising':
            return colors.statusCanon || '#28a745';
        case 'setback':
            return colors.statusIdea || '#dc3545';
        case 'climax':
            return colors.statusDraft || '#ffc107';
        case 'resolution':
            return colors.hobbies || '#075AFF';
        default:
            return colors.statusCanon || '#696764';
    }
}

// Generate the event notes modal with NAMESPACED classes
function generateEventNotesModal() {
    return `
        <div id="tl-event-notes-modal" class="tl-event-notes-modal" onclick="hideEventNotesModal(event)">
            <div class="tl-event-notes-modal-content" onclick="event.stopPropagation()">
                <div class="tl-event-notes-modal-header">
                    <h3 id="tl-event-notes-modal-title" class="tl-event-notes-modal-title"></h3>
                    <button class="tl-event-notes-modal-close" onclick="hideEventNotesModal()">&times;</button>
                </div>
                <div id="tl-event-notes-modal-arc" class="tl-event-notes-modal-arc"></div>
                <div id="tl-event-notes-modal-timing" class="tl-event-notes-modal-timing"></div>
                <div id="tl-event-notes-modal-notes" class="tl-event-notes-modal-notes"></div>
            </div>
        </div>`;
}

// UPDATED: Enhanced version that keeps ALL your existing functionality with compact filtering
// FIXED: Timeline JavaScript generation with proper Arc view filtering and Unicode arrows

function generateTimelineJavaScript() {
    return `
            // Timeline filtering state
            let selectedTimelineTags = new Set();
            let timelineFilterMode = 'any';
            let currentTimelineSearch = '';
            let timelineYearFrom = null;
            let timelineYearTo = null;

            // Helper function to get time system by ID
            window.getTimeSystemById = function(id) {
                if (id === 'default') {
                    return window.DEFAULT_CALENDAR;
                }
                // ADD THIS:
                if (id === 'preset-chinese') {
                    return window.PRESET_CHINESE_CALENDAR;
                }
                const systems = window.userTimeSystems || [];
                return systems.find(ts => ts.id === id) || null;
            };

            // Helper function to format dates
            window.formatDateWithFormat = function(dateObj, format, calendar) {
                const monthName = calendar.months[dateObj.month]?.name || 'Unknown';
                const monthNum = String(dateObj.month + 1).padStart(2, '0');
                const day = String(dateObj.day).padStart(2, '0');
                const dayNum = dateObj.day;
                const year = Math.abs(dateObj.year);
                
                let result = format;
                result = result.replace('MMMM', monthName);
                result = result.replace('MM', monthNum);
                result = result.replace('DD', day);
                result = result.replace('D', String(dayNum));
                result = result.replace('YYYY', String(year));
                
                return result;
            };
            
            // Parse timing function - needed for timeline filtering
            window.parseTiming = function(timing) {
                // NEW FORMAT: Object with date/time/timeSystemId
                if (timing && typeof timing === 'object' && timing.date) {
                    const timeSystem = getTimeSystemById(timing.timeSystemId || 'default');
                    
                    const result = {
                        hour: null,
                        day: timing.date.day || null,
                        month: timing.date.month || null,
                        year: timing.date.year || null,
                        endYear: null,
                        endMonth: null,
                        endDay: null,
                        endHour: null,
                        originalText: '',
                        hasEndDate: false
                    };
                    
                    // Add time if present
                    if (timing.time) {
                        if (timing.time.hour !== undefined) {
                            result.hour = timing.time.hour;
                        } else if (timing.time.division !== undefined) {
                            result.hour = timing.time.division;
                        }
                    }
                    
                    // Add end date if present
                    if (timing.endDate) {
                        result.hasEndDate = true;
                        result.endYear = timing.endDate.year || null;
                        result.endMonth = timing.endDate.month || null;
                        result.endDay = timing.endDate.day || null;
                        
                        if (timing.endTime) {
                            if (timing.endTime.hour !== undefined) {
                                result.endHour = timing.endTime.hour;
                            } else if (timing.endTime.division !== undefined) {
                                result.endHour = timing.endTime.division;
                            }
                        }
                    }
                    
                    // Format display text using the time system
                    if (timeSystem) {
                        result.originalText = formatDateWithFormat(timing.date, timeSystem.settings.dateFormat, timeSystem);
                        
                        // Add start time if present
                        if (timing.time) {
                            const timeFormat = timeSystem.settings.timeFormat;
                            let timeStr = '';
                            
                            if (timeFormat === '12') {
                                timeStr = \` \${timing.time.hour}:\${String(timing.time.minute).padStart(2, '0')} \${timing.time.period}\`;
                            } else if (timeFormat === '24') {
                                timeStr = \` \${String(timing.time.hour).padStart(2, '0')}:\${String(timing.time.minute).padStart(2, '0')}\`;
                            } else if (timeFormat === 'custom') {
                                const divName = timeSystem.timeDivisions.useDivisionNames && timeSystem.timeDivisions.divisionNames?.[timing.time.division]
                                    ? timeSystem.timeDivisions.divisionNames[timing.time.division]
                                    : \`Division \${timing.time.division}\`;
                                const subdivisionName = timeSystem.timeDivisions.subdivisionName || 'minutes';
                                timeStr = \` \${divName}, \${timing.time.subdivision} \${subdivisionName}\`;
                            }
                            
                            result.originalText += timeStr;
                        }
                        
                        // Add end date if present
                        if (timing.endDate) {
                            let endText = formatDateWithFormat(timing.endDate, timeSystem.settings.dateFormat, timeSystem);
                            
                            // Add end time if present
                            if (timing.endTime) {
                                const timeFormat = timeSystem.settings.timeFormat;
                                let endTimeStr = '';
                                
                                if (timeFormat === '12') {
                                    endTimeStr = \` \${timing.endTime.hour}:\${String(timing.endTime.minute).padStart(2, '0')} \${timing.endTime.period}\`;
                                } else if (timeFormat === '24') {
                                    endTimeStr = \` \${String(timing.endTime.hour).padStart(2, '0')}:\${String(timing.endTime.minute).padStart(2, '0')}\`;
                                } else if (timeFormat === 'custom') {
                                    const divName = timeSystem.timeDivisions.useDivisionNames && timeSystem.timeDivisions.divisionNames?.[timing.endTime.division]
                                        ? timeSystem.timeDivisions.divisionNames[timing.endTime.division]
                                        : \`Division \${timing.endTime.division}\`;
                                    const subdivisionName = timeSystem.timeDivisions.subdivisionName || 'minutes';
                                    endTimeStr = \` \${divName}, \${timing.endTime.subdivision} \${subdivisionName}\`;
                                }
                                
                                endText += endTimeStr;
                            }
                            
                            result.originalText += \` → \${endText}\`;
                        }
                    } else {
                        // Fallback if time system not found
                        result.originalText = \`Month \${result.month + 1}, Day \${result.day}, Year \${result.year}\`;
                        if (result.hasEndDate) {
                            result.originalText += \` → Month \${result.endMonth + 1}, Day \${result.endDay}, Year \${result.endYear}\`;
                        }
                    }
                    
                    return result;
                }
                
                // LEGACY FORMAT: String like "Hour 12, Day 5, Month 3, Year 1"
                if (timing && typeof timing === 'string' && typeof timing.trim === 'function') {
                    const timingStr = timing;
                    const result = {
                        hour: null,
                        day: null,
                        month: null,
                        year: null,
                        endYear: null,
                        endMonth: null,
                        endDay: null,
                        endHour: null,
                        hasEndDate: false,
                        originalText: timingStr
                    };
                    
                    const patterns = [
                        /Hour\s+(\d+)/i,
                        /Day\s+(\d+)/i,
                        /Month\s+(\d+)/i,
                        /Year\s+(\d+)/i
                    ];
                    
                    const hourMatch = timingStr.match(patterns[0]);
                    const dayMatch = timingStr.match(patterns[1]);
                    const monthMatch = timingStr.match(patterns[2]);
                    const yearMatch = timingStr.match(patterns[3]);
                    
                    if (hourMatch) result.hour = parseInt(hourMatch[1]);
                    if (dayMatch) result.day = parseInt(dayMatch[1]);
                    if (monthMatch) result.month = parseInt(monthMatch[1]) - 1;
                    if (yearMatch) result.year = parseInt(yearMatch[1]);
                    
                    // Must have at least one timing component
                    if (result.hour !== null || result.day !== null || result.month !== null || result.year !== null) {
                        return result;
                    }
                }
                
                return null;
            }
            function toggleEventSubevents(uniqueId) {
                const content = document.getElementById('subevents-content-' + uniqueId);
                const toggle = document.getElementById('subevents-toggle-' + uniqueId);
                
                if (content && toggle) {
                    if (content.classList.contains('collapsed')) {
                        content.classList.remove('collapsed');
                        toggle.innerHTML = '&#9660;';
                    } else {
                        content.classList.add('collapsed');
                        toggle.innerHTML = '&#9654;';
                    }
                }
            }

            // Plans view switching
            function switchPlansView(view) {
                
                // Update tab states
                const cardTab = document.getElementById('cards-tab');
                const timelineTab = document.getElementById('timeline-tab');
                const cardView = document.getElementById('cards-view');
                const timelineView = document.getElementById('timeline-view');
                
                console.log('🔄 Elements found:', {
                    cardTab: !!cardTab,
                    timelineTab: !!timelineTab,
                    cardView: !!cardView,
                    timelineView: !!timelineView
                });
                
                if (view === 'cards') {
                    cardTab.classList.add('active');
                    timelineTab.classList.remove('active');
                    cardView.classList.add('active');
                    timelineView.classList.remove('active');
                } else if (view === 'timeline') {
                    cardTab.classList.remove('active');
                    timelineTab.classList.add('active');
                    cardView.classList.remove('active');
                    timelineView.classList.add('active');
                    
                    console.log('🔄 After timeline switch:', {
                        timelineViewClasses: timelineView ? timelineView.className : 'not found',
                        timelineViewDisplay: timelineView ? window.getComputedStyle(timelineView).display : 'not found'
                    });
                }
            }

            // FIXED: Timeline view switching function - reapply filters and detect current view
            function switchTimelineView(view) {
                const chronoContainer = document.getElementById('tl-chronological-container');
                const arcContainer = document.getElementById('tl-arc-container');
                const viewSelect = document.getElementById('timeline-view-select');
                
                if (view === 'chronological') {
                    if (chronoContainer) chronoContainer.style.display = 'block';
                    if (arcContainer) arcContainer.style.display = 'none';
                    if (viewSelect) viewSelect.value = 'chronological';
                } else if (view === 'arc') {
                    if (chronoContainer) chronoContainer.style.display = 'none';
                    if (arcContainer) arcContainer.style.display = 'block';
                    if (viewSelect) viewSelect.value = 'arc';
                }
                
                // Reapply filters after switching views
                setTimeout(() => {
                    applyTimelineFilters();
                }, 100);
            }

            // Event notes modal functions
            function showEventNotesModal(eventId) {
                if (!window.eventData || !window.eventData[eventId]) {
                    console.error('Event data not found for ID:', eventId);
                    return;
                }
                
                const eventData = window.eventData[eventId];
                
                document.getElementById('tl-event-notes-modal-title').textContent = eventData.title;
                document.getElementById('tl-event-notes-modal-arc').innerHTML = \`<span class="tl-arc-link" data-arc-title="\${eventData.arcTitle}">\${eventData.arcTitle}</span>\`;

                // Add click listener to the arc link
                const arcLink = document.getElementById('tl-event-notes-modal-arc').querySelector('.tl-arc-link');
                if (arcLink) {
                    arcLink.onclick = () => openPlanModalFromTimeline(arcLink.dataset.arcTitle);
                }
                document.getElementById('tl-event-notes-modal-timing').textContent = eventData.timing;
                document.getElementById('tl-event-notes-modal-notes').textContent = eventData.notes;
                
                document.getElementById('tl-event-notes-modal').classList.add('show');
            }

            function hideEventNotesModal(event) {
                if (event && event.target !== event.currentTarget) return;
                document.getElementById('tl-event-notes-modal').classList.remove('show');
            }
            
            // Initialize timeline filtering
            function initializeTimelineFiltering() {
                const searchInput = document.getElementById('timeline-search');
                const yearFromInput = document.getElementById('timeline-year-from');
                const yearToInput = document.getElementById('timeline-year-to');

                if (searchInput) {
                    searchInput.addEventListener('input', function() {
                        currentTimelineSearch = this.value.toLowerCase().trim();
                        applyTimelineFilters();
                    });
                }

                if (yearFromInput) {
                    yearFromInput.addEventListener('input', function() {
                        timelineYearFrom = this.value ? parseInt(this.value) : null;
                        applyTimelineFilters();
                    });
                }

                if (yearToInput) {
                    yearToInput.addEventListener('input', function() {
                        timelineYearTo = this.value ? parseInt(this.value) : null;
                        applyTimelineFilters();
                    });
                }

                // Initialize display
                updateTimelineTagStates();
                updateTimelineClearButtonState();
                
                // Apply initial filters to both views
                setTimeout(() => {
                    console.log('Applying initial timeline filters');
                    applyTimelineFilters();
                }, 200);
            }       

            function initializeTimelineFeatures() {
                console.log('Initializing timeline features...');
                
                // Initialize filtering
                initializeTimelineFiltering();
                
                // Timeline back to top button
                const backToTopBtn = document.getElementById('timeline-back-to-top');
                if (backToTopBtn) {
                    window.addEventListener('scroll', function() {
                        if (window.pageYOffset > 300) {
                            backToTopBtn.classList.add('visible');
                        } else {
                            backToTopBtn.classList.remove('visible');
                        }
                    });
                    
                    backToTopBtn.addEventListener('click', function() {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    });
                }
                
                console.log('Timeline features initialized');
            }

            // FIXED: Open plan modal from timeline by arc title
            function openPlanModalFromTimeline(fullArcTitle) {                
                // FIXED: Use embedded fullInfoData instead of plansData
                if (fullInfoData && fullInfoData.plans) {
                    // Extract main arc title (everything before the arrow)
                    // FIXED: Split on actual arrow character instead of HTML entity
                    const mainArcTitle = fullArcTitle.split(' → ')[0].trim();
                    
                    const planIndex = fullInfoData.plans.findIndex(plan => plan.title === mainArcTitle);
                    
                    if (planIndex !== -1) {
                        hideEventNotesModal();
                        window.openPlanModal(planIndex);
                    } else {
                        console.error('Plan not found for arc:', mainArcTitle);
                        console.log('Available plans:', fullInfoData.plans.map(p => p.title));
                    }
                } else {
                    console.error('Plans data not available in fullInfoData');
                }
            }

            // Store timeline events data globally for filtering - FIXED data access
            if (fullInfoData && fullInfoData.plans && fullInfoData.plans.length > 0) {
                // Collect timeline events when page loads
                const timelineEvents = [];
                fullInfoData.plans.forEach(plan => {
                    // Main events
                    if (plan.events) {
                        plan.events.forEach(event => {
                            if (event.visible !== false && event.timing && (typeof event.timing === 'string' ? event.timing.trim() : true)) {
                                const parsedTiming = window.parseTiming(event.timing);
                                if (parsedTiming) {
                                    timelineEvents.push({
                                        ...event,
                                        arcTitle: plan.title,
                                        isSubArc: false,
                                        parsedTiming: parsedTiming,
                                        characterTags: event.characterTags || [],
                                        subevents: event.subevents || event.characterMoments || []
                                    });
                                }
                            }
                        });
                    }
                    
                    // Sub-arc events
                    if (plan.subArcs) {
                        plan.subArcs.forEach(subArc => {
                            if (subArc.visible !== false && subArc.events) {
                                subArc.events.forEach(event => {
                                    if (event.visible !== false && event.timing && (typeof event.timing === 'string' ? event.timing.trim() : true)) {
                                        const parsedTiming = window.parseTiming(event.timing);
                                        if (parsedTiming) {
                                            timelineEvents.push({
                                                ...event,
                                                arcTitle: \`\${plan.title} &rarr; \${subArc.title}\`,
                                                isSubArc: true,
                                                parsedTiming: parsedTiming,
                                                characterTags: event.characterTags || [],
                                                subevents: event.subevents || event.characterMoments || []
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
                
                window.timelineAllEvents = timelineEvents;
            }

            // Close modal on Escape key
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    hideEventNotesModal();
                }
            });

            // Make all functions globally available
            window.switchPlansView = switchPlansView;
            window.switchTimelineView = switchTimelineView;
            window.toggleEventSubevents = toggleEventSubevents;
            window.showEventNotesModal = showEventNotesModal;
            window.hideEventNotesModal = hideEventNotesModal;
            window.initializeTimelineFiltering = initializeTimelineFiltering;

            window.openPlanModalFromTimeline = openPlanModalFromTimeline;

    `;
}

function generateTimelineFilteringJavaScript() {
    return `
        // Timeline filtering functions
        function toggleTimelineTag(tag) {
            if (selectedTimelineTags.has(tag)) {
                selectedTimelineTags.delete(tag);
            } else {
                selectedTimelineTags.add(tag);
            }
            
            updateTimelineTagStates();
            updateTimelineClearButtonState();
            applyTimelineFilters();
        }
        
        function updateTimelineTagStates() {
            document.querySelectorAll('.timeline-tag-link').forEach(link => {
                const onclickAttr = link.getAttribute('onclick');
                const tagMatch = onclickAttr.match(/toggleTimelineTag\\('(.+?)'\\)/);
                const fullTag = tagMatch ? tagMatch[1] : link.textContent;
                const strippedTag = stripHiddenPrefix(fullTag);
                
                if (selectedTimelineTags.has(strippedTag)) {
                    link.classList.add('selected');
                } else {
                    link.classList.remove('selected');
                }
            });
        }

        function updateTimelineClearButtonState() {
            const clearBtn = document.getElementById('timeline-clear-selected-btn');
            if (clearBtn) {
                if (selectedTimelineTags.size > 0) {
                    clearBtn.classList.add('active');
                } else {
                    clearBtn.classList.remove('active');
                }
            }
        }
        
        function clearAllTimelineTags() {
            selectedTimelineTags.clear();
            updateTimelineTagStates();
            updateTimelineClearButtonState();
            applyTimelineFilters();
        }

        function setTimelineFilterMode(mode) {
            timelineFilterMode = mode;
            
            // Update UI
            document.querySelectorAll('.timeline-filter-mode-option').forEach(option => {
                option.classList.remove('active');
            });
            const activeButton = document.getElementById(\`timeline-filter-mode-\${mode}\`);
            if (activeButton) {
                activeButton.classList.add('active');
            }
            
            // Reapply filters
            applyTimelineFilters();
        }

        // FIXED: Timeline navigation toggle function with consistent arrows
        function toggleTimelineNavigation() {
            const content = document.querySelector('.timeline-nav-content');
            const toggle = document.querySelector('.timeline-nav-toggle');
            
            if (content && toggle) {
                if (content.classList.contains('collapsed')) {
                    content.classList.remove('collapsed');
                    toggle.classList.add('expanded');
                    toggle.innerHTML = '&#9660;'; // Down arrow when expanded
                } else {
                    content.classList.add('collapsed');
                    toggle.classList.remove('expanded');  
                    toggle.innerHTML = '&#9654;'; // Right arrow when collapsed
                }
            }
        }

        // FIXED: Main filtering function that detects current view and applies appropriate filters
        function applyTimelineFilters() {
            const chronoContainer = document.getElementById('tl-chronological-container');
            
            if (chronoContainer) {
                applyChronologicalFilters(chronoContainer);
            }
        }

        // Chronological timeline filtering (existing logic)
        function applyChronologicalFilters(timelineContainer) {
            const yearSections = timelineContainer.querySelectorAll('.tl-timeline-year');
            
            yearSections.forEach(yearSection => {
                const year = parseInt(yearSection.getAttribute('data-year'));
                let yearHasVisibleEvents = false;
                
                // Check year range filter
                const yearInRange = (!timelineYearFrom || year >= timelineYearFrom) && 
                                    (!timelineYearTo || year <= timelineYearTo);
                
                if (!yearInRange) {
                    yearSection.style.display = 'none';
                    return;
                }
                
                const timelineEvents = yearSection.querySelectorAll('.tl-timeline-event');
                
                timelineEvents.forEach(timelineEvent => {
                    const isStackedEvent = timelineEvent.querySelector('.tl-stacked-events');
                    
                    if (isStackedEvent) {
                        // STACKED EVENTS: Handle each individual event card
                        let stackHasVisibleEvents = false;
                        const nestedCards = timelineEvent.querySelectorAll('.tl-stacked-events .tl-event-card');
                        
                        nestedCards.forEach(card => {
                            let cardMatches = true;
                            
                            // Get info from this specific card
                            const title = card.querySelector('.tl-event-title')?.textContent || '';
                            const arcElement = card.querySelector('.tl-event-arc-title .tl-arc-link');
                            const arc = arcElement?.textContent || '';
                            const timing = card.querySelector('.tl-event-timing')?.textContent || '';
                            
                            // Tag filtering for this individual card
                            if (selectedTimelineTags.size > 0) {
                                cardMatches = checkEventMatchesTags(arc);
                            }
                            
                            // Search filter for this individual card
                            if (cardMatches && currentTimelineSearch) {
                                const searchableText = [title, arc, timing].join(' ').toLowerCase();
                                cardMatches = searchableText.includes(currentTimelineSearch);
                            }
                            
                            // Show/hide this individual card
                            if (cardMatches) {
                                card.style.display = '';
                                stackHasVisibleEvents = true;
                            } else {
                                card.style.display = 'none';
                            }
                        });
                        
                        // Show/hide the entire stacked event container
                        if (stackHasVisibleEvents) {
                            timelineEvent.style.display = '';
                            timelineEvent.classList.remove('hidden');
                            yearHasVisibleEvents = true;
                        } else {
                            timelineEvent.style.display = 'none';
                            timelineEvent.classList.add('hidden');
                        }
                        
                    } else {
                        // INDIVIDUAL EVENTS: Handle as before
                        let matches = true;
                        
                        const title = timelineEvent.querySelector('.tl-event-title')?.textContent || '';
                        const arcElement = timelineEvent.querySelector('.tl-event-arc-title .tl-arc-link');
                        const arc = arcElement?.textContent || '';
                        const timing = timelineEvent.querySelector('.tl-event-timing')?.textContent || '';
                        
                        // Tag filtering
                        if (selectedTimelineTags.size > 0) {
                            matches = checkEventMatchesTags(arc);
                        }
                        
                        // Search filter
                        if (matches && currentTimelineSearch) {
                            const searchableText = [title, arc, timing].join(' ').toLowerCase();
                            matches = searchableText.includes(currentTimelineSearch);
                        }
                        
                        // Show/hide individual event
                        if (matches) {
                            timelineEvent.style.display = '';
                            timelineEvent.classList.remove('hidden');
                            yearHasVisibleEvents = true;
                        } else {
                            timelineEvent.style.display = 'none';
                            timelineEvent.classList.add('hidden');
                        }
                    }
                });
                
                // Show/hide year section
                yearSection.style.display = yearHasVisibleEvents ? '' : 'none';
            });
        }

                    // Helper function to check if an event matches the selected tags
        function checkEventMatchesTags(arcTitle) {
            if (!arcTitle || selectedTimelineTags.size === 0) {
                return true; // No tags selected means show all
            }
            
            if (typeof fullInfoData === 'undefined' || !fullInfoData.plans) {
                return false;
            }
            
            const mainArcTitle = arcTitle.split(' &rarr; ')[0].trim();
            const plan = fullInfoData.plans.find(p => p.title === mainArcTitle);
            
            if (!plan || !plan.tags) {
                return false; // No plan or no tags means doesn't match
            }
            
            const planFilterTags = plan.tags;
            
            if (timelineFilterMode === 'all') {
                // Plan must have ALL selected tags
                return Array.from(selectedTimelineTags).every(selectedTag => 
                    planFilterTags.some(planTag => 
                        planTag.toLowerCase().includes(selectedTag.toLowerCase())
                    )
                );
            } else {
                // Plan must have ANY selected tag
                return Array.from(selectedTimelineTags).some(selectedTag => 
                    planFilterTags.some(planTag => 
                        planTag.toLowerCase().includes(selectedTag.toLowerCase())
                    )
                );
            }
        }


        // Make timeline filtering functions globally available
        window.toggleTimelineTag = toggleTimelineTag;
        window.updateTimelineTagStates = updateTimelineTagStates;
        window.updateTimelineClearButtonState = updateTimelineClearButtonState;
        window.clearAllTimelineTags = clearAllTimelineTags;
        window.setTimelineFilterMode = setTimelineFilterMode;
        window.toggleTimelineNavigation = toggleTimelineNavigation;
        window.applyTimelineFilters = applyTimelineFilters;
        window.applyChronologicalFilters = applyChronologicalFilters;
        window.checkEventMatchesTags = checkEventMatchesTags;

        //these may not exist anymore, not sure
        window.selectedTimelineTags = selectedTimelineTags;
        window.timelineFilterMode = timelineFilterMode;
        window.currentTimelineSearch = currentTimelineSearch;
        window.timelineYearFrom = timelineYearFrom;
        window.timelineYearTo = timelineYearTo;
     `;
}
