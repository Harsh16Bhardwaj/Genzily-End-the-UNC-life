// GenZ Comment Booster - Settings Page Script

const DEFAULT_SYSTEM_PROMPT = `You are a Gen Z LinkedIn comment ninja who writes fire comments that go VIRAL! 🔥

Your style:
- Use trendy slang: no cap, fr fr, lowkey, highkey, slaps, hits different, tea, spills, vibes
- Add relevant emojis naturally (🔥💀😂✨🙌💜)
- Match the energy of the post - if it's professional, balance it with subtle coolness
- Keep it authentic, not forced
- Use short, punchy sentences
- Add personality and enthusiasm

Rules:
- Never use too many emojis (2-4 max)
- Never sound like a corporate bot
- Always be genuine and add value
- Adapt to the post's topic and tone
- For technical posts: show you get it, add clever quips
- For motivational posts: match the energy, elevate it
- For simple posts: keep it warm and real

Response should be ready to post - no explanations needed!`;

const DEFAULT_SETTINGS = {
  api_key: '',
  default_genz_level: 70,
  default_style: 'replicate',
  system_prompt: DEFAULT_SYSTEM_PROMPT
};

// Load settings on page load
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  setupEventListeners();
});

async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(DEFAULT_SETTINGS);

    document.getElementById('apiKey').value = result.api_key || '';
    document.getElementById('defaultGenZ').value = result.default_genz_level || 70;
    document.getElementById('genzValue').textContent = result.default_genz_level || 70;
    document.getElementById('defaultStyle').value = result.default_style || 'replicate';
    document.getElementById('systemPrompt').value = result.system_prompt || DEFAULT_SYSTEM_PROMPT;
  } catch (error) {
    console.error('Error loading settings:', error);
    showToast('Error loading settings', 'error');
  }
}

function setupEventListeners() {
  // Save API Key
  document.getElementById('saveApiKey').addEventListener('click', async () => {
    const apiKey = document.getElementById('apiKey').value.trim();

    if (!apiKey) {
      showToast('Please enter an API key', 'error');
      return;
    }

    if (!apiKey.startsWith('gsk_')) {
      showToast('Invalid API key format (Groq keys start with gsk_)', 'error');
      return;
    }

    try {
      await chrome.storage.sync.set({ api_key: apiKey });
      showToast('API key saved successfully! 🎉', 'success');
    } catch (error) {
      console.error('Error saving API key:', error);
      showToast('Error saving API key', 'error');
    }
  });

  // GenZ Level Slider
  const genzSlider = document.getElementById('defaultGenZ');
  const genzValue = document.getElementById('genzValue');

  genzSlider.addEventListener('input', async (e) => {
    const value = e.target.value;
    genzValue.textContent = value;

    try {
      await chrome.storage.sync.set({ default_genz_level: parseInt(value) });
    } catch (error) {
      console.error('Error saving GenZ level:', error);
    }
  });

  // Default Style
  document.getElementById('defaultStyle').addEventListener('change', async (e) => {
    try {
      await chrome.storage.sync.set({ default_style: e.target.value });
      showToast('Style updated!', 'success');
    } catch (error) {
      console.error('Error saving style:', error);
    }
  });

  // System Prompt
  document.getElementById('systemPrompt').addEventListener('input', async (e) => {
    try {
      await chrome.storage.sync.set({ system_prompt: e.target.value });
    } catch (error) {
      console.error('Error saving prompt:', error);
    }
  });

  // Reset Prompt Button
  document.getElementById('resetPrompt').addEventListener('click', async () => {
    document.getElementById('systemPrompt').value = DEFAULT_SYSTEM_PROMPT;
    try {
      await chrome.storage.sync.set({ system_prompt: DEFAULT_SYSTEM_PROMPT });
      showToast('Prompt reset to default!', 'success');
    } catch (error) {
      console.error('Error resetting prompt:', error);
    }
  });
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}