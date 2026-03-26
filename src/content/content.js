// src/content/content.js

try {
    let currentContainer = null;

    const animateOut = (container) => {
        if (!container) return;
        container.classList.add('hiding');
        container.addEventListener('animationend', () => container.remove(), { once: true });
        if (currentContainer === container) currentContainer = null;
    };

    const buildContainer = (settings, phrase) => {
        const container = document.createElement('div');
        container.id = 'tasbeeh-container';
        
        // Add theme and position classes
        container.classList.add(`theme-${settings.theme}`);
        container.classList.add(`pos-${settings.position}`);

        // Header
        const header = document.createElement('div');
        header.id = 'tasbeeh-header';

        const label = document.createElement('span');
        label.id = 'tasbeeh-label';
        label.textContent = phrase.label;

        const closeBtn = document.createElement('button');
        closeBtn.id = 'tasbeeh-close';
        closeBtn.textContent = '✕';
        closeBtn.addEventListener('click', () => animateOut(container));

        header.appendChild(label);
        header.appendChild(closeBtn);

        // Phrase
        const phraseDiv = document.createElement('div');
        phraseDiv.id = 'tasbeeh-phrase';
        phraseDiv.textContent = phrase.text;
        phraseDiv.style.fontSize = `${settings.fontSize}px`;

        container.appendChild(header);
        container.appendChild(phraseDiv);
        
        return container;
    };

    const showContainer = (phrase, settings) => {
        if (currentContainer) {
            currentContainer.remove();
        }

        currentContainer = buildContainer(settings, phrase);
        document.body.appendChild(currentContainer);

        setTimeout(() => {
            if (currentContainer && document.body.contains(currentContainer)) {
                animateOut(currentContainer);
            }
        }, settings.duration * 1000);
    };

    // Listen for commands from the background service worker
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'show-zikr') {
            showContainer(request.phrase, request.settings);
        }
    });

} catch (e) {
    console.error('Tasbeeh Extension Error:', e);
}
