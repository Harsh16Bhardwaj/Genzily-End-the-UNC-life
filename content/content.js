// GenZ Comment Booster - Content Script
(function() {
  'use strict';

  // State
  let activeTextarea = null;
  let settings = null;
  let dialogVisible = false;

  // Elements
  let overlayBtn = null;
  let dialog = null;
  let backdrop = null;

  // Default settings
  const DEFAULT_SETTINGS = {
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
- For technical posts: show you get it, add clever quips
- For motivational posts: match the energy, elevate it
- For simple posts: keep it warm and real

Response should be ready to post - no explanations needed!`
  };

  // ============================================
  // INITIALIZATION
  // ============================================

  async function init() {
    // Load settings
    await loadSettings();

    // Create UI elements
    createOverlayButton();
    createDialog();
    createBackdrop();

    // Set up mutation observer
    observeLinkedIn();

    // Listen for textarea focus
    document.addEventListener('focusin', handleFocusIn, true);
    document.addEventListener('focusout', handleFocusOut, true);
  }

  async function loadSettings() {
    try {
      const result = await chrome.storage.sync.get(DEFAULT_SETTINGS);
      settings = { ...DEFAULT_SETTINGS, ...result };
    } catch (error) {
      console.error('GenZ Booster: Error loading settings', error);
      settings = DEFAULT_SETTINGS;
    }
  }

  // ============================================
  // UI CREATION
  // ============================================

  function createOverlayButton() {
    overlayBtn = document.createElement('button');
    overlayBtn.id = 'gz-booster-overlay';
    overlayBtn.innerHTML = '✨';
    overlayBtn.style.display = 'none';

    overlayBtn.addEventListener('click', () => {
      if (!settings.api_key) {
        showDialog();
        showToast('Configure your API key first! Click ⚙️', 'info');
        return;
      }
      showDialog();
    });

    document.body.appendChild(overlayBtn);
  }

  function createBackdrop() {
    backdrop = document.createElement('div');
    backdrop.id = 'gz-booster-backdrop';
    backdrop.addEventListener('click', hideDialog);
    document.body.appendChild(backdrop);
  }

  function createDialog() {
    dialog = document.createElement('div');
    dialog.id = 'gz-booster-dialog';
    dialog.innerHTML = `
      <div class="gz-dialog-header">
        <div class="gz-dialog-title">VyodVibes ✨</div>
        <button class="gz-dialog-close" id="gz-close-btn">×</button>
      </div>
      <div class="gz-dialog-body" id="gz-dialog-content">
        <!-- Content loaded dynamically -->
      </div>
      <div class="gz-dialog-footer">
        <button class="gz-settings-btn" id="gz-settings-btn">
          ⚙️ Settings
        </button>
      </div>
    `;
    dialog.style.display = 'none';
    document.body.appendChild(dialog);

    // Event listeners
    document.getElementById('gz-close-btn').addEventListener('click', hideDialog);
    document.getElementById('gz-settings-btn').addEventListener('click', openSettings);
  }

  // ============================================
  // DIALOG CONTENT
  // ============================================

  function renderDialogContent() {
    const content = document.getElementById('gz-dialog-content');

    if (!settings.api_key) {
      content.innerHTML = `
        <div class="gz-no-key">
          <div class="gz-no-key-icon">🔑</div>
          <div class="gz-no-key-title">API Key Required</div>
          <div class="gz-no-key-text">
            Get a free Gemini API key and add it in settings.<br>
            No login needed - completely private!
          </div>
          <button class="gz-no-key-btn" id="gz-add-key-btn">
            Open Settings ⚙️
          </button>
        </div>
      `;
      document.getElementById('gz-add-key-btn').addEventListener('click', openSettings);
      return;
    }

    const postText = getPostText();
    const draftText = activeTextarea ? activeTextarea.value : '';

    content.innerHTML = `
      <div class="gz-post-preview">
        <div class="gz-post-preview-label">Post Preview</div>
        <div class="gz-post-preview-text ${postText.length > 200 ? 'truncated' : ''}">
          ${escapeHtml(postText.substring(0, 200)) || 'No post text detected'}
        </div>
      </div>

      <div class="gz-draft-section">
        <label class="gz-label">Your Draft</label>
        <textarea class="gz-draft-input" id="gz-draft-input" placeholder="Type your boring draft here...">${escapeHtml(draftText)}</textarea>
      </div>

      <div class="gz-slider-section">
        <div class="gz-slider-header">
          <label class="gz-label">GenZ Level</label>
          <div class="gz-slider-value" id="gz-slider-value">${settings.default_genz_level}</div>
        </div>
        <div class="gz-slider-container">
          <input type="range" class="gz-slider" id="gz-slider" min="1" max="100" value="${settings.default_genz_level}">
        </div>
      </div>

      <div class="gz-style-section">
        <label class="gz-label">Style</label>
        <div class="gz-style-grid">
          <button class="gz-style-btn" data-style="crisp">Crisp</button>
          <button class="gz-style-btn active" data-style="replicate">Replicate</button>
          <button class="gz-style-btn" data-style="exaggerate">Exaggerate</button>
        </div>
      </div>

      <button class="gz-generate-btn" id="gz-generate-btn">
        Generate Magic ✨
      </button>
    `;

    // Add event listeners
    setupDialogContentListeners();
  }

  function setupDialogContentListeners() {
    // Slider
    const slider = document.getElementById('gz-slider');
    const sliderValue = document.getElementById('gz-slider-value');

    if (slider) {
      slider.addEventListener('input', () => {
        sliderValue.textContent = slider.value;
      });
    }

    // Style buttons
    const styleBtns = document.querySelectorAll('.gz-style-btn');
    styleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        styleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });

      if (btn.dataset.style === settings.default_style) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Generate button
    const generateBtn = document.getElementById('gz-generate-btn');
    if (generateBtn) {
      generateBtn.addEventListener('click', handleGenerate);
    }
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================

  function handleFocusIn(e) {
    const target = e.target;

    // Check if it's a LinkedIn comment textarea
    if (target.tagName === 'TEXTAREA' && isLinkedInCommentBox(target)) {
      activeTextarea = target;
      showOverlay();
    }
  }

  function handleFocusOut(e) {
    setTimeout(() => {
      if (!activeTextarea || !document.activeElement) return;

      const focused = document.activeElement;
      if (!isLinkedInCommentBox(focused) && focused !== overlayBtn && !dialog.contains(focused)) {
        hideOverlay();
      }
    }, 100);
  }

  function isLinkedInCommentBox(el) {
    if (!el || el.tagName !== 'TEXTAREA') return false;

    // LinkedIn uses various classes for comment boxes
    const classes = el.className || '';
    const isComment = (
      classes.includes('comments-comment-box') ||
      classes.includes('comments-comment-textinput') ||
      el.closest('.comments-comment-box') ||
      el.closest('.comments-comment-textinput') ||
      el.closest('[data-placeholder="Add a comment..."]')
    );

    return isComment;
  }

  function showOverlay() {
    if (!overlayBtn) return;
    overlayBtn.style.display = 'flex';

    if (!settings.api_key) {
      overlayBtn.classList.add('disabled');
    } else {
      overlayBtn.classList.remove('disabled');
    }
  }

  function hideOverlay() {
    if (!overlayBtn) return;
    overlayBtn.style.display = 'none';
  }

  function showDialog() {
    renderDialogContent();
    dialog.style.display = 'block';
    backdrop.classList.add('visible');

    requestAnimationFrame(() => {
      dialog.classList.add('visible');
    });

    dialogVisible = true;
  }

  function hideDialog() {
    dialog.classList.remove('visible');
    backdrop.classList.remove('visible');

    setTimeout(() => {
      dialog.style.display = 'none';
    }, 300);

    dialogVisible = false;
  }

  function openSettings() {
    chrome.runtime.sendMessage({ action: 'openSettings' });
    hideDialog();
  }

  // ============================================
  // POST TEXT EXTRACTION
  // ============================================

  function getPostText() {
    if (!activeTextarea) return '';

    // Try to find the post container
    const commentBox = activeTextarea.closest('.comments-comment-box') ||
                       activeTextarea.closest('.comments-comment-textinput');

    if (!commentBox) return '';

    // Walk up to find the post
    let postContainer = commentBox.closest('[data-id]') ||
                        commentBox.closest('.feed-shared-update-v2') ||
                        commentBox.closest('.occludable-update');

    if (!postContainer) return '';

    // Try multiple selectors for post text
    const textSelectors = [
      '.feed-shared-text',
      '.update-components-text',
      '.feed-shared-update-v2__description',
      '.feed-shared-inline-show-more-text',
      '[data-test-id="main-feed-activity-card"]'
    ];

    for (const selector of textSelectors) {
      const textEl = postContainer.querySelector(selector);
      if (textEl) {
        return textEl.innerText.trim().substring(0, 2000);
      }
    }

    // Fallback: try to get any visible text
    const fallbackText = postContainer.querySelector('.break-words');
    if (fallbackText) {
      return fallbackText.innerText.trim().substring(0, 2000);
    }

    return '';
  }

  // ============================================
  // GENERATION
  // ============================================

  async function handleGenerate() {
    const btn = document.getElementById('gz-generate-btn');
    const slider = document.getElementById('gz-slider');
    const draftInput = document.getElementById('gz-draft-input');
    const activeStyle = document.querySelector('.gz-style-btn.active');

    const genzLevel = slider ? slider.value : settings.default_genz_level;
    const style = activeStyle ? activeStyle.dataset.style : settings.default_style;
    const draft = draftInput ? draftInput.value : '';
    const postText = getPostText();

    if (!draft && !postText) {
      showToast('Add a draft or select a post first!', 'error');
      return;
    }

    // Show loading
    btn.disabled = true;
    btn.innerHTML = '<div class="gz-spinner"></div> Generating...';

    try {
      const result = await generateComment(postText, draft, genzLevel, style);

      if (result) {
        // Auto-paste to textarea
        if (activeTextarea) {
          activeTextarea.value = result;
          activeTextarea.dispatchEvent(new Event('input', { bubbles: true }));
          activeTextarea.focus();
        }

        showToast('Generated! Check the comment box ✨', 'success');
        hideDialog();
      }
    } catch (error) {
      console.error('GenZ Booster: Generation error', error);
      showToast(error.message || 'Generation failed', 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = 'Generate Magic ✨';
    }
  }

  async function generateComment(postText, draft, genzLevel, style) {
    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    const styleInstructions = {
      crisp: 'Keep it SHORT (1-2 sentences max), punchy, and impactful. No fluff.',
      replicate: 'Match the energy and tone of the original post. Balance professionalism with personality.',
      exaggerate: 'GO ALL OUT! Maximum GenZ energy, slang overload, enthusiasm off the charts!'
    };

    const levelInstruction = genzLevel < 33
      ? 'Keep it professional with just a HINT of personality. Very subtle.'
      : genzLevel < 66
        ? 'Balance professional and GenZ - readable but has personality.'
        : 'FULL GenZ mode! Use slang freely, keep it authentic to the vibes.';

    const prompt = `${settings.system_prompt}

STYLE: ${styleInstructions[style] || styleInstructions.replicate}
GENZ LEVEL (${genzLevel}/100): ${levelInstruction}

POST TO RESPOND TO:
"""
${postText || 'No post context available - respond generically'}
"""

YOUR DRAFT (transform this):
"""
${draft || 'Generate a comment from scratch'}
"""

Generate ONLY the final comment text, ready to post. No explanations, no quotes around it.`;

    const body = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 500,
      }
    };

    const response = await fetch(`${endpoint}?key=${settings.api_key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response generated');
    }

    return text.trim();
  }

  // ============================================
  // MUTATION OBSERVER
  // ============================================

  function observeLinkedIn() {
    const observer = new MutationObserver((mutations) => {
      // Check if new comment boxes appeared
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // We could do something here if needed
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // ============================================
  // UTILITIES
  // ============================================

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showToast(message, type = 'info') {
    // Remove existing toast
    const existing = document.querySelector('.gz-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `gz-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ============================================
  // MESSAGE LISTENER
  // ============================================

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'settingsUpdated') {
      loadSettings().then(() => {
        if (settings.api_key && overlayBtn) {
          overlayBtn.classList.remove('disabled');
        }
      });
    }
  });

  // ============================================
  // INIT
  // ============================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();