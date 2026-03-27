# GenZily Troubleshooting Guide

## Service Worker Inactive Error

If you see "service worker (Inactive)" in Chrome's extension details:

### Fix Steps:

1. **Open Chrome Extensions Page**
   - Go to `chrome://extensions/`
   - Find "GenZily"

2. **Reload the Extension**
   - Click the **Reload** button (circular arrow icon)
   - Wait 2-3 seconds

3. **Verify It's Working**
   - Service worker should now show as active
   - Check for any red error messages

4. **If Still Not Working:**
   - **Remove the extension** (click trash icon)
   - **Reload unpacked extension**:
     - Click "Load unpacked"
     - Navigate to `D:\genzily`
     - Click "Select Folder"
   - Refresh the page

---

## Overlay Button Not Appearing

### Checklist:

- [ ] Are you on LinkedIn.com?
- [ ] Click on a comment box (the text area for writing comments)
- [ ] Wait 1 second - the ✨ button should appear on the right side
- [ ] Check Chrome DevTools Console (F12) for error messages
- [ ] Look for logs starting with "GenZ Booster:"

### If Button Still Doesn't Appear:

1. Open Chrome DevTools (F12)
2. Go to **Console** tab
3. Check for red errors
4. Post any errors you see in the chat

---

## API Key Issues

### Error: "API Key not found"
- [ ] Settings page opened automatically after install?
- [ ] Did you enter your API key?
- [ ] Does it start with `gsk_`?
- [ ] Click "Save API Key" button?

### Error: "Rate Limited or Invalid Key"
- **This means your API key might be invalid or you're rate limited**
- Solution:
  1. Go to [console.groq.com](https://console.groq.com/)
  2. Create a **NEW** API key
  3. Copy the full key (starts with `gsk_`)
  4. Paste it in extension settings
  5. Try again

### Error: "Unauthorized"
- Your API key is invalid or expired
- Solution: 
  1. Visit [console.groq.com](https://console.groq.com/)
  2. Check that your API key is still active
  3. Generate a new one if the old one expired
  4. Update in extension settings

---

## Quick Diagnostics

### Check Extension Loads:
```
1. F12 → Console
2. Look for: "GenZ Booster: Initialized on https://www.linkedin.com/feed"
3. Look for: "GenZ Booster: Settings loaded, API Key present: true"
```

### Check Overlay Loads:
```
1. Click comment box on LinkedIn
2. Look for: "GenZ Booster: Textarea detected and focused"
3. Look for: "GenZ Booster: Overlay shown at position"
```

### Check API Call:
```
1. Click Generate Magic ✨
2. Look for: "GenZ Booster: Sending API request"
3. Look for: "GenZ Booster: API Response status: 200"
4. Look for: "GenZ Booster: Generated comment:"
```

---

## Still Not Working?

1. **Share Console Errors** - Copy all "GenZ Booster:" logs from F12 console
2. **Check Manifest** - Make sure `manifest.json` loads without errors
3. **Try Fresh Install** - Remove and reinstall the extension

---

## Force Reload Everything

**Nuclear Option** (starts completely fresh):

1. `chrome://extensions/` 
2. Remove GenZily (trash icon)
3. Reload the page
4. Click "Load unpacked"
5. Select `D:\genzily` folder
6. Open LinkedIn in new tab
7. Check console logs
