// src/content/content.js

try {
    let currentContainer = null;

    const animateOut = (container) => {
        if (!container) return;
        
        // Prevent multiple calls
        if (container.classList.contains('hiding')) return;
        
        container.classList.add('hiding');
        
        // Specifically wait for the tasbeeh-out animation to finish
        const handleAnimationEnd = (e) => {
            if (e.animationName === 'tasbeeh-out') {
                container.removeEventListener('animationend', handleAnimationEnd);
                container.remove();
            }
        };
        
        container.addEventListener('animationend', handleAnimationEnd);
        
        if (currentContainer === container) currentContainer = null;
    };

    const isDarkPage = () => {
        // 1. Explicit Attributes (Higher Priority)
        const html = document.documentElement;
        const body = document.body;
        
        const darkAttributes = ['data-theme', 'theme', 'data-bs-theme', 'data-color-mode'];
        for (const attr of darkAttributes) {
            const val = html.getAttribute(attr) || body.getAttribute(attr);
            if (val && val.toLowerCase().includes('dark')) return true;
            if (val && val.toLowerCase().includes('light')) return false;
        }

        // 2. Class Names
        const darkClasses = ['dark', 'dark-mode', 'theme-dark', 'night-mode'];
        if (darkClasses.some(cls => html.classList.contains(cls) || body.classList.contains(cls))) {
            return true;
        }

        // 3. CSS Color Scheme Property
        const htmlStyle = window.getComputedStyle(html);
        if (htmlStyle.colorScheme === 'dark') return true;
        if (htmlStyle.colorScheme === 'light') return false;

        // 4. Visual Analysis (Luminance check)
        const getLuminance = (rgbStr) => {
            if (!rgbStr || rgbStr === 'transparent' || rgbStr === 'rgba(0, 0, 0, 0)') return null;
            const rgb = rgbStr.match(/\d+/g);
            if (!rgb || rgb.length < 3) return null;
            // Standard relative luminance formula
            return (0.2126 * parseInt(rgb[0]) + 0.7152 * parseInt(rgb[1]) + 0.0722 * parseInt(rgb[2])) / 255;
        };

        // Check background of body or html
        const bodyBg = window.getComputedStyle(body).backgroundColor;
        const htmlBg = window.getComputedStyle(html).backgroundColor;
        const bgLum = getLuminance(bodyBg) ?? getLuminance(htmlBg);

        // Check text color (Inverse signal: light text usually means dark background)
        const bodyColor = window.getComputedStyle(body).color;
        const textLum = getLuminance(bodyColor);

        if (bgLum !== null) {
            return bgLum < 0.5;
        }

        // If background is transparent/unset, rely on text color
        if (textLum !== null) {
            return textLum > 0.6; // Light text -> Dark page
        }

        // 5. System Preference (Final Fallback)
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
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
        label.textContent = phrase.label || '✦ تسبيح';

        const closeBtn = document.createElement('button');
        closeBtn.id = 'tasbeeh-close';
        closeBtn.textContent = '✕';
        closeBtn.addEventListener('click', () => animateOut(container));

        header.appendChild(label);
        header.appendChild(closeBtn);

        // Progress indicator
        const progress = document.createElement('div');
        progress.id = 'tasbeeh-progress';
        const progressBar = document.createElement('div');
        progressBar.id = 'tasbeeh-progress-bar';
        
        // Stop animationend from bubbling up to container
        progressBar.addEventListener('animationend', (e) => e.stopPropagation());
        
        // Set duration from settings with fallback
        const duration = settings.duration || 15;
        progressBar.style.animationDuration = `${duration}s`;
        
        progress.appendChild(progressBar);

        // Phrase
        const phraseDiv = document.createElement('div');
        phraseDiv.id = 'tasbeeh-phrase';
        phraseDiv.textContent = phrase.text;
        phraseDiv.style.fontSize = `${settings.fontSize || 20}px`;

        container.appendChild(header);
        container.appendChild(progress);
        container.appendChild(phraseDiv);
        
        return container;
    };

    const showContainer = (phrase, settings) => {
        if (currentContainer) {
            currentContainer.remove();
        }

        currentContainer = buildContainer(settings, phrase);
        document.body.appendChild(currentContainer);

        const duration = settings.duration || 15;
        setTimeout(() => {
            if (currentContainer && document.body.contains(currentContainer)) {
                animateOut(currentContainer);
            }
        }, duration * 1000);
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
