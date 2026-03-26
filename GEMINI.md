# GEMINI.md - Tasbeeh Chrome Extension

## Project Overview
Tasbeeh is a modern, high-performance Chrome extension that provides periodic Islamic remembrances (Zikr) via a beautiful, non-intrusive floating overlay.

### High-Performance Architecture (MV3)
- **Centralized Brain:** The `service-worker.js` (Background) handles all logic: timing (`chrome.alarms`), settings retrieval, and phrase selection. This prevents unnecessary resource usage when the extension is idle.
- **Pure View Content Script:** `content.js` is strictly a renderer. It only creates and manages the UI when it receives a specific message from the background. This architecture ensures zero CPU/memory overhead on active tabs until needed.
- **Reliable Timing:** Using `chrome.alarms` ensures the Zikr schedule is accurate and persistent, even when the browser puts the service worker to sleep.
- **Zero-Latency UI:** The popup settings interface mirrors `chrome.storage.sync` to `localStorage` ('tasbeeh-settings'). This allows the UI to reflect the user's selected state (e.g., bolding/selected chips) instantly upon opening, without the typical async "flash" of unstyled content.

## Project Structure
- `manifest.json`: Configuration, permissions (storage, alarms), and file mapping.
- `assets/`: Contains `icons/` (standard sizes) and `promo/` (store images).
- `src/`:
    - **`background/`**: `service-worker.js` (The extension's main logic engine).
    - **`content/`**: 
        - `content.js`: Receives data and manages DOM injection.
        - `content.css`: Declarative themes (Modern, Dark, Minimal), entry/exit animations, and high-specificity layout rules.
    - **`data/`**: 
        - `data.js`: Centralized dictionary for general, morning, and evening phrases.
        - `constants.js`: Static configuration and theme definitions.
    - **`popup/`**: `popup.html` and `popup.js` (Settings management).

## Design & UI Conventions
- **Rounded Aesthetics:** All UI elements (cards, chips, sliders) use a consistent `border-radius` (12px to 20px) and `overflow: hidden` to ensure a smooth, modern look.
- **Performance-First Animations:** Uses hardware-accelerated CSS animations (`tasbeeh-in`, `tasbeeh-out`) and `backdrop-filter: blur` for a premium feel.
- **Declarative Styles:** Preference for `.theme-modern`, `.theme-dark`, and `.theme-minimal` CSS classes in `content.css` over imperative JS styling to keep the DOM clean and performant.
- **Isolation:** Content script styles use high specificity and `!important` tags to ensure the Zikr card is rendered correctly across any website, regardless of host-page CSS.

## Development Mandates
1. **Logic Separation:** Never perform timing or "logic decisions" in the content script.
2. **Synchronous UI:** Always use the `localStorage` mirror for the popup to maintain instant feedback.
3. **Storage Usage:**
    - `chrome.storage.sync`: For persistent user settings.
    - `chrome.storage.local`: For session-based state (e.g., current Zikr index for morning/evening modes).
    - `localStorage`: Exclusively for synchronous UI state mirroring in the popup.
