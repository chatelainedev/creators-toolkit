// --- CREATE NEW FILE: modules/find-replace.js ---

class FindReplace {
    constructor(extractorApp) {
        this.app = extractorApp;
        this.matches = [];
        this.selectedMatchIndex = -1;
        this.selectedResultElement = null;

        this.setupDOMElements();
        this.setupEventListeners();
    }

    setupDOMElements() {
        this.elements = {
            modal: document.getElementById('find-replace-modal'),
            closeBtn: document.getElementById('find-replace-modal-close'),
            findInput: document.getElementById('fr-find-input'),
            replaceInput: document.getElementById('fr-replace-input'),
            sourceSelect: document.getElementById('fr-source-select'),
            matchCaseCheck: document.getElementById('fr-match-case'),
            wholeWordsCheck: document.getElementById('fr-whole-words'),
            useRegexCheck: document.getElementById('fr-use-regex'),
            resultsCount: document.getElementById('fr-results-count'),
            resultsList: document.getElementById('fr-results-list'),
            findAllBtn: document.getElementById('fr-find-all-btn'),
            replaceBtn: document.getElementById('fr-replace-btn'),
            replaceAllBtn: document.getElementById('fr-replace-all-btn'),
        };
    }

    setupEventListeners() {
        this.elements.closeBtn.addEventListener('click', () => this.closeModal());
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) this.closeModal();
        });

        this.elements.findAllBtn.addEventListener('click', () => this.findAll());
        this.elements.replaceBtn.addEventListener('click', () => this.replaceSelected());
        this.elements.replaceAllBtn.addEventListener('click', () => this.replaceAll());

        this.elements.findInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.findAll();
        });

        this.elements.resultsList.addEventListener('click', (e) => {
            const resultItem = e.target.closest('.fr-result-item');
            if (resultItem) {
                const index = parseInt(resultItem.dataset.index);
                this.selectMatch(index);
            }
        });
    }

    openModal() {
        this.elements.modal.style.display = 'flex';
        this.elements.findInput.focus();
        this.resetState();
    }

    closeModal() {
        this.elements.modal.style.display = 'none';
    }

    resetState() {
        this.matches = [];
        this.selectedMatchIndex = -1;
        this.selectedResultElement = null;
        this.elements.resultsList.innerHTML = '';
        this.elements.resultsCount.textContent = '0 matches found';
        this.elements.replaceBtn.disabled = true;
        this.elements.replaceAllBtn.disabled = true;
    }

    findAll() {
        const findTerm = this.elements.findInput.value;
        if (!findTerm) {
            showToast('warning', 'Please enter a search term.');
            return;
        }

        this.resetState();

        const searchScope = this.elements.sourceSelect.value;
        const matchCase = this.elements.matchCaseCheck.checked;
        const wholeWords = this.elements.wholeWordsCheck.checked;
        const useRegex = this.elements.useRegexCheck.checked;

        let regex;
        try {
            let pattern = useRegex ? findTerm : findTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (wholeWords && !useRegex) {
                pattern = `\\b${pattern}\\b`;
            }
            const flags = matchCase ? 'g' : 'gi';
            regex = new RegExp(pattern, flags);
        } catch (e) {
            showToast('error', 'Invalid regular expression.');
            return;
        }

        this.app.filteredEntries.forEach(entry => {
            const checkField = (fieldName, text) => {
                if (!text) return;
                let match;
                while ((match = regex.exec(text)) !== null) {
                    this.matches.push({
                        entry,
                        field: fieldName,
                        text,
                        match: match[0],
                        index: match.index,
                    });
                }
            };

            if (searchScope === 'all' || searchScope === 'names')   checkField('Name', entry.comment);
            if (searchScope === 'all' || searchScope === 'content') checkField('Content', entry.content);
            if (searchScope === 'all' || searchScope === 'keys') {
                checkField('Keys', (entry.key || []).join(', '));
                checkField('Secondary Keys', (entry.keysecondary || []).join(', '));
            }
        });

        this.renderResults();
    }

    renderResults() {
        this.elements.resultsCount.textContent = `${this.matches.length} match${this.matches.length !== 1 ? 'es' : ''} found`;
        
        if (this.matches.length === 0) {
            this.elements.resultsList.innerHTML = '<p style="text-align: center; color: var(--text-tertiary); margin-top: 20px;">No results</p>';
            return;
        }

        const html = this.matches.map((match, index) => {
            const contextRadius = 30;
            const start = Math.max(0, match.index - contextRadius);
            const end = Math.min(match.text.length, match.index + match.match.length + contextRadius);
            
            const contextPrefix = start > 0 ? '...' : '';
            const contextSuffix = end < match.text.length ? '...' : '';

            let context = match.text.substring(start, end);
            let highlighted = context.substring(match.index - start, match.index - start + match.match.length);
            context = this.app.escapeHtml(context);
            highlighted = this.app.escapeHtml(highlighted);

            const finalContext = contextPrefix + context.replace(highlighted, `<mark>${highlighted}</mark>`) + contextSuffix;

            return `
                <div class="fr-result-item" data-index="${index}">
                    <div class="fr-result-header">
                        ${this.app.escapeHtml(match.entry.comment || 'Untitled Entry')}
                        <span class="field-tag">${match.field}</span>
                    </div>
                    <div class="fr-result-context">${finalContext}</div>
                </div>`;
        }).join('');

        this.elements.resultsList.innerHTML = html;
        this.elements.replaceAllBtn.disabled = false;
    }

    selectMatch(index) {
        if (this.selectedResultElement) {
            this.selectedResultElement.classList.remove('selected');
        }

        if (index >= 0 && index < this.matches.length) {
            this.selectedMatchIndex = index;
            const resultItems = this.elements.resultsList.querySelectorAll('.fr-result-item');
            this.selectedResultElement = resultItems[index];
            this.selectedResultElement.classList.add('selected');
            this.selectedResultElement.scrollIntoView({ block: 'nearest' });
            this.elements.replaceBtn.disabled = false;
        } else {
            this.selectedMatchIndex = -1;
            this.selectedResultElement = null;
            this.elements.replaceBtn.disabled = true;
        }
    }

    replaceSelected() {
        if (this.selectedMatchIndex === -1) return;

        const match = this.matches[this.selectedMatchIndex];
        const replaceTerm = this.elements.replaceInput.value;
        this.performSingleReplacement(match.entry, match.field, match.text, match.index, match.match, replaceTerm);
        showToast('info', '1 replacement made.');
        
        // Rescan to update indices and UI
        this.findAll();
    }
    
    replaceAll() {
        if (this.matches.length === 0) return;
        
        const replaceTerm = this.elements.replaceInput.value;
        const findTerm = this.elements.findInput.value;
        
        const matchCase = this.elements.matchCaseCheck.checked;
        const wholeWords = this.elements.wholeWordsCheck.checked;
        const useRegex = this.elements.useRegexCheck.checked;
        
        let regex;
        try {
            let pattern = useRegex ? findTerm : findTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (wholeWords && !useRegex) pattern = `\\b${pattern}\\b`;
            const flags = matchCase ? 'g' : 'gi';
            regex = new RegExp(pattern, flags);
        } catch (e) {
            showToast('error', 'Invalid regular expression.');
            return;
        }

        let replacementsCount = 0;
        const affectedEntries = new Set();
        
        this.app.filteredEntries.forEach(entry => {
            let changed = false;
            
            const processField = (text) => {
                if (!text || !regex.test(text)) return { newText: text, count: 0 };
                const count = (text.match(regex) || []).length;
                const newText = text.replace(regex, replaceTerm);
                return { newText, count };
            };
            
            const searchScope = this.elements.sourceSelect.value;

            if (searchScope === 'all' || searchScope === 'names') {
                const {newText, count} = processField(entry.comment);
                if(count > 0) { entry.comment = newText; replacementsCount += count; changed = true; }
            }
            if (searchScope === 'all' || searchScope === 'content') {
                 const {newText, count} = processField(entry.content);
                if(count > 0) { entry.content = newText; replacementsCount += count; changed = true; }
            }
            if (searchScope === 'all' || searchScope === 'keys') {
                const {newText: newKeys, count: keyCount} = processField((entry.key || []).join(', '));
                if(keyCount > 0) { entry.key = newKeys.split(',').map(k => k.trim()).filter(Boolean); replacementsCount += keyCount; changed = true; }

                const {newText: newSecKeys, count: secKeyCount} = processField((entry.keysecondary || []).join(', '));
                if(secKeyCount > 0) { entry.keysecondary = newSecKeys.split(',').map(k => k.trim()).filter(Boolean); replacementsCount += secKeyCount; changed = true; }
            }
            
            if(changed) affectedEntries.add(entry._internalId);
        });

        if (replacementsCount > 0) {
            showToast('success', `Performed ${replacementsCount} replacements across ${affectedEntries.size} entries.`);
            this.app.refreshEntryList();
        } else {
            showToast('info', 'No occurrences found to replace.');
        }

        this.closeModal();
    }
    
    performSingleReplacement(entry, fieldName, originalText, index, matchText, replaceTerm) {
        const newText = originalText.substring(0, index) + replaceTerm + originalText.substring(index + matchText.length);
        
        switch (fieldName) {
            case 'Name':
                entry.comment = newText;
                break;
            case 'Content':
                entry.content = newText;
                break;
            case 'Keys':
                entry.key = newText.split(',').map(k => k.trim()).filter(Boolean);
                break;
            case 'Secondary Keys':
                entry.keysecondary = newText.split(',').map(k => k.trim()).filter(Boolean);
                break;
        }
        
        this.app.refreshEntryList(); // Update the main view
    }
}