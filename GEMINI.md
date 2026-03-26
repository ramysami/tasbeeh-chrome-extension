# GEMINI.md - Tasbeeh Chrome Extension

## Project Overview
Tasbeeh is a Chrome extension providing periodic Islamic "zikr" (remembrances) via a floating overlay.

### High-Performance Architecture
- **Centralized Brain:** The `service-worker.js` manages all timing (via `chrome.alarms`), settings retrieval, and zikr selection.
- **Pure View Content Script:** `content.js` is a lightweight renderer that only acts when signaled by the background. It uses declarative CSS for styling, minimizing CPU/memory impact on active tabs.
- **Zero Background Overhead:** Using the Alarms API ensures the extension doesn't consume resources when not actively showing a zikr.

## Project Structure
- `manifest.json`: Extension configuration and permissions.
- `assets/`: Icons and promotional images.
- `src/`:
    - **`background/`**:
        - `service-worker.js`: Handles alarms, storage, and zikr logic.
    - **`content/`**:
        - `content.js`: Injects the UI based on background messages.
        - `content.css`: Declarative themes and animations.
    - **`data/`**:
        - `data.js`: All zikr phrases and morning/evening lists.
        - `constants.js`: Theme definitions and static config.
    - **`popup/`**:
        - `popup.html` & `popup.js`: Settings interface.

## Development Conventions
- **Logic Placement:** All "decisions" (what to show, when to show) must happen in the background script.
- **Content Script:** Keep `content.js` focused purely on DOM manipulation and rendering.
- **Styling:** Use `content.css` classes for themes instead of inline styles.
- **Storage:** Use `chrome.storage.sync` for settings and `chrome.storage.local` for session-based state (like zikr indices).
