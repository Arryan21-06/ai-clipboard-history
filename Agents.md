# AI Clipboard History — Chrome Extension

## Project type
Chrome Extension, Manifest V3 (MV3)

## Architecture
- manifest.json — Extension config, permissions, entry points
- content.js — Injected into every webpage, captures copy events
- background.js — MV3 Service Worker, receives messages, handles storage
- popup/popup.html — Extension popup UI
- popup/popup.js — Popup logic, reads from chrome.storage, renders list
- popup/popup.css — Popup styles

## Critical MV3 constraint
Service workers (background.js) CANNOT directly access the clipboard.
Copy events MUST be captured in content.js and relayed via chrome.runtime.sendMessage().

## Data model
Each clip object: { id: number, text: string, timestamp: number, pinned: boolean, title: string|null }
Stored as array in chrome.storage.local under key "clips". Max 100 items.

## No build tools
Plain HTML/CSS/JS only. No webpack, no npm, no React. Extension loads directly in chrome://extensions.
