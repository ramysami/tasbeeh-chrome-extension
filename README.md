# Tasbeeh Chrome Extension

A modern, high-performance Chrome extension for periodic Islamic "Zikr" and "Tasbeeh" remembrances. Designed with a clean aesthetic and minimal impact on system resources.

## 🌟 Key Features

- **Multi-Theme Support:** Choose between Clean Modern, Dark Elegant, and Minimal themes.
- **Smart Scheduling:** Uses the `chrome.alarms` API for centralized, battery-efficient timing.
- **Customizable Intervals:** Set reminders from every 1 minute to 1 hour.
- **Adaptive Content:** Automatically switches between morning and evening Azkar based on the time of day.
- **Responsive UI:** Instant settings updates with zero "UI flash" using synchronous storage mirroring.
- **Non-Intrusive:** Beautifully animated overlays that appear on the active tab without interrupting your workflow.

## Screenshot
![screenshot 1](https://github.com/emam4/tasbeeh-chrome-extenion/assets/119869254/5aeb3000-0900-4e34-b78e-4b0228ee4a41)
## 🏗️ Technical Architecture

Tasbeeh 2.0 has been completely restructured for maximum performance:

- **Manifest V3:** Fully compliant with the latest Chrome extension standards.
- **Service Worker (Background):** Centralizes all logic, timing, and storage management to eliminate per-tab overhead.
- **Pure View Rendering:** Content scripts are lightweight and purely reactive, only acting when signaled by the background worker.
- **CSS-First Animations:** Uses declarative CSS animations and `backdrop-filter` for smooth, hardware-accelerated transitions.

## 📁 Project Structure

```text
/assets/          # Icons and promotional materials
/src/
  /background/    # Service worker (Timing & Logic)
  /content/       # Content script & Global styles (Rendering)
  /data/          # Zikr phrases & Configuration constants
  /popup/         # Settings interface
```

## 🛠️ Installation (Developer Mode)

1. Clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right.
4. Click "Load unpacked" and select the project root directory.

## 📜 License

MIT License. Feel free to contribute or suggest improvements!
