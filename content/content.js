// GenZ Comment Booster - Content Script
(function () {
  "use strict";

  // State
  let activeTextarea = null;
  let settings = null;
  let dialogVisible = false;
  let lastApiCall = 0;
  let apiCooldown = 0;
  let requestQueue = [];
  let isProcessingQueue = false;
  let commentCache = {}; // Cache generated comments

  // Elements
  let overlayBtn = null;
  let dialog = null;
  let backdrop = null;

  // Default settings
  const DEFAULT_SETTINGS = {
    api_key: "",
    default_genz_level: 70,
    default_style: "replicate",
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

IMPORTANT: Return your response as JSON with this exact format:
{
  "responses": [
    "your first comment variant here",
    "your second comment variant here", 
    "your third comment variant here"
  ]
}

Generate 3 different GenZ comment variations with different vibes/intensity but all authentic.`,
  };

  // Helper to get GenZ level from localStorage
  function getStoredGenZLevel() {
    const stored = localStorage.getItem('gz-genz-level');
    return stored ? parseInt(stored) : DEFAULT_SETTINGS.default_genz_level;
  }

  function saveGenZLevel(level) {
    localStorage.setItem('gz-genz-level', level.toString());
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  async function init() {
    // Load settings
    await loadSettings();
    // Override default GenZ level with saved value
    settings.default_genz_level = getStoredGenZLevel();
    console.log("GenZ Booster: Initialized on", window.location.href);
    console.log(
      "GenZ Booster: Settings loaded, API Key present:",
      !!settings.api_key,
    );

    // Create UI elements
    createOverlayButton();
    createPanel();

    // Set up mutation observer
    observeLinkedIn();

    // Listen for textarea focus - use capture phase to catch focusing on all textareas
    document.addEventListener("focusin", handleFocusIn, true);
    document.addEventListener("focusout", handleFocusOut, true);

    console.log("GenZ Booster: Event listeners attached");

    // Trigger a check for any existing comment boxes
    const textareas = document.querySelectorAll("textarea");
    console.log("GenZ Booster: Found", textareas.length, "textareas on page");
  }

  async function loadSettings() {
    try {
      const result = await chrome.storage.sync.get(DEFAULT_SETTINGS);
      settings = { ...DEFAULT_SETTINGS, ...result };
    } catch (error) {
      console.error("GenZ Booster: Error loading settings", error);
      settings = DEFAULT_SETTINGS;
    }
  }

  // ============================================
  // UI CREATION
  // ============================================

  function createOverlayButton() {
    overlayBtn = document.createElement("button");
    overlayBtn.id = "gz-booster-overlay";
    overlayBtn.innerHTML = "✨";
    overlayBtn.style.display = "none";

    overlayBtn.addEventListener("click", () => {
      if (!settings.api_key) {
        showPanel();
        showToast("Configure your API key first! Click ⚙️", "info");
        return;
      }
      showPanel();
    });

    document.body.appendChild(overlayBtn);
  }

  function createPanel() {
    const panelContainer = document.createElement("div");
    panelContainer.id = "gz-side-panel";
    panelContainer.innerHTML = `
      <div class="gz-panel-header">
        <button class="gz-panel-back" id="gz-panel-back">←</button>
        <span class="gz-panel-title"></span>
        <div style="display: flex; gap: GenZily ✨8px;">
          <button class="gz-panel-close" id="gz-panel-close">✕</button>
          <button class="gz-panel-settings" id="gz-panel-settings">⚙️</button>
        </div>
      </div>
      <div class="gz-panel-content" id="gz-panel-content"></div>
    `;
    panelContainer.style.display = "none";
    document.body.appendChild(panelContainer);
    dialog = panelContainer;

    document.getElementById("gz-panel-back").addEventListener("click", goBackToPanelForm);
    document.getElementById("gz-panel-close").addEventListener("click", hidePanel);
    document.getElementById("gz-panel-settings").addEventListener("click", openSettings);
  }

  // ============================================
  // PANEL CONTENT
  // ============================================

  function renderPanelContent() {
    const content = document.getElementById("gz-panel-content");

    if (!settings.api_key) {
      content.innerHTML = `
        <div class="gz-no-key">
          <div class="gz-no-key-icon">🔑</div>
          <div class="gz-no-key-title">API Key Required</div>
          <div class="gz-no-key-text">
            Get a free Groq API key and add it in settings.<br>
            No login needed - completely private!
          </div>
          <button class="gz-no-key-btn" id="gz-add-key-btn">
            Open Settings ⚙️
          </button>
        </div>
      `;
      document
        .getElementById("gz-add-key-btn")
        .addEventListener("click", openSettings);
      return;
    }

    const postText = getPostText();
    let draftText = "";

    if (activeTextarea) {
      // Handle both textarea and contenteditable
      if (activeTextarea.tagName === "TEXTAREA") {
        draftText = activeTextarea.value;
      } else {
        draftText =
          activeTextarea.innerText || activeTextarea.textContent || "";
      }
    }

    content.innerHTML = `
      <div class="gz-draft-section">
        <label class="gz-label">Your Draft</label>
        <textarea class="gz-draft-input" id="gz-draft-input" placeholder="Type your boring draft here...">${escapeHtml(draftText)}</textarea>
      </div>

      <div class="gz-slider-section">
        <div class="gz-slider-header">
          <label class="gz-label">GenZ Level</label>
          <div class="gz-slider-value" id="gz-slider-value">${getStoredGenZLevel()}</div>
        </div>
        <div class="gz-slider-container">
          <input type="range" class="gz-slider" id="gz-slider" min="1" max="100" value="${getStoredGenZLevel()}">
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
    setupPanelContentListeners();
  }

  function setupPanelContentListeners() {
    // Slider
    const slider = document.getElementById("gz-slider");
    const sliderValue = document.getElementById("gz-slider-value");

    if (slider) {
      slider.addEventListener("input", () => {
        sliderValue.textContent = slider.value;
        saveGenZLevel(parseInt(slider.value));
      });
    }

    // Style buttons
    const styleBtns = document.querySelectorAll(".gz-style-btn");
    styleBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        styleBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });

      if (btn.dataset.style === settings.default_style) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Generate button
    const generateBtn = document.getElementById("gz-generate-btn");
    if (generateBtn) {
      generateBtn.addEventListener("click", handleGenerate);
    }
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================

  function handleFocusIn(e) {
    const target = e.target;

    // Check for textarea
    if (target.tagName === "TEXTAREA" && isLinkedInCommentBox(target)) {
      activeTextarea = target;
      showOverlay();
      console.log("GenZ Booster: Textarea detected and focused");
      return;
    }

    // Check for contenteditable divs (LinkedIn's modern comment box)
    if (
      target.getAttribute("contenteditable") === "true" &&
      target.closest('[class*="comment"]')
    ) {
      activeTextarea = target;
      showOverlay();
      console.log(
        "GenZ Booster: Contenteditable comment box detected and focused",
      );
      return;
    }

    // Check if parent is a contenteditable
    const parentEditable = target.closest('[contenteditable="true"]');
    if (parentEditable && parentEditable.closest('[class*="comment"]')) {
      activeTextarea = parentEditable;
      showOverlay();
      console.log(
        "GenZ Booster: Parent contenteditable comment box detected and focused",
      );
      return;
    }
  }

  function handleFocusOut(e) {
    setTimeout(() => {
      if (!activeTextarea || !document.activeElement) return;

      const focused = document.activeElement;

      // Check if still in a comment box
      if (isLinkedInCommentBox(focused)) return;
      if (
        focused.getAttribute("contenteditable") === "true" &&
        focused.closest('[class*="comment"]')
      )
        return;
      if (
        focused
          .closest('[contenteditable="true"]')
          ?.closest('[class*="comment"]')
      )
        return;

      // Check if clicking on overlay or dialog
      if (focused === overlayBtn || (dialog && dialog.contains(focused)))
        return;

      hideOverlay();
      activeTextarea = null;
      console.log("GenZ Booster: Focus left comment box");
    }, 100);
  }

  function isLinkedInCommentBox(el) {
    if (!el || el.tagName !== "TEXTAREA") return false;

    // Check various LinkedIn comment box selectors - be more flexible
    const parent = el.closest(
      '[id^="comment"], [id*="comment"], .comments-comment-textinput, [role="textbox"]',
    );
    if (parent) return true;

    // Check for contenteditable divs that act as textareas
    if (el.getAttribute("contenteditable") === "true") return true;

    // Look for LinkedIn-specific attributes
    const placeholder = el.getAttribute("placeholder") || "";
    if (
      placeholder.includes("Add a comment") ||
      placeholder.includes("comment")
    ) {
      return true;
    }

    // Check parent classes
    const classes = el.className || "";
    if (
      classes.includes("comments-comment-box") ||
      classes.includes("comments-comment-textinput") ||
      classes.includes("ql-editor")
    ) {
      return true;
    }

    return false;
  }

  function showOverlay() {
    if (!overlayBtn || !activeTextarea) return;

    overlayBtn.style.display = "flex";

    // Position overlay near the textarea
    const rect = activeTextarea.getBoundingClientRect();
    overlayBtn.style.position = "fixed";
    overlayBtn.style.top = rect.top + 10 + "px";
    overlayBtn.style.right = "20px";
    overlayBtn.style.transform = "none";

    if (!settings.api_key) {
      overlayBtn.classList.add("disabled");
    } else {
      overlayBtn.classList.remove("disabled");
    }

    console.log("GenZ Booster: Overlay shown at position", rect.top);
  }

  function hideOverlay() {
    if (!overlayBtn) return;
    overlayBtn.style.display = "none";
  }

  function showPanel() {
    renderPanelContent();
    dialog.style.display = "block";
    document.body.style.overflow = "hidden";  // Prevent body scroll

    requestAnimationFrame(() => {
      dialog.classList.add("visible");
    });

    dialogVisible = true;
  }

  function hidePanel() {
    dialog.classList.remove("visible");
    document.body.style.overflow = "";  // Restore body scroll

    setTimeout(() => {
      dialog.style.display = "none";
    }, 300);

    dialogVisible = false;
  }

  function openSettings() {
    chrome.runtime.sendMessage({ action: "openSettings" });
    hideDialog();
  }

  // ============================================
  // POST TEXT EXTRACTION
  // ============================================

  function getPostText() {
    if (!activeTextarea) return "";

    let postContainer = null;

    // Strategy 1: Look for the specific post container nearby
    const commentBox =
      activeTextarea.closest('[id^="comment"], [id*="comment"]') ||
      activeTextarea.closest(".comments-comment-box") ||
      activeTextarea.closest(".comments-comment-textinput");

    if (commentBox) {
      // Walk up the DOM to find the post
      postContainer =
        commentBox.closest('[class*="feed"]') ||
        commentBox.closest('[class*="update"]') ||
        commentBox.closest("[data-id]") ||
        commentBox.closest("article");
    }

    // Strategy 2: Fall back to finding any recent update container
    if (!postContainer) {
      postContainer =
        activeTextarea.closest('[class*="feed-shared-update"]') ||
        activeTextarea.closest('[class*="occludable-update"]') ||
        activeTextarea.closest("article");
    }

    if (!postContainer) return "";

    // Try multiple selectors for post text
    const textSelectors = [
      ".feed-shared-text",
      ".update-components-text",
      ".feed-shared-update-v2__description",
      ".feed-shared-inline-show-more-text",
      '[data-test-id="main-feed-activity-card__post"]',
      ".break-words",
      '[class*="attributed-text"]',
      'span[dir="ltr"]',
    ];

    for (const selector of textSelectors) {
      const elements = postContainer.querySelectorAll(selector);
      for (const el of elements) {
        const text = el.innerText?.trim();
        if (text && text.length > 10) {
          const result = text.substring(0, 2000);
          console.log(
            "GenZ Booster: Post text extracted:",
            result.substring(0, 100),
          );
          return result;
        }
      }
    }

    // Fallback: get the text content with some filtering
    const allText = postContainer.innerText?.trim() || "";
    if (allText.length > 10) {
      const result = allText.substring(0, 2000);
      console.log(
        "GenZ Booster: Post text (fallback):",
        result.substring(0, 100),
      );
      return result;
    }

    console.log("GenZ Booster: Could not extract post text");
    return "";
  }

  // ============================================
  // GENERATION
  // ============================================

  async function handleGenerate() {
    const btn = document.getElementById("gz-generate-btn");
    const slider = document.getElementById("gz-slider");
    const draftInput = document.getElementById("gz-draft-input");
    const activeStyle = document.querySelector(".gz-style-btn.active");

    const genzLevel = slider ? parseInt(slider.value) : getStoredGenZLevel();
    const style = activeStyle
      ? activeStyle.dataset.style
      : settings.default_style;
    const draft = draftInput ? draftInput.value : "";
    const postText = getPostText();

    console.log("GenZ Booster: Generation started", {
      genzLevel,
      style,
      draftLength: draft.length,
      postTextLength: postText.length,
    });

    if (!draft && !postText) {
      showToast("Add a draft or select a post first!", "error");
      return;
    }

    // Show loading
    btn.disabled = true;
    btn.innerHTML = '<div class="gz-spinner"></div> Generating...';

    try {
      const results = await generateComment(postText, draft, genzLevel, style);

      if (results && results.length > 0) {
        console.log("GenZ Booster: Generated results received:", results);
        
        // Display the options for user to choose from
        displayCommentOptions(results);
        showToast("Pick your favorite! ✨", "success");
      }
    } catch (error) {
      console.error("GenZ Booster: Generation error", error);
      showToast(error.message || "Generation failed", "error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = "Generate Magic ✨";
    }
  }

  function displayCommentOptions(comments) {
    const content = document.getElementById("gz-panel-content");
    const backBtn = document.getElementById("gz-panel-back");
    
    // Show the back button
    if (backBtn) {
      backBtn.classList.add("visible");
    }
    
    let optionsHTML = '<div class="gz-options-container">';
    
    comments.forEach((comment, index) => {
      optionsHTML += `
        <div class="gz-option-card">
          <div class="gz-option-number">Option ${index + 1}</div>
          <div class="gz-option-text">${escapeHtml(comment)}</div>
          <button class="gz-option-copy-btn" data-text="${comment.replace(/"/g, '&quot;')}">
            📋 Copy
          </button>
        </div>
      `;
    });
    
    optionsHTML += '</div>';
    
    // Replace entire content with options (removes form after generation)
    content.innerHTML = optionsHTML;
    
    // Add event listeners
    document.querySelectorAll(".gz-option-copy-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = btn.dataset.text;
        navigator.clipboard.writeText(text).then(() => {
          showToast("Copied! 📋 Paste in comment box", "success");
        });
      });
    });
  }

  function goBackToPanelForm() {
    const backBtn = document.getElementById("gz-panel-back");
    if (backBtn) {
      backBtn.classList.remove("visible");
    }
    renderPanelContent();
  }

  // System prompts for each style
  function getSystemPrompt(style, genzLevel) {
    const genZIntensity = genzLevel / 100; // 0 to 1
    const professionalTone = 1 - genZIntensity; // inverse relationship

    const baseGenZ = `You are a Gen Z LinkedIn comment ninja! 🔥
- Use trendy slang: no cap, fr fr, lowkey, highkey, slaps, hits different, tea, spills, vibes
- Add relevant emojis naturally (🔥💀😂✨🙌💜) - 2-4 emojis max
- Keep it authentic, never forced
- Always add genuine value and personality`;

    const baseStyle = {
      crisp: {
        description: "Short, punchy, nonchalant. Quick GenZ slang mix. 1-2 sentences max.",
        tone: "Dismissive but in a cool way. Like you get it without trying.",
      },
      replicate: {
        description: "Match the exact energy and tone of the post. Balanced and intentional.",
        tone: "Mirror the post's vibe while staying authentic GenZ.",
      },
      exaggerate: {
        description: "GO ALL OUT! Maximum GenZ energy, slang overload, enthusiasm off the charts!",
        tone: "Over-the-top GenZ energy. Justify the name. Be extra.",
      },
    };

    const levelGuide = `
PROFESSIONAL-TO-GENZ SPECTRUM:
- Level ${genzLevel}/100: ${genZIntensity >= 0.7 ? "FULL GenZ mode! Use all the slang, no filter" : genZIntensity >= 0.4 ? "Balanced: Professional meets GenZ. Readable but has personality." : "Subtle GenZ. Professional with just a HINT of personality."}`;

    const systemPrompt = `${baseGenZ}

STYLE: ${baseStyle[style]?.description}
TONE: ${baseStyle[style]?.tone}${levelGuide}

Return 3 different comment variations as JSON:
{
  "responses": [
    "variant 1 - different angle",
    "variant 2 - different intensity",
    "variant 3 - different vibe"
  ]
}

Generate ONLY the JSON. No explanations.`;

    return systemPrompt;
  }

  async function generateComment(postText, draft, genzLevel, style) {
    const endpoint = "https://api.groq.com/openai/v1/chat/completions";
    const PRIMARY_MODEL = "llama-3.1-8b-instant";

    // Check cooldown
    const now = Date.now();
    if (apiCooldown > now) {
      const waitSeconds = Math.ceil((apiCooldown - now) / 1000);
      throw new Error(
        `Rate limited. Wait ${waitSeconds}s before trying again.`,
      );
    }

    const systemMessage = getSystemPrompt(style, genzLevel);

    const userMessage = `Transform this draft into a GenZ LinkedIn comment:

Post context: "${postText.substring(0, 300) || "Generic post"}${postText.length > 300 ? "..." : ""}"

Draft to transform: "${draft}"`;

    console.log(
      "GenZ Booster: Sending API request with prompt:",
      userMessage.substring(0, 200),
    );
    console.log("GenZ Booster: API Key present:", !!settings.api_key);
    console.log("GenZ Booster: GenZ Level:", genzLevel, "Style:", style);

    const body = {
      model: PRIMARY_MODEL,
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 0.9,
      max_tokens: 500,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${settings.api_key}`,
        },
        body: JSON.stringify(body),
      });

      console.log("GenZ Booster: API Response status:", response.status);

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After") || "60";
        apiCooldown = Date.now() + parseInt(retryAfter) * 1000;
        throw new Error(
          `Rate limited ⏱️. Wait ${retryAfter}s before trying again. Check your Groq quota at https://console.groq.com`,
        );
      }

      if (!response.ok) {
        const error = await response.json();
        const errorMsg =
          error.error?.message ||
          error.message ||
          `API error: ${response.status}`;
        console.error("GenZ Booster: API Error:", errorMsg);

        // Check for quota exceeded
        if (
          errorMsg.includes("quota") ||
          errorMsg.includes("Quota") ||
          errorMsg.includes("rate limit")
        ) {
          throw new Error(
            `❌ Rate Limited or Quota Exceeded. Check your limits at https://console.groq.com. Error: ${errorMsg.substring(0, 100)}`,
          );
        }

        // Check for auth issues
        if (
          response.status === 401 ||
          errorMsg.includes("Unauthorized") ||
          errorMsg.includes("invalid")
        ) {
          throw new Error(
            `❌ Invalid API Key. Get a free key from https://console.groq.com`,
          );
        }

        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log("GenZ Booster: API Response received:", data);

      const responseText = data.choices?.[0]?.message?.content;

      if (!responseText) {
        console.error("GenZ Booster: No text in response");
        throw new Error("No response generated");
      }

      // Try to parse as JSON for multiple responses
      let comments = [];
      try {
        const parsed = JSON.parse(responseText);
        comments = parsed.responses || [responseText.trim()];
      } catch (e) {
        // Fallback if not JSON
        comments = [responseText.trim()];
      }

      console.log("GenZ Booster: Generated comments:", comments);
      lastApiCall = Date.now();
      return comments;  // Return array of comments
    } catch (error) {
      console.error("GenZ Booster: Generation error:", error);
      throw error;
    }
  }
  // ============================================
  // MUTATION OBSERVER

  function observeLinkedIn() {
    const observer = new MutationObserver((mutations) => {
      // Check if new comment boxes appeared
      for (const mutation of mutations) {
        if (mutation.type === "childList" || mutation.type === "subtree") {
          // Re-attach event listeners to new elements if needed
          // This handles dynamic loading of comments
          const textareas = document.querySelectorAll("textarea");
          for (const textarea of textareas) {
            if (isLinkedInCommentBox(textarea) && !textarea.hasListener) {
              textarea.hasListener = true;
              textarea.addEventListener("focusin", handleFocusIn, true);
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    });

    console.log("GenZ Booster: Mutation observer started");
  }

  // ============================================
  // UTILITIES
  // ============================================

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================
  // CACHING & QUEUE SYSTEM
  // ============================================

  function getCacheKey(postText, draft, style) {
    // Create a hash key from input to cache results
    const key = `${postText.substring(0, 50)}_${draft.substring(0, 50)}_${style}`;
    return key.replace(/[^a-z0-9]/gi, "_").substring(0, 100);
  }

  function getFromCache(postText, draft, style) {
    const key = getCacheKey(postText, draft, style);
    if (commentCache[key]) {
      console.log("GenZ Booster: Cache HIT for key:", key);
      return commentCache[key];
    }
    return null;
  }

  function saveToCache(postText, draft, style, result) {
    const key = getCacheKey(postText, draft, style);
    commentCache[key] = result;
    console.log("GenZ Booster: Cached comment for key:", key);
  }

  function queueRequest(postText, draft, genzLevel, style) {
    return new Promise((resolve, reject) => {
      requestQueue.push({ postText, draft, genzLevel, style, resolve, reject });
      console.log(
        "GenZ Booster: Request queued. Queue length:",
        requestQueue.length,
      );
      processQueue();
    });
  }

  async function processQueue() {
    if (isProcessingQueue || requestQueue.length === 0) return;

    isProcessingQueue = true;
    while (requestQueue.length > 0) {
      const { postText, draft, genzLevel, style, resolve, reject } =
        requestQueue.shift();

      try {
        console.log(
          "GenZ Booster: Processing queued request. Queue remaining:",
          requestQueue.length,
        );
        const result = await generateComment(postText, draft, genzLevel, style);
        resolve(result);
      } catch (error) {
        // If rate limited, put request back and wait
        if (
          error.message.includes("Rate limited") ||
          error.message.includes("Quota")
        ) {
          requestQueue.unshift({
            postText,
            draft,
            genzLevel,
            style,
            resolve,
            reject,
          });
          console.log("GenZ Booster: Rate limited. Request re-queued.");
          reject(error);
          break; // Stop processing, wait for cooldown
        }
        reject(error);
      }

      // Small delay between requests
      if (requestQueue.length > 0) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
    isProcessingQueue = false;
  }

  function showToast(message, type = "info") {
    // Remove existing toast
    const existing = document.querySelector(".gz-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `gz-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("visible");
    });

    setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ============================================
  // MESSAGE LISTENER
  // ============================================

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "settingsUpdated") {
      loadSettings().then(() => {
        if (settings.api_key && overlayBtn) {
          overlayBtn.classList.remove("disabled");
        }
      });
    }
  });

  // ============================================
  // INIT
  // ============================================

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
