// Timeline HTML Generation Functions

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
    
    // Add view switcher dropdown
    timelineHTML += generateTimelineViewSwitcher();
    
    // Generate both chronological and arc timeline views
    timelineHTML += generateChronologicalTimeline(allEvents);
    timelineHTML += generateArcTimeline(data.plans, allEvents);
    
    return timelineHTML;
}

// Generate the chronological timeline (existing functionality)
function generateChronologicalTimeline(allEvents) {
    // Group events by year
    const eventsByYear = groupEventsByYear(allEvents);
    
    let chronoHTML = '<div class="tl-timeline-container tl-chronological-view" id="tl-chronological-container">';
    
    // Generate each year section
    Object.keys(eventsByYear).sort((a, b) => parseInt(a) - parseInt(b)).forEach(year => {
        chronoHTML += `
            <div class="tl-timeline-year" data-year="${year}">
                <div class="tl-year-label">
                    <h3>Year ${year}</h3>
                </div>
                <div class="tl-timeline-events">
                    ${generateYearEvents(eventsByYear[year])}
                </div>
            </div>`;
    });
    
    chronoHTML += '</div>';
    return chronoHTML;
}

// Generate the arc timeline (new swimlane functionality)
function generateArcTimeline(plans, allEvents) {
    if (!plans || plans.length === 0) {
        return `
            <div class="tl-arc-timeline-container tl-arc-view" id="tl-arc-container" style="display: none;">
                <div class="tl-timeline-empty">
                    <h3>No Story Arcs</h3>
                    <p>No story arcs found to display in timeline.</p>
                </div>
            </div>`;
    }
    
    // Get all years with events for the timeline header
    const years = getAllTimelineYears(allEvents);
    
    let arcHTML = '<div class="tl-arc-timeline-container tl-arc-view" id="tl-arc-container" style="display: none;">';
    
    // ADD THIS: Expand button header
    arcHTML += `
        <div class="tl-arc-header-controls">
            <button class="tl-arc-expand-btn" onclick="toggleArcTimelineExpanded()" title="Expand to full screen">
                <span class="tl-expand-icon">⛶</span>
            </button>
        </div>`;
    
    // Add year header
    if (years.length > 0) {
        arcHTML += generateArcTimelineHeader(years);
    }
    
    // Generate swimlane for each plan
    plans.forEach((plan, planIndex) => {
        if (plan.visible !== false) {
            arcHTML += generateArcSwimlane(plan, planIndex, allEvents, years);
        }
    });
    
    arcHTML += '</div>';
    return arcHTML;
}

// Generate timeline view switcher dropdown
function generateTimelineViewSwitcher() {
    return `
        <div class="tl-view-switcher">
            <label for="timeline-view-select">View:</label>
            <select id="timeline-view-select" class="timeline-view-select" onchange="switchTimelineView(this.value)">
                <option value="chronological">Chronological</option>
                <option value="arc">Arc Swimlanes</option>
            </select>
        </div>`;
}

// Get all years from events for arc timeline header
function getAllTimelineYears(allEvents) {
    const yearSet = new Set();
    
    allEvents.forEach(event => {
        if (event.parsedTiming && event.parsedTiming.year !== null) {
            yearSet.add(event.parsedTiming.year);
        }
    });
    
    // IMPORTANT: Return sorted array for consistent ordering
    return Array.from(yearSet).sort((a, b) => a - b);
}

// Generate year header for arc timeline
function generateArcTimelineHeader(years) {
    let headerHTML = '<div class="tl-arc-header">';
    headerHTML += '<div class="tl-arc-label-column">Arcs</div>';
    headerHTML += '<div class="tl-arc-years-header">';
    
    // IMPORTANT: Generate years in SORTED order to match content
    const sortedYears = [...years].sort((a, b) => a - b);
    sortedYears.forEach(year => {
        headerHTML += `<div class="tl-arc-year-column" data-year="${year}">Year ${year}</div>`;
    });
    
    headerHTML += '</div></div>';
    return headerHTML;
}

// Generate a single arc swimlane
function generateArcSwimlane(plan, planIndex, allEvents, years) {
    const arcColor = plan.color || '#6c757d';
    const arcType = plan.type || '';
    
    let swimlaneHTML = `
        <div class="tl-arc-swimlane" data-arc-index="${planIndex}" style="--arc-color: ${arcColor}">
            <div class="tl-arc-label">
                <div class="tl-arc-title">
                    <span class="tl-arc-link" onclick="openPlanModal(${planIndex})">${plan.title || 'Untitled Arc'}</span>
                </div>
                ${arcType ? `<div class="tl-arc-type-tag">${arcType}</div>` : ''}
            </div>
            <div class="tl-arc-timeline">
                ${generateArcEvents(plan, allEvents, years)}
            </div>
        </div>`;
    
    // Add sub-arcs if they exist (also without character tags)
    if (plan.subArcs && plan.subArcs.length > 0) {
        plan.subArcs.forEach((subArc, subArcIndex) => {
            if (subArc.visible !== false) {
                swimlaneHTML += generateSubArcSwimlane(subArc, planIndex, subArcIndex, allEvents, years, arcColor);
            }
        });
    }
    
    return swimlaneHTML;
}

// Generate a sub-arc swimlane
function generateSubArcSwimlane(subArc, planIndex, subArcIndex, allEvents, years, parentColor) {
    const subArcColor = subArc.color || adjustColorBrightness(parentColor, 30);
    const subArcType = subArc.type || '';
    
    return `
        <div class="tl-arc-swimlane tl-subarc-swimlane" data-arc-index="${planIndex}" data-subarc-index="${subArcIndex}" style="--arc-color: ${subArcColor}">
            <div class="tl-arc-label tl-subarc-label">
                <div class="tl-arc-title tl-subarc-title">
                    &#9500;&#9472; <span class="tl-arc-link" onclick="openPlanModal(${planIndex})">${subArc.title || 'Untitled Sub-Arc'}</span>
                </div>
                ${subArcType ? `<div class="tl-arc-type-tag">${subArcType}</div>` : ''}
            </div>
            <div class="tl-arc-timeline">
                ${generateSubArcEvents(subArc, planIndex, subArcIndex, allEvents, years)}
            </div>
        </div>`;
}

// Generate events within a swimlane positioned as nodes
function generateSwimlaneEvents(events, years) {
    let eventsHTML = '';
        
    // IMPORTANT: Generate year columns for ALL years, not just years with events
    years.forEach(year => {
        
        const yearEvents = events.filter(event => 
            event.parsedTiming && event.parsedTiming.year === year
        );
                
        // ALWAYS create year column, even if no events
        eventsHTML += `<div class="tl-arc-year-column" data-year="${year}">`;
        
        if (yearEvents.length > 0) {
            // Sort events within the year by timing
            yearEvents.sort((a, b) => {
                const aTime = a.parsedTiming;
                const bTime = b.parsedTiming;
                
                // Sort by month, day, hour
                if ((aTime.month || 0) !== (bTime.month || 0)) {
                    return (aTime.month || 0) - (bTime.month || 0);
                }
                if ((aTime.day || 0) !== (bTime.day || 0)) {
                    return (aTime.day || 0) - (bTime.day || 0);
                }
                if ((aTime.hour || 0) !== (bTime.hour || 0)) {
                    return (aTime.hour || 0) - (bTime.hour || 0);
                }
                
                return (a.title || '').localeCompare(b.title || '');
            });
            
            // Group events by exact timing for lane assignment
            const eventLanes = assignEventsToLanes(yearEvents);
            
            // Generate the node container with lanes
            eventsHTML += '<div class="tl-arc-nodes-container">';
            
            // Create lanes
            const maxLanes = Math.max(...eventLanes.map(lane => lane.length));
            for (let laneIndex = 0; laneIndex < maxLanes; laneIndex++) {
                eventsHTML += `<div class="tl-arc-node-lane" data-lane="${laneIndex}">`;
                
                eventLanes.forEach((lane, positionIndex) => {
                    if (lane[laneIndex]) {
                        eventsHTML += generateEventNode(lane[laneIndex], positionIndex, laneIndex);
                    } else if (laneIndex === 0) {
                        // Add spacer for position without any events
                        eventsHTML += '<div class="tl-arc-node-spacer"></div>';
                    }
                });
                
                eventsHTML += '</div>';
            }
            
            eventsHTML += '</div>';
        } else {
            // CRITICAL: Add empty space to maintain column width even with no events
            eventsHTML += '<div class="tl-arc-nodes-container tl-empty-year"></div>';
        }
        
        // ALWAYS close the year column
        eventsHTML += '</div>';
    });
    
    return eventsHTML;
}

// Assign events to lanes based on timing to prevent overlap
function assignEventsToLanes(events) {
    const lanes = [];
    const positionMap = new Map();
    
    // Group events by their timing position
    events.forEach((event, index) => {
        const timingKey = `${event.parsedTiming.month || 0}-${event.parsedTiming.day || 0}-${event.parsedTiming.hour || 0}`;
        
        if (!positionMap.has(timingKey)) {
            positionMap.set(timingKey, []);
        }
        positionMap.get(timingKey).push(event);
    });
    
    // Convert to array of lanes where each position can have multiple events stacked vertically
    const positions = Array.from(positionMap.values());
    const maxEventsAtPosition = Math.max(...positions.map(pos => pos.length));
    
    // Create lane structure: array of positions, each position is an array of events (lanes)
    positions.forEach(positionEvents => {
        const positionLanes = [];
        positionEvents.forEach((event, laneIndex) => {
            positionLanes[laneIndex] = event;
        });
        lanes.push(positionLanes);
    });
    
    return lanes;
}

// Generate a single event node
function generateEventNode(event, positionIndex, laneIndex) {
    const hasNotes = event.notes && event.notes.trim();
    const eventId = `arc-node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate a color variation for this specific event
    // Generate color based on character tags
    const nodeColor = generateCharacterBasedColor(event.characterTags, getCSSVariableValue('--arc-color') || '#6c757d');
    
    // Generate tooltip content with character tags
    const tooltipContent = generateNodeTooltipContent(event);
    
    let nodeHTML = `
        <div class="tl-arc-event-node" 
            style="background-color: ${nodeColor}"
            data-event-id="${eventId}"
            data-position="${positionIndex}"
            data-lane="${laneIndex}"
            ${hasNotes ? `onclick="showEventNotesModal('${eventId}')"` : ''}>
            ${hasNotes ? '<div class="tl-node-notes-indicator">♦</div>' : ''}
            ${tooltipContent}
        </div>`;
    
    // Store event data for modal if needed
    if (hasNotes) {
        nodeHTML += `<script>
            window.eventData = window.eventData || {}; 
            window.eventData['${eventId}'] = ${JSON.stringify({
                title: event.title || 'Untitled Event',
                arcTitle: event.arcTitle || 'Unknown Arc',
                timing: event.parsedTiming.originalText,
                notes: event.notes || '',
                characterTags: event.characterTags || []
            })};
        </script>`;
    }
    
    return nodeHTML;
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

// Generate color variation for event node
function generateNodeColorVariation(baseColor, positionIndex, laneIndex) {
    // Convert hex to HSL for easier manipulation
    const hsl = hexToHsl(baseColor);
    
    // Create variations based on position and lane
    const hueShift = (positionIndex * 15 + laneIndex * 8) % 30 - 15; // Â±15 degrees
    const lightnessShift = (laneIndex * 10 + positionIndex * 5) % 20 - 10; // Â±10%
    
    const newHue = (hsl.h + hueShift + 360) % 360;
    const newLightness = Math.max(20, Math.min(80, hsl.l + lightnessShift));
    
    return `hsl(${newHue}, ${hsl.s}%, ${newLightness}%)`;
}

// Generate tooltip content with character tags using character colors
// Generate tooltip content with character tags using character colors
function generateNodeTooltipContent(event) {
    // Start with event title instead of notes
    let content = event.title || 'Untitled Event';
    
    // Add timing information 
    if (event.parsedTiming && event.parsedTiming.originalText) {
        content += `<div class="tl-tooltip-timing">${event.parsedTiming.originalText}</div>`;
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
    
    return `<div class="tl-node-tooltip">${content}</div>`;
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

// Helper function to get CSS variable value
function getCSSVariableValue(variableName) {
    const computedStyle = getComputedStyle(document.documentElement);
    return computedStyle.getPropertyValue(variableName).trim();
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
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

// Calculate the maximum number of events per year across all arcs
function calculateMaxEventsPerYear(plans, allEvents) {
    const maxEventsPerYear = {};
    
    // Get all years
    const years = getAllTimelineYears(allEvents);
    
    // Initialize all years
    years.forEach(year => {
        maxEventsPerYear[year] = 0;
    });
    
    // Check each plan/arc
    plans.forEach(plan => {
        if (plan.visible !== false) {
            years.forEach(year => {
                // Main arc events for this year
                const mainEvents = allEvents.filter(event => 
                    event.arcTitle === plan.title && 
                    !event.isSubArc && 
                    event.parsedTiming.year === year
                );
                
                maxEventsPerYear[year] = Math.max(maxEventsPerYear[year], mainEvents.length);
                
                // Sub-arc events for this year
                if (plan.subArcs) {
                    plan.subArcs.forEach(subArc => {
                        if (subArc.visible !== false) {
                            const subEvents = allEvents.filter(event => 
                                event.arcTitle.includes(subArc.title) && 
                                event.isSubArc && 
                                event.parsedTiming.year === year
                            );
                            
                            maxEventsPerYear[year] = Math.max(maxEventsPerYear[year], subEvents.length);
                        }
                    });
                }
            });
        }
    });
    
    return maxEventsPerYear;
}

// Generate events for an arc swimlane (calls generateSwimlaneEvents)
function generateArcEvents(plan, allEvents, years) {
    
    const planEvents = allEvents.filter(event => 
        event.arcTitle === plan.title && !event.isSubArc
    );
        
    return generateSwimlaneEvents(planEvents, years);
}

// UPDATED: Generate events for a sub-arc swimlane ensuring ALL years are included  
function generateSubArcEvents(subArc, planIndex, subArcIndex, allEvents, years) {    
    const subArcEvents = allEvents.filter(event => 
        event.arcTitle && event.arcTitle.includes(subArc.title) && event.isSubArc
    );
        
    return generateSwimlaneEvents(subArcEvents, years);
}

// Utility function to adjust color brightness (needed for sub-arc colors)
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



// UPDATE the collectAllEventsWithTiming function to include character moments:
function collectAllEventsWithTiming(plans) {
    const allEvents = [];
    
    plans.forEach(plan => {
        // Main events
        if (plan.events) {
            plan.events.forEach(event => {
                if (event.visible !== false && event.timing && event.timing.trim()) {
                    const parsedTiming = parseTiming(event.timing);
                    if (parsedTiming) {
                        allEvents.push({
                            ...event,
                            arcTitle: plan.title,
                            isSubArc: false,
                            parsedTiming: parsedTiming,
                            characterTags: event.characterTags || [],
                            subevents: event.subevents || event.characterMoments || [] // Include character moments
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
                        if (event.visible !== false && event.timing && event.timing.trim()) {
                            const parsedTiming = parseTiming(event.timing);
                            if (parsedTiming) {
                                allEvents.push({
                                    ...event,
                                    arcTitle: `${plan.title} &rarr; ${subArc.title}`,
                                    isSubArc: true,
                                    parsedTiming: parsedTiming,
                                    characterTags: event.characterTags || [],
                                    subevents: event.subevents || event.characterMoments || [] // Include character moments
                                });
                            }
                        }
                    });
                }
            });
        }
    });
    
    return allEvents;
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
            navHTML += `<div class="timeline-tag-link" onclick="toggleTimelineTag('${tag}')">${tag}</div>`;
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
function parseTiming(timingStr) {
    const timing = {
        hour: null,
        day: null,
        month: null,
        year: null,
        originalText: timingStr.trim()
    };
    
    // Match patterns like "Year 300", "Month 5, Year 300", etc.
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
    
    if (hourMatch) timing.hour = parseInt(hourMatch[1]);
    if (dayMatch) timing.day = parseInt(dayMatch[1]);
    if (monthMatch) timing.month = parseInt(monthMatch[1]);
    if (yearMatch) timing.year = parseInt(yearMatch[1]);
    
    // Must have at least one timing component
    if (timing.hour !== null || timing.day !== null || timing.month !== null || timing.year !== null) {
        return timing;
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

// SINGLE TIMELINE EVENT with debug logging
function generateSingleTimelineEvent(event, index) {
    const markerClass = `tl-timeline-marker ${event.type || 'rising'}`;
    const tooltipText = (event.notes || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const hasNotes = event.notes && event.notes.trim();
    const hasImage = event.image && event.image.trim();
    
    // Get border color for image
    const borderColor = hasImage ? getEventTypeColor(event.type || 'rising') : '';
    
    // Use ALL character tags (stripped of "!") for filtering data attributes
    const allCharacterTagsStripped = event.characterTags ? event.characterTags.map(stripHiddenPrefix).join(',').toLowerCase() : '';
    
    const eventId = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate seasonal background
    const seasonalBg = setSeasonalBackground(event);

    return `
        <div class="tl-timeline-event" 
            data-character-tags="${allCharacterTagsStripped}"
            data-event-type="${event.type || 'rising'}"
            data-year="${event.parsedTiming.year || 0}">
            <div class="tl-event-card" ${seasonalBg} ${hasNotes ? `onclick="showEventNotesModal('${eventId}')" data-event-id="${eventId}"` : ''}>
                <div class="tl-event-arc-title"><span class="tl-arc-link" data-arc-title="${(event.arcTitle || 'Unknown Arc').replace(/"/g, '&quot;')}" onclick="event.stopPropagation(); openPlanModalFromTimeline(this.dataset.arcTitle)">${event.arcTitle || 'Unknown Arc'}</span></div>
                <div class="tl-event-title">${event.title || 'Untitled Event'}</div>
                <div class="tl-event-timing">${event.parsedTiming.originalText}</div>
                ${hasImage ? `<div class="tl-event-image" style="border-color: ${borderColor};"><img src="${event.image}" alt="${event.title}" /></div>` : ''}
                ${hasNotes ? '<div class="tl-chrono-notes-indicator">♦</div>' : ''}
                ${tooltipText ? `<div class="tooltip">${tooltipText}</div>` : ''}
            </div>
            <div class="${markerClass}"></div>
            ${hasNotes ? `<script>window.eventData = window.eventData || {}; window.eventData['${eventId}'] = ${JSON.stringify({
                title: event.title || 'Untitled Event',
                arcTitle: event.arcTitle || 'Unknown Arc',
                timing: event.parsedTiming.originalText,
                notes: event.notes || '',
                characterTags: event.characterTags || []
            })};</script>` : ''}
        </div>`;
}

// Updated generateStackedTimelineEvents function - show only visible character tags
function generateStackedTimelineEvents(events, index) {
    // Collect ALL character tags from stacked events for filtering (stripped of "!")
    const allCharacterTags = new Set();
    events.forEach(event => {
        if (event.characterTags && Array.isArray(event.characterTags)) {
            event.characterTags.forEach(tag => allCharacterTags.add(stripHiddenPrefix(tag)));
        }
    });
    const combinedTagsForFiltering = Array.from(allCharacterTags).join(',').toLowerCase();
    
    // Generate seasonal background for container
    const containerSeasonalBg = setSeasonalBackground(events[0]);

    let stackedHTML = `
        <div class="tl-timeline-event"
            data-character-tags="${combinedTagsForFiltering}"
            data-event-type="${events[0].type || 'rising'}"
            data-year="${events[0].parsedTiming.year || 0}">
            <div class="tl-stacked-events" ${containerSeasonalBg}>`;
    
    events.forEach((event, eventIndex) => {
        const tooltipText = (event.notes || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        const hasNotes = event.notes && event.notes.trim();
        const hasImage = event.image && event.image.trim();
        
        // Get border color for image
        const borderColor = hasImage ? getEventTypeColor(event.type || 'rising') : '';
        
        const eventId = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Individual cards within stacked events are transparent (no seasonal background)
        stackedHTML += `
            <div class="tl-event-card" ${hasNotes ? `onclick="showEventNotesModal('${eventId}')" data-event-id="${eventId}"` : ''}>
                <div class="tl-event-arc-title"><span class="tl-arc-link" data-arc-title="${(event.arcTitle || 'Unknown Arc').replace(/"/g, '&quot;')}" onclick="event.stopPropagation(); openPlanModalFromTimeline(this.dataset.arcTitle)">${event.arcTitle || 'Unknown Arc'}</span></div>
                <div class="tl-event-title">${event.title || 'Untitled Event'}</div>
                <div class="tl-event-timing">${event.parsedTiming.originalText}</div>
                ${hasImage ? `<div class="tl-event-image" style="border-color: ${borderColor};"><img src="${event.image}" alt="${event.title}" /></div>` : ''}
                ${hasNotes ? '<div class="tl-chrono-notes-indicator">♦</div>' : ''}
                ${tooltipText ? `<div class="tooltip">${tooltipText}</div>` : ''}
            </div>
            ${hasNotes ? `<script>window.eventData = window.eventData || {}; window.eventData['${eventId}'] = ${JSON.stringify({
                title: event.title || 'Untitled Event',
                arcTitle: event.arcTitle || 'Unknown Arc',
                timing: event.parsedTiming.originalText,
                notes: event.notes || '',
                characterTags: event.characterTags || []
            })};</script>` : ''}`;
    });
    
    // Use regular diamond marker for stacked events
    const markerClass = `tl-timeline-marker ${events[0].type || 'rising'}`;
    
    stackedHTML += `
            </div>
            <div class="${markerClass}"></div>
        </div>`;
    
    return stackedHTML;
}

// SEASONAL BACKGROUND FUNCTION with debug logging
function setSeasonalBackground(event) {
    
    const month = event.parsedTiming?.month;
    
    // Use same defensive pattern as getEventTypeColor
    const colors = (typeof getColorScheme === 'function') ? getColorScheme() : {
        containerBg: '#ffffff',
        headerBg: '#f8f9fa',
        seasonal: {
            winter: '#e3f2fd',
            spring: '#e8f5e8', 
            summer: '#fff3e0',
            autumn: '#fce4ec'
        }
    };
    
    if (month && month >= 1 && month <= 12) {
        
        const seasonalColor = (typeof getSeasonalColor === 'function') ? 
            getSeasonalColor(month, colors) : colors.containerBg;
        
        const result = `style="--seasonal-bg: ${seasonalColor}"`;
        return result;
    } else {
        const result = `style="--seasonal-bg: ${colors.headerBg}"`;
        return result;
    }
}

function getEventTypeColor(type) {
    // You can access your color scheme here
    const colors = (typeof getColorScheme === 'function') ? getColorScheme() : {};
    
    switch (type) {
        case 'rising':
            return colors.statusCanon || '#28a745';
        case 'setback':
            return colors.statusIdea || '#dc3545';
        case 'climax':
            return colors.statusDraft || '#ffc107';
        default:
            return colors.statusCanon || '#28a745';
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
            
            // Parse timing function - needed for timeline filtering
            window.parseTiming = function(timingStr) {
                const timing = {
                    hour: null,
                    day: null,
                    month: null,
                    year: null,
                    originalText: timingStr.trim()
                };
                
                const patterns = [
                    /Hour\\s+(\\d+)/i,
                    /Day\\s+(\\d+)/i,
                    /Month\\s+(\\d+)/i,
                    /Year\\s+(\\d+)/i
                ];
                
                const hourMatch = timingStr.match(patterns[0]);
                const dayMatch = timingStr.match(patterns[1]);
                const monthMatch = timingStr.match(patterns[2]);
                const yearMatch = timingStr.match(patterns[3]);
                
                if (hourMatch) timing.hour = parseInt(hourMatch[1]);
                if (dayMatch) timing.day = parseInt(dayMatch[1]);
                if (monthMatch) timing.month = parseInt(monthMatch[1]);
                if (yearMatch) timing.year = parseInt(yearMatch[1]);
                
                if (timing.hour !== null || timing.day !== null || timing.month !== null || timing.year !== null) {
                    return timing;
                }
                
                return null;
            };

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
                console.log('🔄 switchPlansView called with:', view);
                
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
                            if (event.visible !== false && event.timing && event.timing.trim()) {
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
                                    if (event.visible !== false && event.timing && event.timing.trim()) {
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

            // Arc timeline expand/collapse functionality
            function toggleArcTimelineExpanded() {
                const container = document.getElementById('tl-arc-container');
                const isExpanded = container.classList.contains('expanded');
                
                if (isExpanded) {
                    container.classList.remove('expanded');
                    document.body.style.overflow = ''; // Restore body scroll
                } else {
                    container.classList.add('expanded');
                    document.body.style.overflow = 'hidden'; // Prevent body scroll
                }
            }

            // Mouse drag scrolling for expanded arc timeline
            function initializeArcTimelineDragScroll() {
                const container = document.getElementById('tl-arc-container');
                if (!container) return;

                let isDown = false;
                let startX, startY, scrollLeft, scrollTop;

                container.addEventListener('mousedown', (e) => {
                    if (!container.classList.contains('expanded')) return;
                    
                    isDown = true;
                    startX = e.pageX - container.offsetLeft;
                    startY = e.pageY - container.offsetTop;
                    scrollLeft = container.scrollLeft;
                    scrollTop = container.scrollTop;
                    e.preventDefault();
                });

                container.addEventListener('mouseleave', () => {
                    isDown = false;
                });

                container.addEventListener('mouseup', () => {
                    isDown = false;
                });

                container.addEventListener('mousemove', (e) => {
                    if (!isDown || !container.classList.contains('expanded')) return;
                    
                    e.preventDefault();
                    const x = e.pageX - container.offsetLeft;
                    const y = e.pageY - container.offsetTop;
                    const walkX = (x - startX) * 2;
                    const walkY = (y - startY) * 2;
                    container.scrollLeft = scrollLeft - walkX;
                    container.scrollTop = scrollTop - walkY;
                });
            }

            // Make functions globally available
            window.toggleArcTimelineExpanded = toggleArcTimelineExpanded;

            // Initialize drag scrolling when page loads
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(() => {
                    initializeArcTimelineDragScroll();
                }, 100);
            });

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
            window.toggleArcTimelineExpanded = toggleArcTimelineExpanded;

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
                const tag = link.textContent;
                if (selectedTimelineTags.has(tag)) {
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
            const arcContainer = document.getElementById('tl-arc-container');
            
            // Determine which view is currently active
            const chronoActive = chronoContainer && chronoContainer.style.display !== 'none';
            const arcActive = arcContainer && arcContainer.style.display !== 'none';
                        
            if (chronoActive && chronoContainer) {
                applyChronologicalFilters(chronoContainer);
            }
            
            if (arcActive && arcContainer) {
                applyArcSwimlaneFilters(arcContainer);
            }
            
            if (!chronoActive && !arcActive) {
                // Default case - try both
                if (chronoContainer) applyChronologicalFilters(chronoContainer);
                if (arcContainer) applyArcSwimlaneFilters(arcContainer);
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

        // FIXED: Arc Swimlanes filtering with proper year range and search support
        function applyArcSwimlaneFilters(arcContainer) {
            
            const swimlanes = arcContainer.querySelectorAll('.tl-arc-swimlane');
            
            swimlanes.forEach((swimlane, swimlaneIndex) => {                
                const arcIndex = parseInt(swimlane.getAttribute('data-arc-index'));
                const subArcIndex = swimlane.getAttribute('data-subarc-index');
                let swimlaneHasVisibleEvents = false;
                                
                // Get the plan/arc for this swimlane
                let plan = null;
                let subArc = null;
                let swimlaneTitle = '';
                
                if (typeof fullInfoData !== 'undefined' && fullInfoData.plans && arcIndex >= 0) {
                    plan = fullInfoData.plans[arcIndex];
                    if (plan) {
                        if (subArcIndex !== null && plan.subArcs && plan.subArcs[parseInt(subArcIndex)]) {
                            // This is a sub-arc
                            subArc = plan.subArcs[parseInt(subArcIndex)];
                            swimlaneTitle = \`\${plan.title} &rarr; \${subArc.title}\`;
                        } else {
                            // This is a main arc
                            swimlaneTitle = plan.title;
                        }
                    }
                }
                                
                // Check if this swimlane should be visible based on plan tags
                let swimlaneMatchesTags = true;
                if (selectedTimelineTags.size > 0 && plan) {
                    if (plan.tags && Array.isArray(plan.tags)) {
                        const planFilterTags = plan.tags;                        
                        if (timelineFilterMode === 'all') {
                            // Plan must have ALL selected tags
                            swimlaneMatchesTags = Array.from(selectedTimelineTags).every(selectedTag => 
                                planFilterTags.some(planTag => 
                                    planTag.toLowerCase().includes(selectedTag.toLowerCase())
                                )
                            );
                        } else {
                            // Plan must have ANY selected tag
                            swimlaneMatchesTags = Array.from(selectedTimelineTags).some(selectedTag => 
                                planFilterTags.some(planTag => 
                                    planTag.toLowerCase().includes(selectedTag.toLowerCase())
                                )
                            );
                        }
                    } else {
                        // No tags on plan means it doesn't match when tags are selected
                        swimlaneMatchesTags = false;
                    }
                }
                                
                // Search filter for the swimlane title
                if (swimlaneMatchesTags && currentTimelineSearch) {
                    const searchableText = swimlaneTitle.toLowerCase();
                    swimlaneMatchesTags = searchableText.includes(currentTimelineSearch);
                }
                
                // If the swimlane doesn't match tags/search, hide the entire thing
                if (!swimlaneMatchesTags) {
                    swimlane.style.display = 'none';
                    return;
                }
                
                // Filter individual event nodes within the swimlane by year range
                const yearColumns = swimlane.querySelectorAll('.tl-arc-year-column');
                
                yearColumns.forEach(yearColumn => {
                    const year = parseInt(yearColumn.getAttribute('data-year'));
                    
                    // Check year range filter
                    const yearInRange = (!timelineYearFrom || year >= timelineYearFrom) && 
                                        (!timelineYearTo || year <= timelineYearTo);
                    
                    
                    if (!yearInRange) {
                        // Hide this entire year column
                        yearColumn.style.display = 'none';
                        return;
                    } else {
                        yearColumn.style.display = '';
                    }
                    
                    // Check if this year column has any visible event nodes
                    const eventNodes = yearColumn.querySelectorAll('.tl-arc-event-node');
                    
                    if (eventNodes.length > 0) {
                        swimlaneHasVisibleEvents = true;
                    }
                    
                    // Additional search filtering on individual nodes (if needed)
                    if (currentTimelineSearch) {
                        eventNodes.forEach(eventNode => {
                            const nodeTooltip = eventNode.querySelector('.tl-node-tooltip');
                            if (nodeTooltip) {
                                const searchableText = nodeTooltip.textContent.toLowerCase();
                                const nodeMatches = searchableText.includes(currentTimelineSearch);
                                
                                if (nodeMatches) {
                                    eventNode.style.display = '';
                                } else {
                                    eventNode.style.display = 'none';
                                }
                            } else {
                                // If no tooltip, check event data
                                const eventId = eventNode.getAttribute('data-event-id');
                                if (eventId && window.eventData && window.eventData[eventId]) {
                                    const eventData = window.eventData[eventId];
                                    const searchableText = [
                                        eventData.title || '',
                                        eventData.notes || ''
                                    ].join(' ').toLowerCase();
                                    
                                    if (searchableText.includes(currentTimelineSearch)) {
                                        eventNode.style.display = '';
                                    } else {
                                        eventNode.style.display = 'none';
                                    }
                                }
                            }
                        });
                    } else {
                        // No search filter, show all nodes in this year
                        eventNodes.forEach(eventNode => {
                            eventNode.style.display = '';
                        });
                    }
                });
                
                // Show/hide entire swimlane based on whether it has any visible events/years
                if (swimlaneHasVisibleEvents) {
                    swimlane.style.display = '';
                } else {
                    swimlane.style.display = 'none';
                }
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
        window.applyArcSwimlaneFilters = applyArcSwimlaneFilters;
        window.checkEventMatchesTags = checkEventMatchesTags;

        //these may not exist anymore, not sure
        window.selectedTimelineTags = selectedTimelineTags;
        window.timelineFilterMode = timelineFilterMode;
        window.currentTimelineSearch = currentTimelineSearch;
        window.timelineYearFrom = timelineYearFrom;
        window.timelineYearTo = timelineYearTo;
     `;
}
