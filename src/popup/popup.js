const defaults = { theme: 'auto', duration: 15, fontSize: 20, interval: 5, azkarMode: 'general', position: 'top-right', enabled: true };

const toggle = document.getElementById('enabled-toggle');
const toggleLabel = document.getElementById('toggle-label');

// Helper to apply settings to UI
const applySettingsToUI = (settings) => {
    toggle.checked = settings.enabled !== false;
    toggleLabel.textContent = toggle.checked ? 'Azkar Enabled' : 'Azkar Disabled';

    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));

    document.querySelector(`[data-azkar="${settings.azkarMode}"]`)?.classList.add('selected');
    document.querySelector(`[data-theme="${settings.theme}"]`)?.classList.add('selected');
    document.querySelector(`[data-position="${settings.position}"]`)?.classList.add('selected');
    document.querySelector(`[data-interval="${settings.interval}"]`)?.classList.add('selected');
    document.querySelector(`[data-duration="${settings.duration}"]`)?.classList.add('selected');
    document.querySelector(`[data-fontsize="${settings.fontSize}"]`)?.classList.add('selected');
};

// 1. Instant sync load from localStorage (Mirror)
try {
    const cached = localStorage.getItem('tasbeeh-settings');
    if (cached) {
        applySettingsToUI(JSON.parse(cached));
    }
} catch (e) {}

// 2. Async load from Source of Truth (chrome.storage)
chrome.storage.sync.get(defaults, (settings) => {
    applySettingsToUI(settings);
    // Refresh mirror
    localStorage.setItem('tasbeeh-settings', JSON.stringify(settings));
});

// Helper to save setting and update mirror
const saveSetting = (key, value) => {
    chrome.storage.sync.set({ [key]: value }, () => {
        // Update mirror after successful save
        chrome.storage.sync.get(defaults, (settings) => {
            localStorage.setItem('tasbeeh-settings', JSON.stringify(settings));
        });
    });
};

// Enable / disable toggle
toggle.addEventListener('change', () => {
    saveSetting('enabled', toggle.checked);
    toggleLabel.textContent = toggle.checked ? 'Azkar Enabled' : 'Azkar Disabled';
});

// Azkar mode
document.querySelectorAll('[data-azkar]').forEach(card => {
    card.addEventListener('click', () => {
        saveSetting('azkarMode', card.dataset.azkar);
        document.querySelectorAll('[data-azkar]').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
    });
});

// Theme
document.querySelectorAll('[data-theme]').forEach(card => {
    card.addEventListener('click', () => {
        saveSetting('theme', card.dataset.theme);
        document.querySelectorAll('[data-theme]').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
    });
});

// Position
document.querySelectorAll('[data-position]').forEach(chip => {
    chip.addEventListener('click', () => {
        saveSetting('position', chip.dataset.position);
        document.querySelectorAll('[data-position]').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
    });
});

// Interval
document.querySelectorAll('[data-interval]').forEach(chip => {
    chip.addEventListener('click', () => {
        const val = Number(chip.dataset.interval);
        saveSetting('interval', val);
        document.querySelectorAll('[data-interval]').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
    });
});

// Duration
document.querySelectorAll('[data-duration]').forEach(chip => {
    chip.addEventListener('click', () => {
        const val = Number(chip.dataset.duration);
        saveSetting('duration', val);
        document.querySelectorAll('[data-duration]').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
    });
});

// Font size
document.querySelectorAll('[data-fontsize]').forEach(chip => {
    chip.addEventListener('click', () => {
        const val = Number(chip.dataset.fontsize);
        saveSetting('fontSize', val);
        document.querySelectorAll('[data-fontsize]').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
    });
});
