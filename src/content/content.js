// src/content/content.js

try {
    let currentContainer = null;

    const animateOut = (container) => {
        if (!container) return;
        container.classList.add('hiding');
        container.addEventListener('animationend', () => container.remove(), { once: true });
        if (currentContainer === container) currentContainer = null;
    };

    const isDarkPage = () => {
        const getBgColor = (el) => {
            if (!el) return null;
            const style = window.getComputedStyle(el);
            const color = style.backgroundColor;
            // Check if color is actually set (not transparent)
            if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
                return color;
            }
            return null;
        };

        // Try to get background from body, then html
        let bgColor = getBgColor(document.body) || getBgColor(document.documentElement);
        
        if (bgColor) {
            const rgb = bgColor.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                // Calculate perceived brightness (YIQ formula)
                const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                return brightness < 128;
            }
        }

        // Fallback to system preference ONLY if we can't detect a specific background color
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }

        return false;
    };

    const buildContainer = (settings, phrase) => {
        const container = document.createElement('div');
        container.id = 'tasbeeh-container';
        
        // Add theme and position classes
        let theme = settings.theme;
        if (theme === 'auto') {
            theme = isDarkPage() ? 'dark' : 'modern';
        }
        container.classList.add(`theme-${theme}`);
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
