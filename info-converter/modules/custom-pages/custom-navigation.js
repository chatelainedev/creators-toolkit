// Modal-specific horizontal links data
let modalHorizontalLinksData = [];

// Add horizontal link in modal
function addModalHorizontalLink() {
    if (modalHorizontalLinksData.length >= 5) {
        if (typeof showToast === 'function') {
            showToast('warning', 'Maximum of 5 horizontal links allowed');
        } else {
            alert('Maximum of 5 horizontal links allowed');
        }
        return;
    }
    
    const newLink = {
        id: Date.now(),
        text: '',
        url: '',
        icon: ''
    };
    
    modalHorizontalLinksData.push(newLink);
    renderModalHorizontalLinks();
}

// Remove modal horizontal link
function removeModalHorizontalLink(linkId) {
    modalHorizontalLinksData = modalHorizontalLinksData.filter(link => link.id !== linkId);
    renderModalHorizontalLinks();
}

// Render modal horizontal links
function renderModalHorizontalLinks() {
    const container = document.getElementById('modal-horizontal-links-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (modalHorizontalLinksData.length === 0) {
        container.innerHTML = '<div class="overview-links-empty">No horizontal links added yet</div>';
        return;
    }
    
    modalHorizontalLinksData.forEach(link => {
        const linkElement = createModalHorizontalLinkElement(link);
        container.appendChild(linkElement);
    });
}

// Create modal horizontal link element
function createModalHorizontalLinkElement(link) {
    const linkElement = document.createElement('div');
    linkElement.className = 'overview-link-item';
    linkElement.innerHTML = `
        <input type="text" placeholder="Link text (optional)" value="${link.text || ''}" 
               onchange="updateModalHorizontalLinkData(${link.id}, 'text', this.value)">
        <input type="text" placeholder="URL or #pagename" value="${link.url || ''}"
               onchange="updateModalHorizontalLinkData(${link.id}, 'url', this.value)">
        <select onchange="updateModalHorizontalLinkData(${link.id}, 'icon', this.value)">
            <option value="">No Icon</option>
            <optgroup label="Navigation">
                <option value="home" ${link.icon === 'home' ? 'selected' : ''}>Home</option>
                <option value="arrow-right" ${link.icon === 'arrow-right' ? 'selected' : ''}>Arrow Right</option>
                <option value="arrow-left" ${link.icon === 'arrow-left' ? 'selected' : ''}>Arrow Left</option>
                <option value="arrow-up" ${link.icon === 'arrow-up' ? 'selected' : ''}>Arrow Up</option>
                <option value="arrow-down" ${link.icon === 'arrow-down' ? 'selected' : ''}>Arrow Down</option>
                <option value="link" ${link.icon === 'link' ? 'selected' : ''}>Link</option>
                <option value="external-link-alt" ${link.icon === 'external-link-alt' ? 'selected' : ''}>External Link</option>
                <option value="compass" ${link.icon === 'compass' ? 'selected' : ''}>Compass</option>
                <option value="map" ${link.icon === 'map' ? 'selected' : ''}>Map</option>
                <option value="map-marker-alt" ${link.icon === 'map-marker-alt' ? 'selected' : ''}>Location</option>
            </optgroup>
            <optgroup label="Content & Media">
                <option value="book" ${link.icon === 'book' ? 'selected' : ''}>Book</option>
                <option value="book-open" ${link.icon === 'book-open' ? 'selected' : ''}>Open Book</option>
                <option value="file" ${link.icon === 'file' ? 'selected' : ''}>File</option>
                <option value="file-alt" ${link.icon === 'file-alt' ? 'selected' : ''}>Document</option>
                <option value="image" ${link.icon === 'image' ? 'selected' : ''}>Image</option>
                <option value="images" ${link.icon === 'images' ? 'selected' : ''}>Images</option>
                <option value="video" ${link.icon === 'video' ? 'selected' : ''}>Video</option>
                <option value="music" ${link.icon === 'music' ? 'selected' : ''}>Music</option>
                <option value="download" ${link.icon === 'download' ? 'selected' : ''}>Download</option>
                <option value="upload" ${link.icon === 'upload' ? 'selected' : ''}>Upload</option>
            </optgroup>
            <optgroup label="Communication">
                <option value="envelope" ${link.icon === 'envelope' ? 'selected' : ''}>Email</option>
                <option value="comments" ${link.icon === 'comments' ? 'selected' : ''}>Chat</option>
                <option value="comment" ${link.icon === 'comment' ? 'selected' : ''}>Comment</option>
                <option value="bell" ${link.icon === 'bell' ? 'selected' : ''}>Notification</option>
                <option value="bullhorn" ${link.icon === 'bullhorn' ? 'selected' : ''}>Announce</option>
            </optgroup>
            <optgroup label="Symbols & Icons">
                <option value="star" ${link.icon === 'star' ? 'selected' : ''}>Star</option>
                <option value="heart" ${link.icon === 'heart' ? 'selected' : ''}>Heart</option>
                <option value="crown" ${link.icon === 'crown' ? 'selected' : ''}>Crown</option>
                <option value="fire" ${link.icon === 'fire' ? 'selected' : ''}>Fire</option>
                <option value="bolt" ${link.icon === 'bolt' ? 'selected' : ''}>Lightning</option>
                <option value="gem" ${link.icon === 'gem' ? 'selected' : ''}>Gem</option>
                <option value="shield-alt" ${link.icon === 'shield-alt' ? 'selected' : ''}>Shield</option>
                <option value="sword" ${link.icon === 'sword' ? 'selected' : ''}>Sword</option>
                <option value="magic" ${link.icon === 'magic' ? 'selected' : ''}>Magic</option>
                <option value="eye" ${link.icon === 'eye' ? 'selected' : ''}>Eye</option>
                <option value="moon" ${link.icon === 'moon' ? 'selected' : ''}>Moon</option>
                <option value="sun" ${link.icon === 'sun' ? 'selected' : ''}>Sun</option>
                <option value="tree" ${link.icon === 'tree' ? 'selected' : ''}>Tree</option>
                <option value="mountain" ${link.icon === 'mountain' ? 'selected' : ''}>Mountain</option>
            </optgroup>
            <optgroup label="People & Characters">
                <option value="user" ${link.icon === 'user' ? 'selected' : ''}>User</option>
                <option value="users" ${link.icon === 'users' ? 'selected' : ''}>Users</option>
                <option value="user-friends" ${link.icon === 'user-friends' ? 'selected' : ''}>Friends</option>
                <option value="user-tie" ${link.icon === 'user-tie' ? 'selected' : ''}>Professional</option>
                <option value="user-secret" ${link.icon === 'user-secret' ? 'selected' : ''}>Secret Agent</option>
                <option value="user-ninja" ${link.icon === 'user-ninja' ? 'selected' : ''}>Ninja</option>
            </optgroup>
            <optgroup label="Gaming & Fantasy">
                <option value="dice" ${link.icon === 'dice' ? 'selected' : ''}>Dice</option>
                <option value="dice-d20" ${link.icon === 'dice-d20' ? 'selected' : ''}>D20</option>
                <option value="chess" ${link.icon === 'chess' ? 'selected' : ''}>Chess</option>
                <option value="gamepad" ${link.icon === 'gamepad' ? 'selected' : ''}>Gamepad</option>
                <option value="dragon" ${link.icon === 'dragon' ? 'selected' : ''}>Dragon</option>
                <option value="dungeon" ${link.icon === 'dungeon' ? 'selected' : ''}>Dungeon</option>
                <option value="hat-wizard" ${link.icon === 'hat-wizard' ? 'selected' : ''}>Wizard Hat</option>
            </optgroup>
            <optgroup label="Business & Shopping">
                <option value="dollar-sign" ${link.icon === 'dollar-sign' ? 'selected' : ''}>Money</option>
                <option value="chart-line" ${link.icon === 'chart-line' ? 'selected' : ''}>Chart</option>
                <option value="briefcase" ${link.icon === 'briefcase' ? 'selected' : ''}>Briefcase</option>
            </optgroup>
            <optgroup label="Information">
                <option value="info-circle" ${link.icon === 'info-circle' ? 'selected' : ''}>Info</option>
                <option value="question-circle" ${link.icon === 'question-circle' ? 'selected' : ''}>Help</option>
                <option value="exclamation-triangle" ${link.icon === 'exclamation-triangle' ? 'selected' : ''}>Warning</option>
                <option value="lightbulb" ${link.icon === 'lightbulb' ? 'selected' : ''}>Idea</option>
            </optgroup>
        </select>
        <button type="button" onclick="removeModalHorizontalLink(${link.id})" class="btn-remove">×</button>
    `;
    return linkElement;
}

// Update modal horizontal link data
function updateModalHorizontalLinkData(linkId, field, value) {
    const link = modalHorizontalLinksData.find(l => l.id === linkId);
    if (link) {
        link[field] = value;
    }
}

// Update modal horizontal links settings
function updateModalHorizontalLinksSettings() {
    // This could be used to update preview or validation if needed
}