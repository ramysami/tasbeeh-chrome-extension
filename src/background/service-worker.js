// src/background/service-worker.js

const DEFAULTS = {
    theme: 'modern',
    duration: 15,
    fontSize: 20,
    interval: 5,
    azkarMode: 'general',
    position: 'top-right',
    enabled: true
};

// We need to import the data to choose phrases
importScripts('../data/data.js');

// Initialize alarms on installation or startup
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(DEFAULTS, (settings) => {
        setupAlarm(settings.interval);
    });
});

// Update alarms when settings change
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.interval) {
        setupAlarm(changes.interval.newValue);
    }
});

function setupAlarm(intervalInMinutes) {
    chrome.alarms.clear('tasbeeh-alarm', () => {
        chrome.alarms.create('tasbeeh-alarm', {
            periodInMinutes: intervalInMinutes || DEFAULTS.interval
        });
    });
}

const getPhrase = (azkarMode, callback) => {
    if (azkarMode === 'morning_evening') {
        const hour = new Date().getHours();
        const isMorning = hour >= 6 && hour < 16;
        const array = isMorning ? azkatAlsabah : azkatAlmasaa;
        const indexKey = isMorning ? 'sabahIndex' : 'masaaIndex';
        const label = isMorning ? '✦ أذكار الصباح' : '✦ أذكار المساء';

        const dateKey = indexKey + 'Date';
        const today = new Date().toDateString();

        chrome.storage.local.get({ [indexKey]: 0, [dateKey]: '' }, (d) => {
            const index = d[dateKey] === today ? d[indexKey] : 0;
            const safeIndex = index % array.length;
            const isLast = safeIndex === array.length - 1;

            chrome.storage.local.set({ [indexKey]: index + 1, [dateKey]: today });

            // Auto-switch back to general after the last zikr
            if (isLast) {
                chrome.storage.sync.set({ azkarMode: 'general' });
            }

            callback({ text: array[safeIndex].zekr, label });
        });
    } else {
        callback({
            text: tasbeehPhrases[Math.floor(Math.random() * tasbeehPhrases.length)],
            label: '✦ تسبيح',
        });
    }
};

// When the alarm triggers, notify the active tab(s)
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'tasbeeh-alarm') {
        chrome.storage.sync.get(DEFAULTS, (settings) => {
            if (settings.enabled) {
                getPhrase(settings.azkarMode, (phrase) => {
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        tabs.forEach(tab => {
                            chrome.tabs.sendMessage(tab.id, { 
                                action: 'show-zikr',
                                phrase: phrase,
                                settings: settings
                            }, () => {
                                if (chrome.runtime.lastError) { /* ignore */ }
                            });
                        });
                    });
                });
            }
        });
    }
});

