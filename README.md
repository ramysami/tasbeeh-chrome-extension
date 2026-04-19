# Tasbeeh (تسبيح) Chrome Extension

A modern, high-performance Chrome extension that provides periodic Islamic remembrances (Zikr) via a beautiful, non-intrusive floating overlay.

## ✨ Features

-   **Periodic Reminders:** Stay connected with automatic Zikr notifications at intervals of your choice.
-   **Morning & Evening Adhkar:** Specialized modes for specific times of the day.
-   **Beautiful Themes:** Choose between **Modern**, **Dark**, **Minimal** or **Auto** styles to match your browsing experience.
-   **Non-Intrusive Design:** Elegant floating cards that appear and vanish smoothly without interrupting your workflow.

---

## 📸 Screenshots

| Settings Popup | Zikr Overlay |
| :---: | :---: |
| <img width="362" height="576" alt="image" src="https://github.com/user-attachments/assets/bfbd2935-cdcf-4117-bae6-988116fd7e29" /> | <img width="250"  alt="image" src="https://github.com/user-attachments/assets/b359d5ed-c395-4da6-b5bc-71245e4a3faa" />  |

---

## 🛠 Technical Architecture (Manifest V3)

Tasbeeh is built with a focus on performance and minimal resource footprint:

-   **Service Worker (Central Brain):** Handles all scheduling logic using `chrome.alarms` and logic decisions, ensuring the extension stays dormant when not needed.
-   **Pure View Content Script:** Strictly handles DOM injection and rendering only when signaled by the background, resulting in **zero CPU/Memory overhead** on idle tabs.
-   **Hardware-Accelerated CSS:** Uses optimized animations and `backdrop-filter` for a premium, smooth UI feel.
-   **Synchronous State Mirroring:** Employs a  `chrome.storage` to `localStorage` mirroring technique for the popup UI to eliminate the "async flash" of unstyled settings.

## 🚀 Installation

### Manual Installation (Development)
1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the project root directory.


## 📂 Project Structure

```text
├── assets/             # Icons
├── src/
│   ├── background/     # Service worker logic (alarms, storage management)
│   ├── content/        # UI rendering (CSS themes, DOM injection)
│   ├── data/           # Zikr dictionary and static constants
│   └── popup/          # Settings interface (HTML/JS)
└── manifest.json       # Extension configuration
```
