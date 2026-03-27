# GenZ Comment Booster

## Stop Sounding Like an UNC on LinkedIn ✨

A Chrome extension that transforms your boring LinkedIn comments into GenZ-vibed fire using Gemini AI.

### Features

- **Instant Vibe Check**: Transform stiff drafts into resonating comments
- **Calibrated Chaos**: Slider from 1-100 to control GenZ energy level
- **Match the Energy**: Three styles - Crisp, Replicate, Exaggerate
- **Privacy First**: No login needed, fully client-side, API key stored locally

### Installation

1. **Get a Free Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a free API key (starts with `AIza`)
   - Free tier: ~1000 requests/day

2. **Install the Extension**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select this folder

3. **Configure**
   - Click the extension icon
   - Enter your Gemini API key
   - Set your default GenZ level and style

### Usage

1. Scroll your LinkedIn feed
2. Click comment on any post
3. Type your boring draft
4. Click the ✨ floating button
5. Adjust vibe level and style
6. Click "Generate Magic" ✨
7. Comment auto-pastes - edit if needed, then post!

### GenZ Level Guide

| Range | Style | Example |
|-------|-------|---------|
| 1-33 | Professional | "Solid insights here! 👍" |
| 34-66 | Balanced | "This slaps fr! Great points." |
| 67-100 | Maximum Chaos | "NAHHH THIS HITS DIFFERENT NO CAP 🔥💀" |

### Styles Explained

- **Crisp**: Short, punchy, 1-2 sentences max
- **Replicate**: Match the energy of the original post
- **Exaggerate**: Maximum slang, enthusiasm off the charts

### Tech Stack

- Chrome Extension Manifest V3
- Vanilla JavaScript (no frameworks)
- Gemini Pro API for generation
- CSS-in-file for styling
- Chrome Storage Sync for settings

### File Structure

```
genzily/
├── manifest.json          # Extension manifest
├── settings.html          # Settings page
├── settings.js            # Settings logic
├── index.html             # Landing page
├── icon16.png             # Extension icons
├── icon48.png
├── icon128.png
├── content/
│   ├── content.js         # Main content script
│   └── content.css        # Dialog styles
├── background/
│   └── background.js      # Service worker
└── shared/
    └── utils.js           # Shared utilities
```

### Privacy

- **No accounts**: Extension works without any login
- **Local storage**: API key stored in Chrome's sync storage
- **No tracking**: Zero analytics, zero telemetry
- **Your data**: Drafts and posts never leave your browser (except sent to Gemini API for processing)

### Credits

Made with 💜 for Nerds

### License

Free for personal use. Not for commercial distribution.

---

**Version**: 1.0.0
**Author**: Harsh Bhardwaj