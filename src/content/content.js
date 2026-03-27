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
