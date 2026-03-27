# 🔥 GenZ Comment Booster - End the UNC Life

<div align="center">

**Transform your boring LinkedIn comments into fire with AI. No cap.**

[![GitHub](https://img.shields.io/badge/GitHub-Harsh16Bhardwaj%2FGenzily-181717?logo=github&style=flat-square)](https://github.com/Harsh16Bhardwaj/Genzily-End-the-UNC-life)
[![Chrome](https://img.shields.io/badge/Chrome%20Extension-Ready-4285F4?style=flat-square)]()
[![License](https://img.shields.io/badge/License-Free%20Forever-brightgreen?style=flat-square)]()

---

</div>

## Why GenZ Comment Booster? 💀

Stop sounding like an UNC on LinkedIn. Your comments shouldn't require a thesaurus or sound like you work in HR. **GenZ Comment Booster** uses AI to transform your stiff drafts into authentic, energetic comments that actually resonate with your network.

**The Problem:**
- You spend 10 minutes crafting a LinkedIn comment
- It sounds like ChatGPT wrote it
- No engagement. Just crickets.
- You sound corporate and disconnected.

**The Solution:**
- Type your draft (boring or not)
- Adjust the GenZ vibe level (1-100)
- Click Generate Magic ✨
- Watch it transform into fire
- Post and watch engagement flow

---

## 🎯 Key Features

| Feature | What It Does |
|---------|-------------|
| **⚡ Instant Vibe Check** | Transform drafts in seconds using AI |
| **🎚️ Calibrated Chaos** | Slider control for GenZ energy (1-100) |
| **🎨 Three Styles** | Crisp, Replicate, Exaggerate - pick your energy |
| **🔐 Privacy First** | No login, local storage, drafts stay private |
| **💨 Lightning Fast** | Powered by Groq's free tier API |
| **🎭 Context Aware** | AI reads the post context and matches energy |
| **♾️ Free Forever** | No limits, no ad, no corporate nonsense |

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- **Chrome Browser** (version 88+)
- **Groq API Key** (free, takes 30 seconds to get)
- **Git** (optional, for cloning)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Harsh16Bhardwaj/Genzily-End-the-UNC-life.git
cd genzily
```

Or download as ZIP from the [GitHub repo](https://github.com/Harsh16Bhardwaj/Genzily-End-the-UNC-life).

### Step 2: Get Your Groq API Key

1. Visit [console.groq.com](https://console.groq.com/)
2. Sign in (or create free account - no card needed)
3. Go to **API Keys** section
4. Create a new API key (starts with `gsk_`)
5. Copy it somewhere safe

**Why Groq?** Lightning-fast inference, basically unlimited free tier, no quota restrictions like Gemini.

### Step 3: Install the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Toggle **Developer mode** (top-right corner)
3. Click **Load unpacked**
4. Select the `genzily` folder you cloned
5. Extension appears in your toolbar! ✨

### Step 4: Configure

1. Click the extension icon in Chrome toolbar
2. Click ⚙️ (settings)
3. Paste your Groq API key (gsk_...)
4. Set your default GenZ level (1-100)
5. Pick your default style (Crisp/Replicate/Exaggerate)
6. Save and you're done!

### Step 5: Start Using It

1. Go to LinkedIn
2. Scroll to any post and click "Comment"
3. Type your draft (boring or not, doesn't matter)
4. Look for the **yellow ✨ button** that floats in the corner
5. Click it - the side panel opens
6. Adjust the vibe level slider
7. Pick your style (Crisp/Replicate/Exaggerate)
8. Click **GENERATE MAGIC ✨**
9. You get 3 options - pick your fave
10. Click Copy - it goes to clipboard
11. Paste in the comment box - edit if you want
12. Hit Post and watch the engagement 🚀

---

## 📊 Use Cases

### 1. **Career Professionals**
> **Problem**: Your LinkedIn comments sound robotic
> 
> **Solution**: GenZ mode keeps you professional but adds personality. Stay authentic, not corporate.
> 
> **Example**: Transform "Thank you for the insights" → "This hits different, great breakdown here fr! 💡"

### 2. **Tech Founders/Engineers**
> **Problem**: Technical posts need to balance expertise with relatability
> 
> **Solution**: Replicate mode matches the energy of technical discussions while keeping it real.
> 
> **Example**: Transform "Great implementation" → "The way you handled backend optimization? That's actually genius frfr 🔥"

### 3. **Content Creators**
> **Problem**: Need high engagement and authentic-sounding comments consistently
> 
> **Solution**: Exaggerate mode amps up energy and keeps you standing out.
> 
> **Example**: Transform "This is useful" → "BESTIE THIS IS LITERALLY THE MOST HELPFUL THREAD I'VE SEEN ALL YEAR NO CAP 😭🔥"

### 4. **Job Seekers**
> **Problem**: Comments are too formal, don't show personality to recruiters
> 
> **Solution**: Balanced GenZ mode (50-70) shows you're relatable while staying professional enough.
> 
> **Example**: Transform "Interested in this role" → "Yo this role is literally what I've been looking for, the tech stack and team vibe is *chef's kiss* 🙌"

### 5. **Networking Enthusiasts**
> **Problem**: Hard to stand out in crowded threads
> 
> **Solution**: Balanced energy + authentic voice = memorable comments that get replies
> 
> **Example**: Get genuine engagement by matching the room's vibe perfectly

---

## 🎚️ GenZ Level Guide

| **Range** | **Vibe** | **Best For** | **Example** |
|-----------|----------|------------|-----------|
| **1-33** | Professional Cool | Serious posts, recruiting, thought leadership | "Solid breakdown here, great points on DSA optimization." |
| **34-66** | Balanced Energy | Most posts, mixing professional + personality | "This slaps fr! Your approach to scaling is actually fire 🔥" |
| **67-100** | Maximum Chaos | Casual posts, community threads, memes | "NAHHHH THIS HITS DIFFERENT NO CAP 💀🔥 Your energy is unmatched" |

---

## 🎨 Style Modes Explained

### **Crisp** ⚡
- Short, punchy comment
- 1-2 sentences max
- Get straight to the point
- **Use when**: Threading limit or post is simple

### **Replicate** ↯
- Matches the energy of the post exactly
- Professional post → professional vibe
- Casual post → casual vibe  
- **Use when**: You want the comment to feel organic to the thread

### **Exaggerate** 💥
- Amps up the GenZ energy
- Maximum personality and slang
- Over-the-top enthusiasm
- **Use when**: You want to stand out and spark engagement

---

## 🛠️ Tech Stack

- **Browser**: Chrome Extension (Manifest V3)
- **Frontend**: Vanilla JavaScript + CSS (no frameworks, lightweight)
- **AI**: Groq API (llama-3.1-8b-instant model)
- **Storage**: Chrome Storage Sync (encrypted, syncs across devices)
- **Architecture**: Content Script + Side Panel UI

### Why This Stack?

- **No dependencies**: Faster, more secure, smaller footprint
- **Groq API**: 10x faster than Gemini, free tier is insane
- **Content Script**: Runs on every page, can intercept LinkedIn comments
- **Side Panel**: Non-intrusive UI, doesn't interfere with LinkedIn

---

## 📁 Project Structure

```
genzily/
├── 📄 manifest.json              # Chrome Extension config
├── 📄 README.md                  # This file
├── 📄 index.html                 # Landing page
├── 📄 settings.html              # Settings interface
│
├── 🔧 JavaScript
│   ├── content/
│   │   ├── content.js            # Main extension logic
│   │   └── content.css           # Side panel styling
│   ├── settings.js               # Settings page logic
│   ├── background/background.js  # Service worker
│   └── shared/utils.js           # Shared helper functions
│
├── 🎨 Assets
│   ├── icon16.png                # Extension icon 16x16
│   ├── icon48.png                # Extension icon 48x48
│   └── icon128.png               # Extension icon 128x128
│
└── 📚 Other
    ├── SPEC.md                   # Feature specifications
    └── inspo/                    # Design inspiration files
```

---

## 🔐 Privacy & Security

| Aspect | Details |
|--------|---------|
| **No Accounts** | Zero logins, zero auth systems. Just works. |
| **Local Storage** | API key stored in Chrome's secure sync storage (encrypted) |
| **No Tracking** | Zero analytics, zero telemetry, zero data collection |
| **Drafts Privacy** | Your drafts never leave your browser except for AI processing |
| **Open Source** | Source code is public - audit it yourself |

---

## ⚡ Performance

- **Generation Time**: 2-5 seconds (Groq is fast)
- **Memory Usage**: ~2-3MB (lightweight)
- **Startup Time**: Instant, loads on Chrome start
- **Free Tier**: Unlimited requests (seriously, no soft caps)

---

## 🐛 Common Issues

### "API Key not working"
- Copy from console.groq.com again, it might have formatting issues
- Check that it starts with `gsk_`
- Verify you're using the latest key

### "Comments not generating"
- Check your internet connection
- Verify Groq console isn't down (rarely happens)
- Make sure you're on LinkedIn comment box, not somewhere else

### "Side panel not showing"
- Click on any LinkedIn comment box first (focuses the textarea)
- The yellow ✨ button should appear
- If not, reload the page and try again

---

## 🤝 Contributing

Found a bug? Have an idea? This project lives on [GitHub](https://github.com/Harsh16Bhardwaj/Genzily-End-the-UNC-life).

Ways to contribute:
- Report bugs in Issues
- Suggest features
- Test on different Chrome versions
- Help improve prompts for better generations

---

## 📝 License

Free for personal use. Not for commercial redistribution or resale.

---

## 🙌 Credits

**Made with 💜 by** [Harsh Bhardwaj](https://github.com/Harsh16Bhardwaj)

**Special thanks to:**
- **Groq** for the lightning-fast API
- The GenZ community for the slang inspiration
- LinkedIn for being the testing ground

---

## 📞 Support

- **GitHub Issues**: [Report bugs here](https://github.com/Harsh16Bhardwaj/Genzily-End-the-UNC-life/issues)
- **Documentation**: Check SPEC.md for technical details
- **Questions**: Open a discussion on GitHub

---

**Version**: 1.0.0 | **Last Updated**: March 2026 | **Status**: Active & Maintained ✨

---

<div align="center">

### Ready to Stop Sounding Like an UNC? 

**[Clone / Download from GitHub](https://github.com/Harsh16Bhardwaj/Genzily-End-the-UNC-life)** → Get your Groq key → Install locally → Start slaying LinkedIn

**No cap.** 🔥

</div>