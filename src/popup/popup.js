const defaults = { theme: 'modern', duration: 15, fontSize: 20, interval: 5, azkarMode: 'general', position: 'top-right', enabled: true };

const toggle = document.getElementById('enabled-toggle');
const toggleLabel = document.getElementById('toggle-label');

chrome.storage.sync.get(defaults, (settings) => {
    toggle.checked = settings.enabled !== false;
    toggleLabel.textContent = toggle.checked ? 'Azkar Enabled' : 'Azkar Disabled';

    document.querySelector(`[data-azkar="${settings.azkarMode}"]`)?.classList.add('selected');
    document.querySelector(`[data-theme="${settings.theme}"]`)?.classList.add('selected');
    document.querySelector(`[data-position="${settings.position}"]`)?.classList.add('selected');
    document.querySelector(`[data-interval="${settings.interval}"]`)?.classList.add('selected');
    document.querySelector(`[data-duration="${settings.duration}"]`)?.classList.add('selected');
    document.querySelector(`[data-fontsize="${settings.fontSize}"]`)?.classList.add('selected');
});

// Enable / disable toggle
toggle.addEventListener('change', () => {
    chrome.storage.sync.set({ enabled: toggle.checked });
    toggleLabel.textContent = toggle.checked ? 'Azkar Enabled' : 'Azkar Disabled';
});

// Azkar mode
document.querySelectorAll('[data-azkar]').forEach(card => {
    card.addEventListener('click', () => {
        chrome.storage.sync.set({ azkarMode: card.dataset.azkar });
        document.querySelectorAll('[data-azkar]').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
    });
});

// Theme
document.querySelectorAll('[data-theme]').forEach(card => {
    card.addEventListener('click', () => {
        chrome.storage.sync.set({ theme: card.dataset.theme });
        document.querySelectorAll('[data-theme]').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
    });
});

// Position
document.querySelectorAll('[data-position]').forEach(chip => {
    chip.addEventListener('click', () => {
        chrome.storage.sync.set({ position: chip.dataset.position });
        document.querySelectorAll('[data-position]').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
    });
});

// Interval
document.querySelectorAll('[data-interval]').forEach(chip => {
    chip.addEventListener('click', () => {
        chrome.storage.sync.set({ interval: Number(chip.dataset.interval) });
        document.querySelectorAll('[data-interval]').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
    });
});

// Duration
document.querySelectorAll('[data-duration]').forEach(chip => {
    chip.addEventListener('click', () => {
        chrome.storage.sync.set({ duration: Number(chip.dataset.duration) });
        document.querySelectorAll('[data-duration]').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
    });
});

// Font size
document.querySelectorAll('[data-fontsize]').forEach(chip => {
    chip.addEventListener('click', () => {
        chrome.storage.sync.set({ fontSize: Number(chip.dataset.fontsize) });
        document.querySelectorAll('[data-fontsize]').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
    });
});
