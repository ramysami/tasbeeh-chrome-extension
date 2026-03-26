# GEMINI.md - Tasbeeh Chrome Extension

## Project Overview
Tasbeeh is a Chrome extension providing periodic Islamic "zikr" (remembrances) via a floating overlay.

### Performance Optimized Architecture
- **Background Orchestration:** Uses a single `service-worker.js` and the `chrome.alarms` API to manage timing across all browser tabs.
- **Passive Content Script:** Injects the UI only when signaled by the background process, minimizing tab memory and CPU overhead.

## Project Structure
- `manifest.json`: Extension configuration and permissions.
- `assets/`:
    - `icons/`: Extension branding (16, 32, 48, 128).
    - `promo/`: Chrome Web Store promotional assets.
- `src/`:
    - **`data/`**: Centralized static data.
        - `constants.js`: Random phrases and theme definitions.
        - `azkar.js`: Curated lists for morning and evening remembrances.
    - **`content/`**:
        - `content.js`: Logic for DOM injection, styles, and display lifecycle.
    - **`background/`**:
        - `service-worker.js`: Central "brain" managing settings and alarms.
    - **`popup/`**:
        - `popup.html` & `popup.js`: Settings interface.

## Getting Started
1. Load the root directory as an "Unpacked extension" in `chrome://extensions/`.
2. The service worker will initialize the default 5-minute interval.

## Development Conventions
- **Data vs. Logic:** All static content (phrases, themes, lists) must reside in `src/data/`.
- **Resource Efficiency:** Avoid `setInterval` in content scripts; always delegate timing to the background service worker.
- **Clean Assets:** Only maintain icons explicitly referenced in `manifest.json` or required for store listings.
