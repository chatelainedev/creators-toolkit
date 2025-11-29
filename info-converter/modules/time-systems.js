// Time Systems Module for Lore Codex
// Manages custom calendar and time systems for story planning

// Current editing state
let currentEditingCalendar = null;
let originalCalendarState = null;
//let userTimeSystems = []; // Will be loaded from backend
// Mini calendar state
let miniCalCurrentMonth = 0;
let miniCalCurrentYear = 2025;
let miniCalSelectedDate = null;
let miniCalEditingEraIndex = -1;

// Initialize on window so it's globally accessible
if (typeof window.userTimeSystems === 'undefined') {
    window.userTimeSystems = [];
}
let userTimeSystems = window.userTimeSystems;

// Default calendar definition (immutable)
const DEFAULT_CALENDAR = {
    id: 'default',
    name: 'Default (Gregorian)',
    isDefault: true,
    calendarType: 'solar',
    months: [
        { name: 'January', days: 31 },
        { name: 'February', days: 28 },
        { name: 'March', days: 31 },
        { name: 'April', days: 30 },
        { name: 'May', days: 31 },
        { name: 'June', days: 30 },
        { name: 'July', days: 31 },
        { name: 'August', days: 31 },
        { name: 'September', days: 30 },
        { name: 'October', days: 31 },
        { name: 'November', days: 30 },
        { name: 'December', days: 31 }
    ],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    epochDay: 0, // Sunday
    timeDivisions: {
        divisionsPerDay: 24,
        minutesPerDivision: 60,
        subdivisionName: 'minutes',
        useDivisionNames: false,
        divisionNames: []
    },
    eras: [
        {
            name: 'Before Common Era',
            abbreviation: 'BCE',
            startDate: { year: -1440, month: 11, day: 16 }, // December 16, 1440 BCE
            isBackward: true
        },
        {
            name: 'Common Era',
            abbreviation: 'CE',
            startDate: { year: 1, month: 0, day: 1 }, // January 1, 1 CE
            isBackward: false
        }
    ],
    endDate: { year: 3000, month: 11, day: 31 }, // December 31, 3000
    seasons: [
        {
            name: 'Spring',
            startDate: { month: 2, day: 20 }, // March 20
            color: '#7BAE9D' // green
        },
        {
            name: 'Summer',
            startDate: { month: 5, day: 21 }, // June 21
            color: '#C5B291' // orange
        },
        {
            name: 'Fall',
            startDate: { month: 8, day: 22 }, // September 22
            color: '#B18484' // red
        },
        {
            name: 'Winter',
            startDate: { month: 11, day: 21 }, // December 21
            color: '#7189AF' // blue
        }
    ],
    moonPhases: {
        enabled: false,
        cycleLength: 29.53,
        epochNewMoon: { year: 1, month: 0, day: 1 } // Use first era start as default
    },
    settings: {
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12'
    }
};

const PRESET_CHINESE_CALENDAR = {
    id: 'preset-chinese',
    name: 'Traditional Chinese',
    isDefault: true, // read-only like Gregorian
    calendarType: 'lunisolar',
    
    months: [
        { name: 'First Month', days: 30 },
        { name: 'Second Month', days: 29 },
        { name: 'Third Month', days: 30 },
        { name: 'Fourth Month', days: 29 },
        { name: 'Fifth Month', days: 30 },
        { name: 'Sixth Month', days: 29 },
        { name: 'Seventh Month', days: 30 },
        { name: 'Eighth Month', days: 29 },
        { name: 'Ninth Month', days: 30 },
        { name: 'Tenth Month', days: 29 },
        { name: 'Eleventh Month', days: 30 },
        { name: 'Twelfth Month', days: 29 }
    ],
    
    weekdays: [], // No weekdays for lunisolar
    
    namedDays: [
        { day: 1, name: 'New Moon' },
        { day: 15, name: 'Full Moon' }
    ],
    
    timeDivisions: {
        divisionsPerDay: 12,
        minutesPerDivision: 120,
        subdivisionName: 'Ke',
        useDivisionNames: true,
        divisionNames: [
            'Hour of the Rat', 'Hour of the Ox', 'Hour of the Tiger',
            'Hour of the Rabbit', 'Hour of the Dragon', 'Hour of the Snake',
            'Hour of the Horse', 'Hour of the Goat', 'Hour of the Monkey',
            'Hour of the Rooster', 'Hour of the Dog', 'Hour of the Pig'
        ]
    },
    
    eras: [
        {
            name: 'Tang Dynasty',
            abbreviation: '唐',
            // Note: Dates are mapped to Gregorian years for simplicity.
            // The actual start would be the first day of the lunar year 618.
            startDate: { year: 618, month: 0, day: 1 },
            endDate: { year: 907, month: 11, day: 29 }, // Using a generic end-of-last-month
            isBackward: false
        },
        {
            name: 'Song Dynasty',
            abbreviation: '宋',
            startDate: { year: 960, month: 0, day: 1 },
            endDate: { year: 1279, month: 11, day: 29 },
            isBackward: false
        },
        {
            name: 'Yuan Dynasty',
            abbreviation: '元',
            startDate: { year: 1271, month: 0, day: 1 },
            endDate: { year: 1368, month: 11, day: 29 },
            isBackward: false
        },
        {
            name: 'Ming Dynasty',
            abbreviation: '明',
            startDate: { year: 1368, month: 0, day: 1 },
            endDate: { year: 1644, month: 11, day: 29 },
            isBackward: false
        },
        {
            name: 'Qing Dynasty',
            abbreviation: '清',
            startDate: { year: 1644, month: 0, day: 1 },
            endDate: { year: 1912, month: 11, day: 29 },
            isBackward: false
        },
        {
            name: 'Republic of China',
            abbreviation: '民国',
            startDate: { year: 1912, month: 0, day: 1 },
            endDate: { year: 1949, month: 11, day: 29 },
            isBackward: false
        },
        {
            name: 'Modern Era',
            abbreviation: '现', // Abbreviation for Xiàndài (现代)
            startDate: { year: 1949, month: 0, day: 1 },
            // No endDate, as this era continues to the present
            isBackward: false
        }
    ],
    
    endDate: { year: 3000, month: 11, day: 29 },
    
    seasons: [
        {
            name: 'Spring',
            // Starts on the first day of the First Month (正月)
            startDate: { month: 0, day: 1 }, 
            color: '#82B193' // wood green
        },
        {
            name: 'Summer',
            // Starts on the first day of the Fourth Month (四月)
            startDate: { month: 3, day: 1 },
            color: '#BFA18B' // fire orange
        },
        {
            name: 'Autumn',
            // Starts on the first day of the Seventh Month (七月)
            startDate: { month: 6, day: 1 },
            color: '#AB997C' // metal gold
        },
        {
            name: 'Winter',
            // Starts on the first day of the Tenth Month (十月)
            startDate: { month: 9, day: 1 },
            color: '#B1C0D3' // water blue
        }
    ],
    
    moonPhases: {
        enabled: true,
        cycleLength: 29.53,
        epochNewMoon: { year: 1, month: 0, day: 1 }
    },
    
    settings: {
        dateFormat: 'MMMM D, YYYY',
        timeFormat: 'custom'
    }
};

// Initialize time systems
async function initializeTimeSystems() {
    console.log('Initializing Time Systems...');
    
    // Load user's custom calendars from backend
    await loadUserTimeSystems();
    
    // Set up event listeners
    setupTimeSystemsEventListeners();
    
    console.log('Time Systems initialized');
}

// Load user's time systems from backend
async function loadUserTimeSystems() {
    try {
        // Get user context from session manager
        const userContext = window.userSessionManager ? 
            window.userSessionManager.getUserContext() : 
            { isGuest: true };
        
        const response = await fetch('/api/time-systems/load', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userContext })
        });
        
        if (response.ok) {
            const data = await response.json();
            window.userTimeSystems = data.timeSystems || [];
            userTimeSystems = window.userTimeSystems;
            console.log('Loaded user time systems:', userTimeSystems.length);
        } else {
            console.log('No existing time systems, starting fresh');
            userTimeSystems = [];
        }
    } catch (error) {
        console.error('Error loading time systems:', error);
        userTimeSystems = [];
    }
}

// Save user's time systems to backend
async function saveUserTimeSystems() {
    try {
        // Get user context from session manager
        const userContext = window.userSessionManager ? 
            window.userSessionManager.getUserContext() : 
            { isGuest: true };
        
        const response = await fetch('/api/time-systems/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                timeSystems: userTimeSystems,
                userContext 
            })
        });
        
        if (response.ok) {
            console.log('Time systems saved successfully');
            return true;
        } else {
            console.error('Failed to save time systems');
            return false;
        }
    } catch (error) {
        console.error('Error saving time systems:', error);
        return false;
    }
}

// Set up event listeners
function setupTimeSystemsEventListeners() {
    // Open Time Systems Editor button (from Plans Options modal)
    const openEditorBtn = document.getElementById('open-time-systems-editor');
    if (openEditorBtn) {
        openEditorBtn.addEventListener('click', openTimeSystemsEditor);
    }
    
    // Manage Calendars button (in editor sidebar)
    const manageCalendarsBtn = document.getElementById('manage-calendars-btn');
    if (manageCalendarsBtn) {
        manageCalendarsBtn.addEventListener('click', openManageCalendarsModal);
    }
    
    // Create New Calendar button (in Manage Calendars modal)
    const createCalendarBtn = document.getElementById('create-new-calendar-btn');
    if (createCalendarBtn) {
        createCalendarBtn.addEventListener('click', createNewCalendar);
    }
    
    // Calendar selector dropdown
    const calendarSelector = document.getElementById('calendar-selector');
    if (calendarSelector) {
        calendarSelector.addEventListener('change', loadCalendarForEditing);
    }
    
    // Navigation items
    document.querySelectorAll('.time-systems-nav-item').forEach(item => {
        item.addEventListener('click', function() {
            switchTimeSystemSection(this.dataset.section);
        });
    });
    
    // Add Month button
    const addMonthBtn = document.getElementById('add-month-btn');
    if (addMonthBtn) {
        addMonthBtn.addEventListener('click', addMonth);
    }
    
    // Add Weekday button
    const addWeekdayBtn = document.getElementById('add-weekday-btn');
    if (addWeekdayBtn) {
        addWeekdayBtn.addEventListener('click', addWeekday);
    }
    
    // Use division names checkbox
    const useDivisionNamesCheckbox = document.getElementById('use-division-names');
    if (useDivisionNamesCheckbox) {
        useDivisionNamesCheckbox.addEventListener('change', toggleDivisionNames);
    }
    
    // Divisions per day input
    const divisionsPerDayInput = document.getElementById('divisions-per-day');
    if (divisionsPerDayInput) {
        divisionsPerDayInput.addEventListener('change', updateDivisionNamesInputs);
    }

    // Add Season button
    const addSeasonBtn = document.getElementById('add-season-btn');
    if (addSeasonBtn) {
        addSeasonBtn.addEventListener('click', addSeason);
    }
    
    // Date format selector
    const dateFormatSelect = document.getElementById('date-format');
    if (dateFormatSelect) {
        dateFormatSelect.addEventListener('change', updateDateFormatPreview);
    }
    
    // Time format selector
    const timeFormatSelect = document.getElementById('time-format');
    if (timeFormatSelect) {
        timeFormatSelect.addEventListener('change', updateTimeFormatPreview);
    }
    
    // Save Time System button
    const saveTimeSystemBtn = document.getElementById('save-time-system');
    if (saveTimeSystemBtn) {
        saveTimeSystemBtn.addEventListener('click', saveCurrentTimeSystem);
    }
}

// Open Time Systems Editor
function openTimeSystemsEditor() {
    populateCalendarSelector();
    
    // Set the selector to the currently selected time system from Plans Options
    const selectedSystem = infoData.plansOptions?.selectedTimeSystemId || 'default';
    document.getElementById('calendar-selector').value = selectedSystem;
    
    loadCalendarForEditing();
    // Store original state
    originalCalendarState = JSON.parse(JSON.stringify(currentEditingCalendar));
    openModal('timeSystemsEditorModal');
}

// Add new function for Cancel
function cancelTimeSystemEdits() {
    if (originalCalendarState) {
        // Restore original state
        currentEditingCalendar = JSON.parse(JSON.stringify(originalCalendarState));
    }
    closeModal('timeSystemsEditorModal');
}

// Populate the calendar selector dropdown
function populateCalendarSelector() {
    const selector = document.getElementById('calendar-selector');
    selector.innerHTML = `
        <option value="default">Default (Gregorian)</option>
        <option value="preset-chinese">Traditional Chinese</option>
    `;
    
    userTimeSystems.forEach(calendar => {
        const option = document.createElement('option');
        option.value = calendar.id;
        option.textContent = calendar.name;
        selector.appendChild(option);
    });
}

// Populate time systems dropdown in Plans Options modal
// Populate time systems dropdown in Plans Options modal
function populateTimeSystemsDropdown() {
    const dropdown = document.getElementById('plans-time-system');
    dropdown.innerHTML = `
        <option value="default">Default (Gregorian)</option>
        <option value="preset-chinese">Traditional Chinese</option>
    `;
    
    userTimeSystems.forEach(calendar => {
        const option = document.createElement('option');
        option.value = calendar.id;
        option.textContent = calendar.name;
        dropdown.appendChild(option);
    });
}

// Load a calendar for editing
function loadCalendarForEditing() {
    const selectedId = document.getElementById('calendar-selector').value;
    
    if (selectedId === 'default') {
        currentEditingCalendar = JSON.parse(JSON.stringify(DEFAULT_CALENDAR));
    } else if (selectedId === 'preset-chinese') {
        currentEditingCalendar = JSON.parse(JSON.stringify(PRESET_CHINESE_CALENDAR));
    } else {
        const calendar = userTimeSystems.find(c => c.id === selectedId);
        if (calendar) {
            currentEditingCalendar = JSON.parse(JSON.stringify(calendar));
        }
    }
    
    // Update title
    const title = document.getElementById('time-systems-editor-title');
    if (currentEditingCalendar.isDefault) {
        title.textContent = `Time Systems Editor (Viewing ${currentEditingCalendar.name} - Read Only)`;
    } else {
        title.textContent = `Time Systems Editor - ${currentEditingCalendar.name}`;
    }
    
    // Refresh all sections
    refreshAllSections();
}

// Refresh all sections with current calendar data
function refreshAllSections() {
    renderOverview();
    renderMonths();
    renderWeeks();
    renderDays();
    renderEras();
    renderSeasons();
    renderMoonPhases(); // ADD THIS
    renderSettings();
}

// Switch between sections
function switchTimeSystemSection(section) {
    // Update nav items
    document.querySelectorAll('.time-systems-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.time-systems-nav-item').classList.add('active');
    
    // Update content sections
    document.querySelectorAll('.time-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(`time-section-${section}`).style.display = 'block';
}

// ============================================================================
// OVERVIEW SECTION
// ============================================================================

function renderOverview() {
    const container = document.getElementById('time-overview-display');
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create calendar name display (no heading since it's already in HTML)
    const nameDisplay = document.createElement('div');
    nameDisplay.className = 'calendar-name-display';
    nameDisplay.textContent = currentEditingCalendar.name;
    container.appendChild(nameDisplay);
    
    // Calculate stats
    const totalDays = currentEditingCalendar.months.reduce((sum, month) => sum + month.days, 0);
    const avgMonthLength = (totalDays / currentEditingCalendar.months.length).toFixed(1);
    const weeksPerYear = (totalDays / currentEditingCalendar.weekdays.length).toFixed(1);
    const minutesPerDay = currentEditingCalendar.timeDivisions.divisionsPerDay * currentEditingCalendar.timeDivisions.minutesPerDivision;
    
    // Create prominent stats row
    const statsRow = document.createElement('div');
    statsRow.className = 'overview-stats-row';
    statsRow.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${currentEditingCalendar.timeDivisions.divisionsPerDay}</div>
            <div class="stat-label">Hours per Day</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${currentEditingCalendar.weekdays.length}</div>
            <div class="stat-label">Days per Week</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${currentEditingCalendar.months.length}</div>
            <div class="stat-label">Months per Year</div>
        </div>
    `;
    container.appendChild(statsRow);
    
    // Create regular info blocks container
    const blocksContainer = document.createElement('div');
    blocksContainer.className = 'overview-blocks';
    
    // Calculate additional stats
    const hoursPerWeek = currentEditingCalendar.timeDivisions.divisionsPerDay * currentEditingCalendar.weekdays.length;
    const hoursPerMonth = ((totalDays * currentEditingCalendar.timeDivisions.divisionsPerDay) / currentEditingCalendar.months.length).toFixed(1);

    // Add the other info blocks
    const blocks = [
        { label: 'Days per Year', value: totalDays },
        { label: 'Weeks per Year', value: weeksPerYear },
        { label: 'Hours per Week', value: hoursPerWeek.toLocaleString() },
        { label: 'Hours per Month', value: hoursPerMonth.toLocaleString() },
        { label: 'Average Month Length', value: `${avgMonthLength} days` },
        { label: 'Minutes per Day', value: minutesPerDay.toLocaleString() },
        { label: 'Minutes per Division', value: currentEditingCalendar.timeDivisions.minutesPerDivision },
        { label: 'Subdivision Name', value: currentEditingCalendar.timeDivisions.subdivisionName || 'minutes' },
        { label: 'Number of Eras', value: currentEditingCalendar.eras.length }
    ];
    
    blocks.forEach(block => {
        const blockDiv = document.createElement('div');
        blockDiv.className = 'overview-block';
        blockDiv.innerHTML = `
            <div class="block-label">${block.label}</div>
            <div class="block-value">${block.value}</div>
        `;
        blocksContainer.appendChild(blockDiv);
    });
    
    container.appendChild(blocksContainer);
    
    // Add date range at the bottom if it exists
    if (currentEditingCalendar.endDate) {
        const dateRangeDisplay = document.createElement('div');
        dateRangeDisplay.className = 'date-range-display';
        
        const firstEra = currentEditingCalendar.eras[0];
        const startMonth = currentEditingCalendar.months[firstEra.startDate.month];
        const endMonth = currentEditingCalendar.months[currentEditingCalendar.endDate.month];
        
        dateRangeDisplay.innerHTML = `
            <span class="date-range-text">
                ${startMonth.name} ${firstEra.startDate.day}, ${firstEra.startDate.year} 
                <span class="date-range-separator">→</span> 
                ${endMonth.name} ${currentEditingCalendar.endDate.day}, ${currentEditingCalendar.endDate.year}
            </span>
        `;
        
        container.appendChild(dateRangeDisplay);
    }
}

// ============================================================================
// MONTHS SECTION
// ============================================================================

function renderMonths() {
    const container = document.getElementById('months-list');
    container.innerHTML = '';
    
    currentEditingCalendar.months.forEach((month, index) => {
        const item = createMonthItem(month, index);
        container.appendChild(item);
    });
    
    setupMonthsDragAndDrop();
}

function createMonthItem(month, index) {
    const div = document.createElement('div');
    div.className = 'time-item';
    div.dataset.index = index;
    div.draggable = !currentEditingCalendar.isDefault;
    
    const canEdit = !currentEditingCalendar.isDefault;
    
    div.innerHTML = `
        <span class="time-item-drag-handle"><i class="fas fa-grip-vertical"></i></span>
        <div class="time-item-content">
            <input type="text" value="${month.name}" 
                   onchange="updateMonthName(${index}, this.value)"
                   ${canEdit ? '' : 'readonly'}
                   style="flex: 1;">
            <input type="number" value="${month.days}" min="1" max="999"
                   onchange="updateMonthDays(${index}, this.value)"
                   ${canEdit ? '' : 'readonly'}
                   style="width: 80px;">
            <span style="color: var(--text-muted);">days</span>
        </div>
        ${canEdit ? `<span class="time-item-delete" onclick="deleteMonth(${index})"><i class="fas fa-trash"></i></span>` : ''}
    `;
    
    return div;
}

function addMonth() {
    if (currentEditingCalendar.isDefault) return;
    
    currentEditingCalendar.months.push({
        name: `Month ${currentEditingCalendar.months.length + 1}`,
        days: 30
    });
    
    renderMonths();
    renderOverview();
}

function updateMonthName(index, newName) {
    if (currentEditingCalendar.isDefault) return;
    currentEditingCalendar.months[index].name = newName;
    renderOverview();
}

function updateMonthDays(index, newDays) {
    if (currentEditingCalendar.isDefault) return;
    const days = parseInt(newDays) || 30;
    currentEditingCalendar.months[index].days = days;
    
    // Check if any era dates need adjustment due to this month now having fewer days
    currentEditingCalendar.eras.forEach(era => {
        if (era.startDate.month === index && era.startDate.day > days) {
            era.startDate.day = days;
        }
    });
    
    // Check end date
    if (currentEditingCalendar.endDate && 
        currentEditingCalendar.endDate.month === index && 
        currentEditingCalendar.endDate.day > days) {
        currentEditingCalendar.endDate.day = days;
    }
    
    renderOverview();
    renderEras(); // Re-render in case dates were adjusted
}

function deleteMonth(index) {
    if (currentEditingCalendar.isDefault) return;
    if (currentEditingCalendar.months.length <= 1) {
        alert('Cannot delete the last month!');
        return;
    }
    
    // Remove the month
    currentEditingCalendar.months.splice(index, 1);
    
    // Adjust all era dates and end date
    adjustDatesAfterMonthChange(index, 'delete');
    
    renderMonths();
    renderOverview();
    renderEras(); // Re-render eras to show updated dates
}

function adjustDatesAfterMonthChange(deletedIndex, action) {
    // Adjust era start dates
    currentEditingCalendar.eras.forEach(era => {
        if (action === 'delete') {
            if (era.startDate.month === deletedIndex) {
                // The month this era references was deleted
                // Move to the previous month, or next if it's the first
                era.startDate.month = deletedIndex > 0 ? deletedIndex - 1 : 0;
                
                // Adjust day if it exceeds the new month's days
                const newMonthDays = currentEditingCalendar.months[era.startDate.month].days;
                if (era.startDate.day > newMonthDays) {
                    era.startDate.day = newMonthDays;
                }
            } else if (era.startDate.month > deletedIndex) {
                // This month is after the deleted one, so decrement the index
                era.startDate.month--;
            }
        }
    });
    
    // Adjust end date
    if (currentEditingCalendar.endDate) {
        if (action === 'delete') {
            if (currentEditingCalendar.endDate.month === deletedIndex) {
                // Move to the previous month, or next if it's the first
                currentEditingCalendar.endDate.month = deletedIndex > 0 ? deletedIndex - 1 : 0;
                
                // Adjust day if it exceeds the new month's days
                const newMonthDays = currentEditingCalendar.months[currentEditingCalendar.endDate.month].days;
                if (currentEditingCalendar.endDate.day > newMonthDays) {
                    currentEditingCalendar.endDate.day = newMonthDays;
                }
            } else if (currentEditingCalendar.endDate.month > deletedIndex) {
                currentEditingCalendar.endDate.month--;
            }
        }
    }
}

function adjustDatesAfterMonthReorder(fromIndex, toIndex) {
    // Helper function to adjust a single month index
    const adjustMonthIndex = (monthIndex) => {
        if (monthIndex === fromIndex) {
            return toIndex;
        } else if (fromIndex < toIndex) {
            // Moving forward: indices between from and to shift back
            if (monthIndex > fromIndex && monthIndex <= toIndex) {
                return monthIndex - 1;
            }
        } else {
            // Moving backward: indices between to and from shift forward
            if (monthIndex >= toIndex && monthIndex < fromIndex) {
                return monthIndex + 1;
            }
        }
        return monthIndex;
    };
    
    // Adjust all era dates
    currentEditingCalendar.eras.forEach(era => {
        era.startDate.month = adjustMonthIndex(era.startDate.month);
    });
    
    // Adjust end date
    if (currentEditingCalendar.endDate) {
        currentEditingCalendar.endDate.month = adjustMonthIndex(currentEditingCalendar.endDate.month);
    }
}

function setupMonthsDragAndDrop() {
    if (currentEditingCalendar.isDefault) return;
    
    const container = document.getElementById('months-list');
    const items = container.querySelectorAll('.time-item');
    
    items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
    });
}

// ============================================================================
// WEEKS SECTION
// ============================================================================

function renderWeeks() {
    const canEdit = !currentEditingCalendar.isDefault;
    
    // Initialize calendarType if it doesn't exist
    if (!currentEditingCalendar.calendarType) {
        currentEditingCalendar.calendarType = 'solar';
    }
    
    // Initialize namedDays if using lunisolar/lunar
    if ((currentEditingCalendar.calendarType === 'lunisolar' || currentEditingCalendar.calendarType === 'lunar') 
        && !currentEditingCalendar.namedDays) {
        currentEditingCalendar.namedDays = [];
    }
    
    const container = document.getElementById('weekdays-list');
    container.innerHTML = '';
    
    // Calendar type selector
    const typeSelector = document.createElement('div');
    typeSelector.style.marginBottom = 'var(--space-lg)';
    typeSelector.innerHTML = `
        <label><strong>Calendar Type:</strong></label>
        <div style="display: flex; gap: var(--space-md); margin-top: var(--space-sm); flex-wrap: wrap;">
            <label>
                <input type="radio" name="calendar-type" value="solar" 
                    ${currentEditingCalendar.calendarType === 'solar' ? 'checked' : ''}
                    ${canEdit ? '' : 'disabled'}
                    onchange="changeCalendarType('solar')">
                Solar (Weekdays)
            </label>
            <label>
                <input type="radio" name="calendar-type" value="lunisolar" 
                    ${currentEditingCalendar.calendarType === 'lunisolar' || currentEditingCalendar.calendarType === 'lunar' ? 'checked' : ''}
                    ${canEdit ? '' : 'disabled'}
                    onchange="changeCalendarType('lunisolar')">
                Lunisolar (Numbered days)
            </label>
        </div>
        <div class="helper-text">
            Solar: Days repeat in weekly cycles (like Gregorian)<br>
            Lunisolar: Numbered days based on moon phases (like Chinese)
        </div>
    `;
    container.appendChild(typeSelector);
    
    // Render based on calendar type
    if (currentEditingCalendar.calendarType === 'solar') {
        renderWeekdaysSection(container, canEdit);
    } else {
        renderNamedDaysSection(container, canEdit);
    }
}

function renderWeekdaysSection(container, canEdit) {
    // This is your existing weekdays UI
    const weekdaysDiv = document.createElement('div');
    weekdaysDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md); margin-top: var(--space-md);">
            <h4>Weekdays</h4>
            ${canEdit ? '<button id="add-weekday-btn" class="btn-add">+ Add Day</button>' : ''}
        </div>
        <div style="margin-bottom: var(--space-md);">
            <label for="epoch-day">Epoch Day (First day of Year 1):</label>
            <select id="epoch-day"></select>
            <div class="helper-text">Which weekday does the first year start on?</div>
        </div>
        <div id="weekdays-list-items" class="time-items-list"></div>
    `;
    container.appendChild(weekdaysDiv);
    
    // Populate weekdays list
    const weekdaysList = document.getElementById('weekdays-list-items');
    currentEditingCalendar.weekdays.forEach((day, index) => {
        const item = createWeekdayItem(day, index);
        weekdaysList.appendChild(item);
    });
    
    if (currentEditingCalendar.weekdays.length === 0) {
        weekdaysList.innerHTML = '<div class="empty-state">No weekdays defined. Add your first day above!</div>';
    }
    
    // Set up epoch day dropdown
    updateEpochDayDropdown();
    
    // Set up drag and drop for weekdays
    if (canEdit) {
        setupWeekdaysDragAndDrop();
        
        const addBtn = document.getElementById('add-weekday-btn');
        if (addBtn) {
            addBtn.onclick = addWeekday;
        }
    }
}

function renderNamedDaysSection(container, canEdit) {
    const maxDays = Math.max(...currentEditingCalendar.months.map(m => m.days));
    
    const namedDaysDiv = document.createElement('div');
    namedDaysDiv.style.marginTop = 'var(--space-md)';
    namedDaysDiv.innerHTML = `
        <p style="margin-bottom: var(--space-md);">Days are numbered 1-${maxDays} (no repeating weekdays)</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin: var(--space-md) 0;">
            <h4>Special Day Names</h4>
            ${canEdit ? '<button id="add-named-day-btn" class="btn-add">+ Add Named Day</button>' : ''}
        </div>
        <div class="helper-text">Optionally give names to specific days (e.g., Day 1 = "New Moon", Day 15 = "Full Moon")</div>
        <div id="named-days-list-items" class="time-items-list"></div>
    `;
    container.appendChild(namedDaysDiv);
    
    // Populate named days list
    const namedDaysList = document.getElementById('named-days-list-items');
    const sortedNamedDays = [...currentEditingCalendar.namedDays].sort((a, b) => a.day - b.day);
    
    sortedNamedDays.forEach((namedDay, index) => {
        const item = createNamedDayItem(namedDay, index);
        namedDaysList.appendChild(item);
    });
    
    if (currentEditingCalendar.namedDays.length === 0) {
        namedDaysList.innerHTML = '<div class="empty-state">No special day names defined.</div>';
    }
    
    // Set up add button
    if (canEdit) {
        const addBtn = document.getElementById('add-named-day-btn');
        if (addBtn) {
            addBtn.onclick = addNamedDay;
        }
    }
}

function changeCalendarType(newType) {
    if (currentEditingCalendar.isDefault) return;
    
    currentEditingCalendar.calendarType = newType;
    
    // Initialize appropriate structure
    if (newType === 'solar') {
        if (!currentEditingCalendar.weekdays || currentEditingCalendar.weekdays.length === 0) {
            currentEditingCalendar.weekdays = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
        }
        if (currentEditingCalendar.epochDay === undefined) {
            currentEditingCalendar.epochDay = 0;
        }
    } else {
        // lunisolar or lunar
        if (!currentEditingCalendar.namedDays) {
            currentEditingCalendar.namedDays = [];
        }
    }
    
    renderWeeks();
    renderOverview();
}

function createNamedDayItem(namedDay, index) {
    const div = document.createElement('div');
    div.className = 'time-item';
    const canEdit = !currentEditingCalendar.isDefault;
    
    div.innerHTML = `
        <div class="time-item-content" style="flex: 1; display: flex; gap: var(--space-sm); align-items: baseline;">
            <label for="named-day-num-${index}" style="min-width: 80px; font-weight: 500;">Day Number:</label>
            <input type="number" 
                   id="named-day-num-${index}"
                   value="${namedDay.day}" 
                   min="1"
                   max="${Math.max(...currentEditingCalendar.months.map(m => m.days))}"
                   onchange="updateNamedDayNumber(${index}, parseInt(this.value))"
                   ${canEdit ? '' : 'readonly'}
                   style="width: 80px;">
            <input type="text" 
                   value="${namedDay.name}" 
                   onchange="updateNamedDayName(${index}, this.value)"
                   ${canEdit ? '' : 'readonly'}
                   placeholder="Day name"
                   style="flex: 1;">
        </div>
        ${canEdit ? `<span class="time-item-delete" onclick="deleteNamedDay(${index})"><i class="fas fa-trash"></i></span>` : ''}
    `;
    
    return div;
}

function addNamedDay() {
    if (currentEditingCalendar.isDefault) return;
    
    currentEditingCalendar.namedDays.push({
        day: 1,
        name: 'Special Day'
    });
    
    renderWeeks();
}

function updateNamedDayNumber(index, newDay) {
    if (currentEditingCalendar.isDefault) return;
    currentEditingCalendar.namedDays[index].day = newDay;
    renderWeeks(); // Re-render to re-sort
}

function updateNamedDayName(index, newName) {
    if (currentEditingCalendar.isDefault) return;
    currentEditingCalendar.namedDays[index].name = newName;
}

function deleteNamedDay(index) {
    if (currentEditingCalendar.isDefault) return;
    currentEditingCalendar.namedDays.splice(index, 1);
    renderWeeks();
}

function createWeekdayItem(day, index) {
    const div = document.createElement('div');
    div.className = 'time-item';
    div.dataset.index = index;
    div.draggable = !currentEditingCalendar.isDefault;
    
    const canEdit = !currentEditingCalendar.isDefault;
    
    div.innerHTML = `
        <span class="time-item-drag-handle"><i class="fas fa-grip-vertical"></i></span>
        <div class="time-item-content">
            <input type="text" value="${day}" 
                   onchange="updateWeekdayName(${index}, this.value)"
                   ${canEdit ? '' : 'readonly'}
                   style="flex: 1;">
        </div>
        ${canEdit ? `<span class="time-item-delete" onclick="deleteWeekday(${index})"><i class="fas fa-trash"></i></span>` : ''}
    `;
    
    return div;
}

function addWeekday() {
    if (currentEditingCalendar.isDefault) return;
    
    currentEditingCalendar.weekdays.push(`Day ${currentEditingCalendar.weekdays.length + 1}`);
    renderWeeks();
    renderOverview();
}

function updateWeekdayName(index, newName) {
    if (currentEditingCalendar.isDefault) return;
    currentEditingCalendar.weekdays[index] = newName;
    renderOverview();
}

function deleteWeekday(index) {
    if (currentEditingCalendar.isDefault) return;
    if (currentEditingCalendar.weekdays.length <= 1) {
        alert('Cannot delete the last weekday!');
        return;
    }
    currentEditingCalendar.weekdays.splice(index, 1);
    renderWeeks();
    renderOverview();
}

function updateEpochDayDropdown() {
    const select = document.getElementById('epoch-day');
    select.innerHTML = '';
    
    currentEditingCalendar.weekdays.forEach((day, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = day;
        select.appendChild(option);
    });
    
    select.value = currentEditingCalendar.epochDay || 0;
    select.disabled = currentEditingCalendar.isDefault;
    
    select.onchange = function() {
        if (!currentEditingCalendar.isDefault) {
            currentEditingCalendar.epochDay = parseInt(this.value);
        }
    };
}

function setupWeekdaysDragAndDrop() {
    if (currentEditingCalendar.isDefault) return;
    
    const container = document.getElementById('weekdays-list');
    const items = container.querySelectorAll('.time-item');
    
    items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
    });
}

// ============================================================================
// DAYS/TIME DIVISIONS SECTION
// ============================================================================

function renderDays() {
    const div = currentEditingCalendar.timeDivisions;
    const canEdit = !currentEditingCalendar.isDefault;
    
    document.getElementById('divisions-per-day').value = div.divisionsPerDay;
    document.getElementById('divisions-per-day').disabled = !canEdit;
    
    document.getElementById('minutes-per-division').value = div.minutesPerDivision;
    document.getElementById('minutes-per-division').disabled = !canEdit;
    
    document.getElementById('subdivision-name').value = div.subdivisionName || '';
    document.getElementById('subdivision-name').disabled = !canEdit;
    
    document.getElementById('use-division-names').checked = div.useDivisionNames || false;
    document.getElementById('use-division-names').disabled = !canEdit;
    
    if (div.useDivisionNames) {
        document.getElementById('division-names-section').style.display = 'block';
        renderDivisionNames();
    } else {
        document.getElementById('division-names-section').style.display = 'none';
    }
    
    // Add change listeners
    document.getElementById('divisions-per-day').onchange = function() {
        if (!canEdit) return;
        currentEditingCalendar.timeDivisions.divisionsPerDay = parseInt(this.value) || 24;
        renderOverview();
        if (currentEditingCalendar.timeDivisions.useDivisionNames) {
            updateDivisionNamesInputs();
        }
    };
    
    document.getElementById('minutes-per-division').onchange = function() {
        if (!canEdit) return;
        currentEditingCalendar.timeDivisions.minutesPerDivision = parseInt(this.value) || 60;
        renderOverview();
    };
    
    document.getElementById('subdivision-name').onchange = function() {
        if (!canEdit) return;
        currentEditingCalendar.timeDivisions.subdivisionName = this.value;
        renderOverview();
    };
}

function toggleDivisionNames() {
    if (currentEditingCalendar.isDefault) return;
    
    const checked = document.getElementById('use-division-names').checked;
    currentEditingCalendar.timeDivisions.useDivisionNames = checked;
    
    if (checked) {
        document.getElementById('division-names-section').style.display = 'block';
        updateDivisionNamesInputs();
    } else {
        document.getElementById('division-names-section').style.display = 'none';
    }
}

function updateDivisionNamesInputs() {
    if (currentEditingCalendar.isDefault) return;
    
    const count = currentEditingCalendar.timeDivisions.divisionsPerDay;
    const container = document.getElementById('division-names-list');
    
    // Ensure divisionNames array exists and has correct length
    if (!currentEditingCalendar.timeDivisions.divisionNames) {
        currentEditingCalendar.timeDivisions.divisionNames = [];
    }
    
    while (currentEditingCalendar.timeDivisions.divisionNames.length < count) {
        currentEditingCalendar.timeDivisions.divisionNames.push('');
    }
    
    currentEditingCalendar.timeDivisions.divisionNames = 
        currentEditingCalendar.timeDivisions.divisionNames.slice(0, count);
    
    renderDivisionNames();
}

function renderDivisionNames() {
    const container = document.getElementById('division-names-list');
    container.innerHTML = '';
    
    currentEditingCalendar.timeDivisions.divisionNames.forEach((name, index) => {
        const div = document.createElement('div');
        div.style.marginBottom = 'var(--space-xs)';
        div.innerHTML = `
            <label style="display: flex; align-items: center; gap: var(--space-xs);">
                <span style="width: 80px;">Division ${index}:</span>
                <input type="text" value="${name}" 
                       onchange="updateDivisionName(${index}, this.value)"
                       placeholder="e.g., Dawn Watch, 子时"
                       style="flex: 1;">
            </label>
        `;
        container.appendChild(div);
    });
}

function updateDivisionName(index, newName) {
    if (currentEditingCalendar.isDefault) return;
    currentEditingCalendar.timeDivisions.divisionNames[index] = newName;
}

// ============================================================================
// ERAS SECTION
// ============================================================================

// ============================================================================
// ERA TIMELINE VISUALIZATION
// ============================================================================

function renderEraTimeline() {
    // Calculate the duration of each era in years
    const eraData = [];
    const eras = currentEditingCalendar.eras;
    const endDate = currentEditingCalendar.endDate || { year: 3000, month: 11, day: 31 };
    
    // Separate backward and forward eras
    const backwardEra = eras[0]?.isBackward ? eras[0] : null;
    const forwardEras = backwardEra ? eras.slice(1) : eras;
    
    // Calculate backward era duration (if exists)
    if (backwardEra) {
        const firstForwardEra = forwardEras[0];
        const duration = Math.abs(backwardEra.startDate.year - firstForwardEra.startDate.year);
        eraData.push({
            name: backwardEra.name,
            abbreviation: backwardEra.abbreviation,
            duration: duration,
            startDate: backwardEra.startDate,
            endDate: firstForwardEra.startDate,
            isBackward: true
        });
    }
    
    // Calculate forward eras durations
    forwardEras.forEach((era, index) => {
        let duration;
        let endDateObj;
        
        if (index < forwardEras.length - 1) {
            // Not the last era - duration is until next era
            const nextEra = forwardEras[index + 1];
            duration = nextEra.startDate.year - era.startDate.year;
            endDateObj = nextEra.startDate;
        } else {
            // Last era - duration is until end date
            duration = endDate.year - era.startDate.year;
            endDateObj = endDate;
        }
        
        eraData.push({
            name: era.name,
            abbreviation: era.abbreviation,
            duration: duration,
            startDate: era.startDate,
            endDate: endDateObj,
            isBackward: false
        });
    });
    
    // Calculate total duration for proportions
    const totalDuration = eraData.reduce((sum, era) => sum + era.duration, 0);
    
    // Helper function to format date
    const formatDate = (dateObj, showEra = false) => {
        const monthName = currentEditingCalendar.months[dateObj.month]?.name || 'Unknown';
        const monthAbbr = monthName.substring(0, 3); // CHANGED: Abbreviate to 3 letters
        const day = dateObj.day;
        const year = Math.abs(dateObj.year);
        
        if (showEra && backwardEra) {
            return `${monthAbbr} ${day}, ${year} ${backwardEra.abbreviation}`;
        }
        return `${monthAbbr} ${day}, ${year}`;
    };
    
    // Build HTML
    let html = '<div class="era-timeline-display">';
    html += '<div class="era-timeline-bar">';
    
    // Track cumulative percentage for year markers
    let cumulativePercentage = 0;
    
    eraData.forEach((era, index) => {
        const percentage = (era.duration / totalDuration) * 100;
        const displayText = percentage > 8 ? era.abbreviation : '';
        
        // Add year marker at the start of this segment
        if (index === 0) {
            html += `<div class="era-year-marker start">
                ${era.isBackward ? Math.abs(era.startDate.year) + ' ' + era.abbreviation : era.startDate.year}
            </div>`;
        }
        
        // Format dates for tooltip
        const startDateStr = formatDate(era.startDate, era.isBackward);
        const endDateStr = formatDate(era.endDate, false);
        
        html += `
            <div class="era-segment ${era.isBackward ? 'backward' : 'forward'}" 
                 style="flex-basis: ${percentage}%;">
                ${displayText}
                <div class="era-tooltip">
                    <strong>${era.name}</strong><br>
                    ${startDateStr} to ${endDateStr}
                </div>
            </div>
        `;
        
        // Add year marker at the end of this segment (which is the start of the next)
        cumulativePercentage += percentage;
        if (index < eraData.length - 1) {
            const nextEra = eraData[index + 1];
            html += `<div class="era-year-marker" style="left: ${cumulativePercentage}%;">
                ${nextEra.startDate.year}
            </div>`;
        } else {
            // Last segment - add end marker
            html += `<div class="era-year-marker end">
                ${era.endDate.year}
            </div>`;
        }
    });
    
    html += '</div>';
    html += '</div>';
    
    return html;
}

function renderEras() {
    const container = document.getElementById('eras-list');
    container.innerHTML = '';
    
    // Add timeline visualization at the top
    const timelineDiv = document.createElement('div');
    timelineDiv.innerHTML = renderEraTimeline();
    container.appendChild(timelineDiv.firstChild);
    
    // Separate backward era (first era if it's backward) from forward eras
    const backwardEra = currentEditingCalendar.eras[0]?.isBackward ? currentEditingCalendar.eras[0] : null;
    const forwardEras = backwardEra ? currentEditingCalendar.eras.slice(1) : currentEditingCalendar.eras;
    
    // Backward Era Section
    const backwardSection = document.createElement('div');
    backwardSection.style.marginBottom = 'var(--space-lg)';
    backwardSection.innerHTML = `
        <h4 style="margin-bottom: var(--space-sm); color: var(--text-color);">Backward Era (Optional)</h4>
        <div class="helper-text" style="margin-bottom: var(--space-sm); font-size: 0.9em;">
            A backward era counts backwards from its start date (like BCE). Only one backward era allowed.
        </div>
    `;
    
    if (backwardEra) {
        backwardSection.appendChild(createEraItem(backwardEra, 0, true));
    } else if (!currentEditingCalendar.isDefault) {
        const addBtn = document.createElement('button');
        addBtn.className = 'btn-secondary';
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Add Backward Era';
        addBtn.onclick = addBackwardEra;
        backwardSection.appendChild(addBtn);
    }
    
    container.appendChild(backwardSection);
    
    // Forward Eras Section
    const forwardSection = document.createElement('div');
    forwardSection.innerHTML = `
        <h4 style="margin-bottom: var(--space-sm); color: var(--text-color);">Forward Eras</h4>
        <div class="helper-text" style="margin-bottom: var(--space-sm); font-size: 0.9em;">
            Forward eras count forward from their start dates.
        </div>
    `;
    
    const forwardList = document.createElement('div');
    const startIndex = backwardEra ? 1 : 0;
    forwardEras.forEach((era, idx) => {
        forwardList.appendChild(createEraItem(era, startIndex + idx, false));
    });
    forwardSection.appendChild(forwardList);
    
    // Add Era button for forward eras
    if (!currentEditingCalendar.isDefault) {
        const addBtn = document.createElement('button');
        addBtn.className = 'btn-secondary';
        addBtn.style.marginTop = 'var(--space-sm)';
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Add Era';
        addBtn.onclick = addForwardEra;
        forwardSection.appendChild(addBtn);
    }
    
    container.appendChild(forwardSection);
    
    // Add End Date section at the bottom
    const endDateSection = document.createElement('div');
    endDateSection.style.marginTop = 'var(--space-xl)';
    endDateSection.style.paddingTop = 'var(--space-lg)';
    endDateSection.style.borderTop = '1px solid var(--border-primary)';
    
    const canEdit = !currentEditingCalendar.isDefault;
    const endDate = currentEditingCalendar.endDate || { year: 3000, month: 11, day: 31 };
    
    // Format end date (no era abbreviation, just the date)
    const monthName = currentEditingCalendar.months[endDate.month]?.name || 'Unknown';
    const day = endDate.day;
    const year = endDate.year;
    const endDateStr = `${monthName} ${day}, ${year}`;
    
    endDateSection.innerHTML = `
        <div style="display: flex; align-items: center; gap: var(--space-md);">
            <label style="color: var(--text-secondary); font-size: var(--font-size-sm); margin: 0;">
                Calendar ends on:
            </label>
            <div class="era-date-display ${canEdit ? 'clickable' : ''}" 
                 ${canEdit ? 'onclick="editEndDate()"' : ''}
                 style="padding: 6px 12px; background: var(--bg-tertiary); border-radius: 4px; cursor: ${canEdit ? 'pointer' : 'default'}; min-width: 180px; text-align: center; font-size: var(--font-size-sm); opacity: 0.85;">
                ${endDateStr}
            </div>
        </div>
        <div class="helper-text" style="margin-top: var(--space-xs); font-size: 0.85em;">
            The latest date available in this calendar system. This determines the overall span of your timeline.
        </div>
    `;
    
    container.appendChild(endDateSection);
}

function createEraItem(era, index, isBackward) {
    const div = document.createElement('div');
    div.className = 'time-item';
    div.style.display = 'flex';
    div.style.gap = 'var(--space-sm)';
    div.style.alignItems = 'center';
    div.style.marginBottom = 'var(--space-sm)';
    
    const canEdit = !currentEditingCalendar.isDefault;
    
    // Format start date based on era type
    const monthName = currentEditingCalendar.months[era.startDate.month]?.name || 'Unknown';
    const day = era.startDate.day;
    const year = Math.abs(era.startDate.year);
    
    let startDateStr;
    if (isBackward) {
        // Backward era: show with abbreviation
        startDateStr = `${monthName} ${day}, ${year} ${era.abbreviation}`;
    } else {
        // Forward era: show relative to first forward era (no abbreviation)
        startDateStr = `${monthName} ${day}, ${year}`;
    }
    
    // Determine if delete button should show
    let showDelete = false;
    if (canEdit) {
        if (isBackward) {
            // Can delete backward era if there are other eras
            showDelete = currentEditingCalendar.eras.length > 1;
        } else {
            // Can delete forward era if there's more than 1 forward era
            const forwardErasCount = currentEditingCalendar.eras.filter(e => !e.isBackward).length;
            showDelete = forwardErasCount > 1;
        }
    }
    
    // All three fields on one row: Abr | Name | Start Date | Delete
    div.innerHTML = `
        <input type="text" 
               value="${era.abbreviation}" 
               onchange="updateEraAbbr(${index}, this.value)"
               ${canEdit ? '' : 'readonly'}
               placeholder="Abbr"
               style="width: 100px; padding: 6px 8px; font-size: 0.95em;">
        
        <input type="text" 
               value="${era.name}" 
               onchange="updateEraName(${index}, this.value)"
               ${canEdit ? '' : 'readonly'}
               placeholder="Era Name"
               style="flex: 1; padding: 6px 8px;">
        
        <div class="era-date-display ${canEdit ? 'clickable' : ''}" 
             ${canEdit ? `onclick="editEraDate(${index})"` : ''}
             style="padding: 6px 12px; background: var(--bg-secondary); border-radius: 4px; cursor: ${canEdit ? 'pointer' : 'default'}; min-width: 200px; text-align: center; white-space: nowrap;">
            ${startDateStr}
        </div>
        
        ${showDelete ? `
            <span class="time-item-delete" onclick="deleteEra(${index})" style="flex-shrink: 0;">
                <i class="fas fa-trash"></i>
            </span>
        ` : ''}
    `;
    
    return div;
}

function addBackwardEra() {
    if (currentEditingCalendar.isDefault) return;
    
    // Create backward era at the beginning
    const newEra = {
        name: 'Ancient Era',
        abbreviation: 'BCE',
        startDate: { year: -1440, month: 11, day: 16 },
        isBackward: true
    };
    
    currentEditingCalendar.eras.unshift(newEra);
    renderEras();
}

function addForwardEra() {
    if (currentEditingCalendar.isDefault) return;
    
    const hasBackward = currentEditingCalendar.eras[0]?.isBackward;
    const lastEra = currentEditingCalendar.eras[currentEditingCalendar.eras.length - 1];
    const eraCount = hasBackward ? currentEditingCalendar.eras.length : currentEditingCalendar.eras.length + 1;
    
    const newEra = {
        name: `Era ${eraCount}`,
        abbreviation: `E${eraCount}`,
        startDate: { ...lastEra.startDate },
        isBackward: false
    };
    
    currentEditingCalendar.eras.push(newEra);
    renderEras();
}

function updateEraName(index, newName) {
    if (currentEditingCalendar.isDefault) return;
    currentEditingCalendar.eras[index].name = newName;
}

function updateEraAbbr(index, newAbbr) {
    if (currentEditingCalendar.isDefault) return;
    currentEditingCalendar.eras[index].abbreviation = newAbbr;
}

function editEraDate(index) {
    if (currentEditingCalendar.isDefault) return;
    openMiniCalendar(index);
}

function editEndDate() {
    if (currentEditingCalendar.isDefault) return;
    openMiniCalendar('endDate');
}

function deleteEra(index) {
    if (currentEditingCalendar.isDefault) return;
    
    const isBackward = currentEditingCalendar.eras[index]?.isBackward;
    
    // Can't delete if it's the only era or the only forward era
    if (isBackward && currentEditingCalendar.eras.length === 1) {
        alert('Cannot delete the only era!');
        return;
    }
    
    const forwardErasCount = currentEditingCalendar.eras.filter(e => !e.isBackward).length;
    if (!isBackward && forwardErasCount === 1) {
        alert('Cannot delete the last forward era!');
        return;
    }
    
    currentEditingCalendar.eras.splice(index, 1);
    renderEras();
}

// ============================================================================
// SEASONS SECTION
// ============================================================================

function renderSeasons() {
    const container = document.getElementById('seasons-list');
    container.innerHTML = '';
    
    if (!currentEditingCalendar.seasons) {
        currentEditingCalendar.seasons = [];
    }
    
    currentEditingCalendar.seasons.forEach((season, index) => {
        const item = createSeasonItem(season, index);
        container.appendChild(item);
    });
    
    if (currentEditingCalendar.seasons.length === 0) {
        container.innerHTML = '<div class="empty-state">No seasons defined. Add your first season above!</div>';
    }
}

function renderMoonPhases() {
    const container = document.getElementById('moon-phases-display');
    const canEdit = !currentEditingCalendar.isDefault;
    
    if (!currentEditingCalendar.moonPhases) {
        // Initialize with first era's start date
        const firstEraStart = currentEditingCalendar.eras[0]?.startDate || { year: 1, month: 0, day: 1 };
        currentEditingCalendar.moonPhases = {
            enabled: false,
            cycleLength: 29.53,
            epochNewMoon: { ...firstEraStart }
        };
    }
    
    const moonData = currentEditingCalendar.moonPhases;
    
    container.innerHTML = `
        <div style="margin-bottom: var(--space-md);">
            <label>
                <input type="checkbox" id="moon-phases-enabled" 
                    ${moonData.enabled ? 'checked' : ''} 
                    ${canEdit ? '' : 'disabled'}>
                Enable Moon Phases
            </label>
            <div class="helper-text">Display moon phases in calendar view</div>
        </div>
        
        <div style="margin-bottom: var(--space-md);">
            <label for="moon-cycle-length">Lunar Cycle Length (days):</label>
            <input type="number" id="moon-cycle-length" 
                value="${moonData.cycleLength}" 
                step="0.1" min="20" max="35" style="max-width: 100px;"
                ${canEdit ? '' : 'readonly'}>
            <div class="helper-text">Standard: 29.53 days (Earth's moon)</div>
        </div>
        
        <div style="margin-bottom: var(--space-md);">
            <label>Reference New Moon:</label>
            <div class="season-date-display ${canEdit ? 'clickable' : ''}" 
                ${canEdit ? `onclick="editMoonEpoch()"` : ''}
                style="padding: 6px 12px; background: var(--bg-tertiary); border-radius: 4px; cursor: ${canEdit ? 'pointer' : 'default'}; max-width: 200px; text-align: center; font-size: var(--font-size-sm); margin-bottom: 12px;">
                ${formatCalendarDate(moonData.epochNewMoon, currentEditingCalendar)}
            </div>
            <div class="helper-text">A known new moon date for accurate calculations</div>
        </div>
    `;
    
    // Add event listener for checkbox
    const checkbox = document.getElementById('moon-phases-enabled');
    if (checkbox && canEdit) {
        checkbox.onchange = function() {
            currentEditingCalendar.moonPhases.enabled = this.checked;
            renderMoonPhases();
        };
    }
    
    // Add event listener for cycle length
    const cycleInput = document.getElementById('moon-cycle-length');
    if (cycleInput && canEdit) {
        cycleInput.onchange = function() {
            currentEditingCalendar.moonPhases.cycleLength = parseFloat(this.value) || 29.53;
        };
    }
}

function createSeasonItem(season, index) {
    const div = document.createElement('div');
    div.className = 'time-item';

    const canEdit = !currentEditingCalendar.isDefault;
    
    const monthName = currentEditingCalendar.months[season.startDate.month]?.name || 'Unknown';
    const startDateStr = `${monthName} ${season.startDate.day}`;
    
    div.innerHTML = `
        <div class="time-item-content" style="flex: 1; display: flex; gap: var(--space-sm); align-items: baseline;">
            <input type="color" 
                value="${season.color || '#6366f1'}" 
                onchange="updateSeasonColor(${index}, this.value)"
                ${canEdit ? '' : 'disabled'}
                style="width: 40px; height: 40px; border: none; cursor: pointer; border-radius: 4px; align-self: center; margin-bottom: 10px;">
            
            <input type="text" 
                   value="${season.name}" 
                   onchange="updateSeasonName(${index}, this.value)"
                   ${canEdit ? '' : 'readonly'}
                   placeholder="Season Name"
                   style="flex: 1;">
            
            <div class="season-date-display ${canEdit ? 'clickable' : ''}" 
                 ${canEdit ? `onclick="editSeasonDate(${index})"` : ''}
                 style="padding: 6px 12px; background: var(--bg-tertiary); border-radius: 4px; cursor: ${canEdit ? 'pointer' : 'default'}; min-width: 120px; text-align: center; font-size: var(--font-size-sm);">
                ${startDateStr}
            </div>
        </div>
        ${canEdit ? `<span class="time-item-delete" onclick="deleteSeason(${index})"><i class="fas fa-trash"></i></span>` : ''}
    `;
    
    return div;
}

function addSeason() {
    if (currentEditingCalendar.isDefault) return;
    
    if (!currentEditingCalendar.seasons) {
        currentEditingCalendar.seasons = [];
    }
    
    // Default to first day of first month
    currentEditingCalendar.seasons.push({
        name: `Season ${currentEditingCalendar.seasons.length + 1}`,
        startDate: { month: 0, day: 1 },
        color: '#6366f1'
    });
    
    renderSeasons();
}

function updateSeasonName(index, newName) {
    if (currentEditingCalendar.isDefault) return;
    currentEditingCalendar.seasons[index].name = newName;
}

function updateSeasonColor(index, newColor) {
    if (currentEditingCalendar.isDefault) return;
    currentEditingCalendar.seasons[index].color = newColor;
    renderSeasons(); // Re-render to update the border color
}

function editSeasonDate(index) {
    if (currentEditingCalendar.isDefault) return;
    
    miniCalEditingEraIndex = `season-${index}`;
    const season = currentEditingCalendar.seasons[index];
    
    // Initialize with season's current date (using first era's year as reference)
    const referenceYear = currentEditingCalendar.eras[0]?.startDate.year || 1;
    miniCalCurrentMonth = season.startDate.month;
    miniCalCurrentYear = referenceYear;
    miniCalSelectedDate = { 
        year: referenceYear, 
        month: season.startDate.month, 
        day: season.startDate.day 
    };
    
    // Update modal title
    document.getElementById('mini-calendar-title').textContent = `Select Start Date for ${season.name}`;
    
    // Populate month dropdown
    const monthSelect = document.getElementById('mini-cal-month');
    monthSelect.innerHTML = '';
    currentEditingCalendar.months.forEach((month, idx) => {
        const option = document.createElement('option');
        option.value = idx;
        option.textContent = month.name;
        monthSelect.appendChild(option);
    });
    monthSelect.value = miniCalCurrentMonth;
    
    // Set year input
    document.getElementById('mini-cal-year').value = miniCalCurrentYear;
    
    // Hide era selector for seasons
    document.getElementById('mini-cal-era-selector').style.display = 'none';
    
    // Render calendar
    renderMiniCalendar();
    
    // Set up event listeners
    document.getElementById('mini-cal-prev-month').onclick = () => navigateMiniCalMonth(-1);
    document.getElementById('mini-cal-next-month').onclick = () => navigateMiniCalMonth(1);
    document.getElementById('mini-cal-month').onchange = (e) => {
        miniCalCurrentMonth = parseInt(e.target.value);
        renderMiniCalendar();
    };
    document.getElementById('mini-cal-year').onchange = (e) => {
        miniCalCurrentYear = parseInt(e.target.value) || miniCalCurrentYear;
        renderMiniCalendar();
    };
    document.getElementById('mini-cal-confirm').onclick = confirmMiniCalSelection;
    
    openModal('miniCalendarModal');
}

function editMoonEpoch() {
    if (currentEditingCalendar.isDefault) return;
    
    miniCalEditingEraIndex = 'moon-epoch';
    const epoch = currentEditingCalendar.moonPhases.epochNewMoon;
    
    miniCalCurrentMonth = epoch.month;
    miniCalCurrentYear = epoch.year;
    miniCalSelectedDate = { ...epoch };
    
    document.getElementById('mini-calendar-title').textContent = 'Select Reference New Moon Date';
    
    // Populate month dropdown
    const monthSelect = document.getElementById('mini-cal-month');
    monthSelect.innerHTML = '';
    currentEditingCalendar.months.forEach((month, idx) => {
        const option = document.createElement('option');
        option.value = idx;
        option.textContent = month.name;
        monthSelect.appendChild(option);
    });
    monthSelect.value = miniCalCurrentMonth;
    
    document.getElementById('mini-cal-year').value = miniCalCurrentYear;
    document.getElementById('mini-cal-era-selector').style.display = 'none';
    
    renderMiniCalendar();
    
    document.getElementById('mini-cal-prev-month').onclick = () => navigateMiniCalMonth(-1);
    document.getElementById('mini-cal-next-month').onclick = () => navigateMiniCalMonth(1);
    document.getElementById('mini-cal-month').onchange = (e) => {
        miniCalCurrentMonth = parseInt(e.target.value);
        renderMiniCalendar();
    };
    document.getElementById('mini-cal-year').onchange = (e) => {
        miniCalCurrentYear = parseInt(e.target.value) || miniCalCurrentYear;
        renderMiniCalendar();
    };
    document.getElementById('mini-cal-confirm').onclick = confirmMiniCalSelection;
    
    openModal('miniCalendarModal');
}

function deleteSeason(index) {
    if (currentEditingCalendar.isDefault) return;
    
    if (confirm(`Delete "${currentEditingCalendar.seasons[index].name}"?`)) {
        currentEditingCalendar.seasons.splice(index, 1);
        renderSeasons();
    }
}

// ============================================================================
// SETTINGS SECTION
// ============================================================================

function renderSettings() {
    const settings = currentEditingCalendar.settings;
    const canEdit = !currentEditingCalendar.isDefault;
    
    document.getElementById('date-format').value = settings.dateFormat;
    document.getElementById('date-format').disabled = !canEdit;
    
    document.getElementById('time-format').value = settings.timeFormat;
    document.getElementById('time-format').disabled = !canEdit;
    
    updateDateFormatPreview();
    updateTimeFormatPreview();
}

function updateDateFormatPreview() {
    const format = document.getElementById('date-format').value;
    const preview = document.getElementById('date-format-preview');
    
    // Use an example date from the current calendar
    // Use the first month, day 15 (or max days if month has fewer)
    const firstMonth = currentEditingCalendar.months[0];
    const exampleDay = Math.min(15, firstMonth.days);
    const exampleDate = { 
        year: currentEditingCalendar.eras[0]?.startDate.year || 1, 
        month: 0, 
        day: exampleDay 
    };
    
    const formatted = formatDateWithFormat(exampleDate, format, currentEditingCalendar);
    
    preview.textContent = formatted;
    
    if (!currentEditingCalendar.isDefault) {
        currentEditingCalendar.settings.dateFormat = format;
    }
}

function updateTimeFormatPreview() {
    const format = document.getElementById('time-format').value;
    const preview = document.getElementById('time-format-preview');
    
    let exampleTime = '';
    if (format === '12') {
        exampleTime = '3:45 PM';
    } else if (format === '24') {
        exampleTime = '15:45';
    } else {
        // Custom divisions
        const divisionCount = currentEditingCalendar.timeDivisions.divisionsPerDay;
        // Use a division around the middle for the example (or division 7 if available)
        const exampleDivisionIndex = Math.min(7, Math.floor(divisionCount / 2));
        const divName = currentEditingCalendar.timeDivisions.divisionNames?.[exampleDivisionIndex] 
                       || `Division ${exampleDivisionIndex + 1}`;
        const subdivisionName = currentEditingCalendar.timeDivisions.subdivisionName || 'minutes';
        exampleTime = `${divName}, 45 ${subdivisionName}`;
    }
    
    preview.textContent = exampleTime;
    
    if (!currentEditingCalendar.isDefault) {
        currentEditingCalendar.settings.timeFormat = format;
    }
}

// ============================================================================
// MANAGE CALENDARS MODAL
// ============================================================================

function openManageCalendarsModal() {
    renderCalendarsList();
    openModal('manageCalendarsModal');
}

function renderCalendarsList() {
    const container = document.getElementById('calendars-list-container');
    container.innerHTML = '';
    
    // Default Gregorian
    const gregorianItem = document.createElement('div');
    gregorianItem.className = 'calendar-list-item default';
    gregorianItem.innerHTML = `
        <div class="calendar-list-item-name">
            <strong>Default (Gregorian)</strong>
            <div style="font-size: 0.85em; color: var(--text-muted); margin-top: 2px;">
                Read-only reference calendar
            </div>
        </div>
        <div class="calendar-list-item-actions">
            <button onclick="duplicatePresetCalendar('default')" class="btn-secondary" title="Create a copy of this calendar">
                <i class="fas fa-copy"></i> Copy
            </button>
        </div>
    `;
    container.appendChild(gregorianItem);

    // Preset Chinese
    const chineseItem = document.createElement('div');
    chineseItem.className = 'calendar-list-item default';
    chineseItem.innerHTML = `
        <div class="calendar-list-item-name">
            <strong>Traditional Chinese</strong>
            <div style="font-size: 0.85em; color: var(--text-muted); margin-top: 2px;">
                Read-only reference calendar
            </div>
        </div>
        <div class="calendar-list-item-actions">
            <button onclick="duplicatePresetCalendar('preset-chinese')" class="btn-secondary" title="Create a copy of this calendar">
                <i class="fas fa-copy"></i> Copy
            </button>
        </div>
    `;
    container.appendChild(chineseItem);
    
    // User calendars
    userTimeSystems.forEach((calendar, index) => {
        const item = document.createElement('div');
        item.className = 'calendar-list-item';
        item.innerHTML = `
            <div class="calendar-list-item-name">
                <strong>${calendar.name}</strong>
            </div>
            <div class="calendar-list-item-actions">
                <button onclick="renameCalendar('${calendar.id}')" class="btn-secondary">Rename</button>
                <button onclick="deleteCalendar('${calendar.id}')" class="btn-secondary" style="color: var(--danger-color);">Delete</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function duplicatePresetCalendar(presetId) {
    let preset, baseName;

    if (presetId === 'default') {
        preset = DEFAULT_CALENDAR;
        baseName = 'Gregorian Copy';
    } else if (presetId === 'preset-chinese') {
        preset = PRESET_CHINESE_CALENDAR;
        baseName = 'Chinese Copy';
    } else {
        return; // Invalid ID
    }

    const name = prompt('Enter a name for your new calendar:', baseName);
    if (!name || !name.trim()) return;

    // Create a deep copy of the selected preset
    const newCalendar = JSON.parse(JSON.stringify(preset));
    newCalendar.id = 'cal_' + Date.now();
    newCalendar.name = name.trim();
    newCalendar.isDefault = false; // Make it editable

    // Ensure calendarType exists (good practice)
    if (!newCalendar.calendarType) {
        newCalendar.calendarType = presetId === 'default' ? 'solar' : 'lunisolar';
    }

    userTimeSystems.push(newCalendar);

    // Refresh UI and save
    renderCalendarsList();
    populateCalendarSelector();
    saveUserTimeSystems();
}

function createNewCalendar() {
    const name = prompt('Enter a name for your new calendar:');
    if (!name || !name.trim()) return;
    
    // Create new calendar based on default
    const newCalendar = JSON.parse(JSON.stringify(DEFAULT_CALENDAR));
    newCalendar.id = 'cal_' + Date.now();
    newCalendar.name = name.trim();
    newCalendar.isDefault = false;
    
    // Ensure calendarType exists
    if (!newCalendar.calendarType) {
        newCalendar.calendarType = 'solar';
    }
    
    userTimeSystems.push(newCalendar);
    
    renderCalendarsList();
    populateCalendarSelector();
    saveUserTimeSystems();
}

function renameCalendar(calendarId) {
    const calendar = userTimeSystems.find(c => c.id === calendarId);
    if (!calendar) return;
    
    const newName = prompt('Enter new name:', calendar.name);
    if (!newName || !newName.trim()) return;
    
    calendar.name = newName.trim();
    
    renderCalendarsList();
    populateCalendarSelector();
    populateTimeSystemsDropdown();
    saveUserTimeSystems();
}

function deleteCalendar(calendarId) {
    const calendar = userTimeSystems.find(c => c.id === calendarId);
    if (!calendar) return;
    
    if (!confirm(`Are you sure you want to delete "${calendar.name}"? This cannot be undone.`)) {
        return;
    }
    
    userTimeSystems = userTimeSystems.filter(c => c.id !== calendarId);
    
    renderCalendarsList();
    populateCalendarSelector();
    populateTimeSystemsDropdown();
    saveUserTimeSystems();
}

// ============================================================================
// SAVE FUNCTIONALITY
// ============================================================================

function saveCurrentTimeSystem() {
    if (currentEditingCalendar.isDefault) {
        if (typeof showToast === 'function') {
            showToast('error', 'Cannot save changes to the default calendar.');
        } else {
            alert('Cannot save changes to the default calendar.');
        }
        return;
    }
    
    // Find and update the calendar in userTimeSystems
    const index = userTimeSystems.findIndex(c => c.id === currentEditingCalendar.id);
    if (index !== -1) {
        userTimeSystems[index] = JSON.parse(JSON.stringify(currentEditingCalendar));
    }
    
    // Save to backend
    saveUserTimeSystems().then(success => {
        if (success) {
            if (typeof showToast === 'function') {
                showToast('success', 'Time system saved successfully!');
            } else {
                alert('Time system saved!');
            }
            
            // Preserve the current selection before refreshing
            const currentSelection = document.getElementById('plans-time-system').value;
            
            // Refresh dropdowns
            populateTimeSystemsDropdown();
            
            // Restore the selection
            document.getElementById('plans-time-system').value = currentSelection;
            
            closeModal('timeSystemsEditorModal');
        } else {
            if (typeof showToast === 'function') {
                showToast('error', 'Failed to save time system. Please try again.');
            } else {
                alert('Failed to save time system. Please try again.');
            }
        }
    });
}

// ============================================================================
// DRAG AND DROP HELPERS
// ============================================================================

let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedItem !== this) {
        const allItems = [...this.parentNode.children];
        const draggedIndex = parseInt(draggedItem.dataset.index);
        const targetIndex = parseInt(this.dataset.index);
        
        // Determine if we're dragging months or weekdays
        const isMergingMonths = draggedItem.parentNode.id === 'months-list';
        
        if (isMergingMonths) {
            // Reorder months array
            const [removed] = currentEditingCalendar.months.splice(draggedIndex, 1);
            currentEditingCalendar.months.splice(targetIndex, 0, removed);
            
            // Adjust era dates and end date for the reordering
            adjustDatesAfterMonthReorder(draggedIndex, targetIndex);
            
            renderMonths();
            renderEras(); // Re-render eras to show updated dates
        } else {
            // Reorder weekdays array
            const [removed] = currentEditingCalendar.weekdays.splice(draggedIndex, 1);
            currentEditingCalendar.weekdays.splice(targetIndex, 0, removed);
            renderWeeks();
        }
    }
    
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

// ============================================================================
// MINI CALENDAR DATE PICKER
// ============================================================================

function openMiniCalendar(eraIndexOrEndDate) {
    const isEndDate = eraIndexOrEndDate === 'endDate';
    
    if (isEndDate) {
        miniCalEditingEraIndex = 'endDate';
        const endDate = currentEditingCalendar.endDate || { year: 3000, month: 11, day: 31 };
        
        // Initialize with end date
        miniCalCurrentMonth = endDate.month;
        miniCalCurrentYear = endDate.year;
        miniCalSelectedDate = { ...endDate };
        
        // Update modal title
        document.getElementById('mini-calendar-title').textContent = 'Select End Date';
    } else {
        miniCalEditingEraIndex = eraIndexOrEndDate;
        const era = currentEditingCalendar.eras[eraIndexOrEndDate];
        const isBackwardEra = era.isBackward;
        
        // Initialize with era's current date
        miniCalCurrentMonth = era.startDate.month;
        miniCalCurrentYear = era.startDate.year;
        miniCalSelectedDate = { ...era.startDate };
        
        // Update modal title
        document.getElementById('mini-calendar-title').textContent = 'Select Start Date';
    }
    
    // Populate month dropdown
    const monthSelect = document.getElementById('mini-cal-month');
    monthSelect.innerHTML = '';
    currentEditingCalendar.months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month.name;
        monthSelect.appendChild(option);
    });
    monthSelect.value = miniCalCurrentMonth;
    
    // Set year input
    document.getElementById('mini-cal-year').value = miniCalCurrentYear;
    
    // Era selector handling
    const eraSelector = document.getElementById('mini-cal-era-selector');
    if (isEndDate) {
        // Never show era selector for end date
        eraSelector.style.display = 'none';
    } else {
        const era = currentEditingCalendar.eras[eraIndexOrEndDate];
        const isBackwardEra = era.isBackward;
        
        // Only show era selector for backward era
        if (isBackwardEra) {
            eraSelector.style.display = 'block';
            const eraSelect = document.getElementById('mini-cal-era');
            eraSelect.innerHTML = '';
            
            // Only show backward eras in selector
            currentEditingCalendar.eras.forEach((e, idx) => {
                if (e.isBackward) {
                    const option = document.createElement('option');
                    option.value = idx;
                    option.textContent = `${e.abbreviation} (${e.name})`;
                    eraSelect.appendChild(option);
                }
            });
            eraSelect.value = eraIndexOrEndDate;
        } else {
            // Hide era selector for forward eras
            eraSelector.style.display = 'none';
        }
    }
    
    // Render calendar
    renderMiniCalendar();
    
    // Set up event listeners
    document.getElementById('mini-cal-prev-month').onclick = () => navigateMiniCalMonth(-1);
    document.getElementById('mini-cal-next-month').onclick = () => navigateMiniCalMonth(1);
    document.getElementById('mini-cal-month').onchange = (e) => {
        miniCalCurrentMonth = parseInt(e.target.value);
        renderMiniCalendar();
    };
    document.getElementById('mini-cal-year').onchange = (e) => {
        miniCalCurrentYear = parseInt(e.target.value) || miniCalCurrentYear;
        renderMiniCalendar();
    };
    document.getElementById('mini-cal-confirm').onclick = confirmMiniCalSelection;
    
    openModal('miniCalendarModal');
}

function findEraForYear(year) {
    for (let i = currentEditingCalendar.eras.length - 1; i >= 0; i--) {
        if (year >= currentEditingCalendar.eras[i].startDate.year) {
            return i;
        }
    }
    return 0;
}

function navigateMiniCalMonth(direction) {
    miniCalCurrentMonth += direction;
    
    if (miniCalCurrentMonth < 0) {
        miniCalCurrentMonth = currentEditingCalendar.months.length - 1;
        miniCalCurrentYear--;
    } else if (miniCalCurrentMonth >= currentEditingCalendar.months.length) {
        miniCalCurrentMonth = 0;
        miniCalCurrentYear++;
    }
    
    document.getElementById('mini-cal-month').value = miniCalCurrentMonth;
    document.getElementById('mini-cal-year').value = miniCalCurrentYear;
    
    renderMiniCalendar();
}

function renderMiniCalendar() {
    const grid = document.getElementById('mini-calendar-grid');
    grid.innerHTML = '';
    grid.className = 'mini-calendar-grid';
    
    if (currentEditingCalendar.calendarType === 'solar' && currentEditingCalendar.weekdays && currentEditingCalendar.weekdays.length > 0) {
        renderSolarMiniCalendar(grid);
    } else {
        renderLunarMiniCalendar(grid);
    }
    
    updateMiniCalDisplay();
}

function renderSolarMiniCalendar(grid) {
    const weekdayCount = currentEditingCalendar.weekdays.length;
    
    // Dynamically set grid columns based on number of weekdays
    grid.style.gridTemplateColumns = `repeat(${weekdayCount}, 1fr)`;
    
    // Create weekday headers
    currentEditingCalendar.weekdays.forEach(day => {
        const header = document.createElement('div');
        header.className = 'mini-cal-weekday-header';
        const truncateLength = weekdayCount > 10 ? 2 : 3;
        header.textContent = day.substring(0, truncateLength);
        grid.appendChild(header);
    });
    
    // Get days in current month
    const daysInMonth = currentEditingCalendar.months[miniCalCurrentMonth].days;
    
    // Calculate starting day of week
    const startDay = calculateDayOfWeek(miniCalCurrentYear, miniCalCurrentMonth, 1, currentEditingCalendar);
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'mini-cal-day empty';
        grid.appendChild(empty);
    }
    
    // Add day cells
    renderMiniCalDayCells(grid, daysInMonth);
}

function renderLunarMiniCalendar(grid) {
    // Simple grid, 7 columns for readability
    grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
    
    // Get days in current month
    const daysInMonth = currentEditingCalendar.months[miniCalCurrentMonth].days;
    
    // Add day cells (no weekday headers, no offset)
    renderMiniCalDayCells(grid, daysInMonth);
}

function renderMiniCalDayCells(grid, daysInMonth) {
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'mini-cal-day';
        
        // Calculate moon phase if enabled
        let moonIcon = '';
        if (currentEditingCalendar.moonPhases && currentEditingCalendar.moonPhases.enabled) {
            const phase = calculateMoonPhase(miniCalCurrentYear, miniCalCurrentMonth, day, currentEditingCalendar);
            const iconHTML = getMoonPhaseIcon(phase); // Now returns HTML
            moonIcon = iconHTML ? `<span class="moon-phase-icon">${iconHTML}</span>` : '';
        }

        dayCell.innerHTML = `
            <div class="mini-cal-day-number">${day}</div>
            ${moonIcon}
        `;
        
        // Check if this is the selected date
        if (miniCalSelectedDate && 
            miniCalSelectedDate.year === miniCalCurrentYear &&
            miniCalSelectedDate.month === miniCalCurrentMonth &&
            miniCalSelectedDate.day === day) {
            dayCell.classList.add('selected');
        }
        
        dayCell.onclick = () => selectMiniCalDate(day);
        grid.appendChild(dayCell);
    }
}

function calculateDayOfWeek(year, month, day, calendar) {
    // Calculate which day of the week a date falls on in the custom calendar
    // This uses a simplified approach: count total days from epoch and mod by week length
    
    // Use the provided calendar parameter instead of global currentEditingCalendar
    const cal = calendar || currentEditingCalendar;
    
    if (!cal) {
        console.error('calculateDayOfWeek called without a valid calendar');
        return 0; // Return default day
    }
    
    const weekLength = cal.weekdays.length;
    const epochDay = cal.epochDay || 0;
    
    // Calculate total days from the first era start to this date
    let totalDays = 0;
    
    // Start from the earliest era start date
    const earliestEra = cal.eras[0];
let referenceYear = earliestEra.startDate.year;
    let referenceMonth = earliestEra.startDate.month;
    let referenceDay = earliestEra.startDate.day;
    
    // If target date is before reference, we can't calculate (shouldn't happen in practice)
    if (year < referenceYear || 
        (year === referenceYear && month < referenceMonth) ||
        (year === referenceYear && month === referenceMonth && day < referenceDay)) {
        return epochDay; // Fallback to epoch day
    }
    
    // Add days for complete years
    for (let y = referenceYear; y < year; y++) {
        totalDays += cal.months.reduce((sum, m) => sum + m.days, 0);
    }
    
    // Add days for complete months in the target year
    for (let m = (year === referenceYear ? referenceMonth : 0); m < month; m++) {
        totalDays += cal.months[m].days;
    }
    
    // Add days in the target month
    totalDays += day - (year === referenceYear && month === referenceMonth ? referenceDay : 0);
    
    // Calculate day of week
    const dayOfWeek = (epochDay + totalDays) % weekLength;
    
    return dayOfWeek < 0 ? dayOfWeek + weekLength : dayOfWeek;
}

function calculateMoonPhase(year, month, day, calendar) {
    // Returns moon phase for a given date
    // 0 = New Moon, 0.25 = First Quarter, 0.5 = Full Moon, 0.75 = Last Quarter
    
    if (!calendar.moonPhases || !calendar.moonPhases.enabled) {
        return null;
    }
    
    const moonData = calendar.moonPhases;
    const cycleLength = moonData.cycleLength;
    
    // Calculate days since epoch new moon
    const epochDate = moonData.epochNewMoon;
    let daysSinceEpoch = 0;
    
    // Simple day counting (this could be improved with actual date math)
    // For now, calculate from the epoch year
    for (let y = epochDate.year; y < year; y++) {
        daysSinceEpoch += calendar.months.reduce((sum, m) => sum + m.days, 0);
    }
    
    // Add days for complete months in target year
    for (let m = 0; m < month; m++) {
        daysSinceEpoch += calendar.months[m].days;
    }
    
    // Add days in target month
    daysSinceEpoch += day;
    
    // Subtract days for complete months in epoch year up to epoch month
    for (let m = 0; m < epochDate.month; m++) {
        daysSinceEpoch -= calendar.months[m].days;
    }
    
    // Subtract epoch day
    daysSinceEpoch -= epochDate.day;
    
    // Calculate phase (0 to 1)
    const phase = (daysSinceEpoch % cycleLength) / cycleLength;
    
    return phase < 0 ? phase + 1 : phase;
}

function getMoonPhaseIcon(phase) {
    // Returns Font Awesome HTML for moon phase icons
    if (phase === null) return '';

    // Note: The free version of Font Awesome has limited phase icons.
    // We use creative combinations of fa-circle (for new/full) and fa-moon.
    // 'fa-adjust' is a good stand-in for quarter moons.
    
    if (phase < 0.0625 || phase >= 0.9375) return '<i class="fa-solid fa-circle"></i>'; // New Moon (style with dark color)
    if (phase < 0.1875) return '<i class="fa-solid fa-moon" style="transform: scaleX(-1) rotate(-35deg);"></i>'; // Waxing Crescent
    if (phase < 0.3125) return '<i class="fa-solid fa-adjust" style="transform: rotate(180deg);"></i>';      // First Quarter
    if (phase < 0.4375) return '<i class="fa-solid fa-moon" style="transform: rotate(35deg);"></i>';         // Waxing Gibbous
    if (phase < 0.5625) return '<i class="fa-solid fa-circle"></i>'; // Full Moon (style with light color)
    if (phase < 0.6875) return '<i class="fa-solid fa-moon" style="transform: scaleX(-1) rotate(35deg);"></i>'; // Waning Gibbous
    if (phase < 0.8125) return '<i class="fa-solid fa-adjust"></i>';          // Last Quarter
    return '<i class="fa-solid fa-moon" style="transform: rotate(-35deg);"></i>'; // Waning Crescent
}

function getMoonPhaseName(phase) {
    if (phase === null) return '';
    
    if (phase < 0.0625 || phase >= 0.9375) return 'New Moon';
    if (phase < 0.1875) return 'Waxing Crescent';
    if (phase < 0.3125) return 'First Quarter';
    if (phase < 0.4375) return 'Waxing Gibbous';
    if (phase < 0.5625) return 'Full Moon';
    if (phase < 0.6875) return 'Waning Gibbous';
    if (phase < 0.8125) return 'Last Quarter';
    return 'Waning Crescent';
}

function selectMiniCalDate(day) {
    miniCalSelectedDate = {
        year: miniCalCurrentYear,
        month: miniCalCurrentMonth,
        day: day
    };
    
    renderMiniCalendar();
}

function updateMiniCalDisplay() {
    const display = document.getElementById('mini-cal-selected-display');
    if (miniCalSelectedDate) {
        const monthName = currentEditingCalendar.months[miniCalSelectedDate.month]?.name || 'Unknown';
        const day = miniCalSelectedDate.day;
        const year = Math.abs(miniCalSelectedDate.year);
        
        let formatted;
        
        if (miniCalEditingEraIndex === 'endDate') {
            // End date: no era abbreviation
            formatted = `${monthName} ${day}, ${year}`;
        } else if (miniCalEditingEraIndex === 'event-date') {
            // Event date: show with era abbreviation
            let eraAbbr = '';
            for (let i = currentEditingCalendar.eras.length - 1; i >= 0; i--) {
                const era = currentEditingCalendar.eras[i];
                if (miniCalSelectedDate.year >= era.startDate.year) {
                    eraAbbr = era.abbreviation;
                    break;
                }
            }
            formatted = `${monthName} ${day}, ${year} ${eraAbbr}`;
        } else if (miniCalEditingEraIndex === 'storyline-date') {
            // Storyline date: show with era abbreviation (same as event-date)
            let eraAbbr = '';
            for (let i = currentEditingCalendar.eras.length - 1; i >= 0; i--) {
                const era = currentEditingCalendar.eras[i];
                if (miniCalSelectedDate.year >= era.startDate.year) {
                    eraAbbr = era.abbreviation;
                    break;
                }
            }
            formatted = `${monthName} ${day}, ${year} ${eraAbbr}`;
        } else if (typeof miniCalEditingEraIndex === 'string' && miniCalEditingEraIndex.startsWith('season-')) {
            // Season date: no year needed, just month and day
            formatted = `${monthName} ${day}`;
        } else if (miniCalEditingEraIndex === 'moon-epoch') {
            // Moon epoch: show full date with era
            let eraAbbr = '';
            for (let i = currentEditingCalendar.eras.length - 1; i >= 0; i--) {
                const era = currentEditingCalendar.eras[i];
                if (miniCalSelectedDate.year >= era.startDate.year) {
                    eraAbbr = era.abbreviation;
                    break;
                }
            }
            formatted = `${monthName} ${day}, ${year} ${eraAbbr}`;
        } else {
            const era = currentEditingCalendar.eras[miniCalEditingEraIndex];
            if (era.isBackward) {
                // Show with era abbreviation for backward era
                formatted = `${monthName} ${day}, ${year} ${era.abbreviation}`;
            } else {
                // No era abbreviation for forward eras
                formatted = `${monthName} ${day}, ${year}`;
            }
        }
        
        display.textContent = formatted;
    } else {
        display.textContent = 'None';
    }
}

function confirmMiniCalSelection() {
    if (miniCalSelectedDate) {
        if (miniCalEditingEraIndex === 'endDate') {
            // Update end date
            currentEditingCalendar.endDate = { ...miniCalSelectedDate };
            renderEras();
            renderOverview();
            closeModal('miniCalendarModal');
        } else if (miniCalEditingEraIndex === 'event-date') {
            // For event date selection - use callback
            confirmEventDateSelection();
        } else if (typeof miniCalEditingEraIndex === 'string' && miniCalEditingEraIndex.startsWith('season-')) {
            // Update season start date
            const seasonIndex = parseInt(miniCalEditingEraIndex.split('-')[1]);
            currentEditingCalendar.seasons[seasonIndex].startDate = {
                month: miniCalSelectedDate.month,
                day: miniCalSelectedDate.day
            };
            renderSeasons();
            closeModal('miniCalendarModal');
        } else if (miniCalEditingEraIndex === 'moon-epoch') {
            currentEditingCalendar.moonPhases.epochNewMoon = { ...miniCalSelectedDate };
            renderMoonPhases();
            closeModal('miniCalendarModal');
        } else if (miniCalEditingEraIndex !== -1) {
            // Update era start date
            currentEditingCalendar.eras[miniCalEditingEraIndex].startDate = { ...miniCalSelectedDate };
            renderEras();
            closeModal('miniCalendarModal');
        }
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatCalendarDate(dateObj, calendar) {
    if (!dateObj) return 'N/A';
    
    const monthName = calendar.months[dateObj.month]?.name || 'Unknown';
    const day = dateObj.day;
    const year = Math.abs(dateObj.year);
    
    // Find which era this date is in
    let eraAbbr = '';
    for (let i = calendar.eras.length - 1; i >= 0; i--) {
        const era = calendar.eras[i];
        if (dateObj.year >= era.startDate.year) {
            eraAbbr = era.abbreviation;
            break;
        }
    }
    
    return `${monthName} ${day}, ${year} ${eraAbbr}`;
}

function formatDateWithFormat(dateObj, format, calendar) {
    const monthName = calendar.months[dateObj.month]?.name || 'Unknown';
    const monthNum = String(dateObj.month + 1).padStart(2, '0');
    const day = String(dateObj.day).padStart(2, '0');
    const dayNum = dateObj.day;
    const year = Math.abs(dateObj.year);
    
    // Calculate day of week (only for solar calendars)
    let weekdayName = '';
    if (calendar.calendarType === 'solar' && calendar.weekdays && calendar.weekdays.length > 0) {
        const weekdayIndex = calculateDayOfWeek(dateObj.year, dateObj.month, dateObj.day, calendar);
        weekdayName = calendar.weekdays[weekdayIndex] || 'Unknown';
    }
    
    // Find era
    let eraAbbr = '';
    for (let i = calendar.eras.length - 1; i >= 0; i--) {
        const era = calendar.eras[i];
        if (dateObj.year >= era.startDate.year) {
            eraAbbr = era.abbreviation;
            break;
        }
    }
    
    // Apply format - need to replace longer patterns first to avoid conflicts
    let result = format;
    if (weekdayName) {
        result = result.replace('DDDD', weekdayName);
    }
    result = result.replace('MMMM', monthName);
    result = result.replace('YYYY', year);
    result = result.replace('MM', monthNum);
    result = result.replace('DD', day);
    // These single-letter replacements must come after their double-letter versions
    result = result.replace(/\bM\b/g, String(dateObj.month + 1));
    result = result.replace(/\bD\b/g, String(dayNum));
    result = result.replace('E', eraAbbr);
    
    return result;
}

// Export functions for use in other modules
window.loadUserTimeSystems = loadUserTimeSystems;
window.initializeTimeSystems = initializeTimeSystems;
window.populateTimeSystemsDropdown = populateTimeSystemsDropdown;
window.openTimeSystemsEditor = openTimeSystemsEditor;
window.openManageCalendarsModal = openManageCalendarsModal;
window.createNewCalendar = createNewCalendar;
window.renameCalendar = renameCalendar;
window.deleteCalendar = deleteCalendar;
window.saveCurrentTimeSystem = saveCurrentTimeSystem;
window.cancelTimeSystemEdits = cancelTimeSystemEdits;
window.duplicatePresetCalendar = duplicatePresetCalendar; 

// Functions called from HTML
window.updateMonthName = updateMonthName;
window.updateMonthDays = updateMonthDays;
window.deleteMonth = deleteMonth;
window.updateWeekdayName = updateWeekdayName;
window.deleteWeekday = deleteWeekday;
window.updateDivisionName = updateDivisionName;
window.updateEraName = updateEraName;
window.updateEraAbbr = updateEraAbbr;
window.editEraDate = editEraDate;
window.deleteEra = deleteEra;
window.addBackwardEra = addBackwardEra;
window.addForwardEra = addForwardEra;
window.editEraDate = editEraDate;
window.openMiniCalendar = openMiniCalendar;
window.editEndDate = editEndDate;
window.updateSeasonName = updateSeasonName;
window.updateSeasonColor = updateSeasonColor;
window.editSeasonDate = editSeasonDate;
window.deleteSeason = deleteSeason;
window.editMoonEpoch = editMoonEpoch;

window.DEFAULT_CALENDAR = DEFAULT_CALENDAR;
window.PRESET_CHINESE_CALENDAR = PRESET_CHINESE_CALENDAR;