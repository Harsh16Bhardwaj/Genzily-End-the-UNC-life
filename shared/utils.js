// GenZ Comment Booster - Shared Utilities

const GZ_UTILS = {
  // Default settings
  DEFAULT_SETTINGS: {
    api_key: '',
    default_genz_level: 70,
    default_style: 'replicate',
    system_prompt: `You are a Gen Z LinkedIn comment ninja who writes fire comments that go VIRAL! 🔥

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

Response should be ready to post - no explanations needed!`
  },

  // Escape HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Truncate text
  truncate(text, maxLength = 2000) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) : text;
  },

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Export for modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GZ_UTILS;
}