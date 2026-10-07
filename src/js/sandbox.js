// Interactive Visual Studio Sandbox Controller
export function initSandbox() {
  const paletteButtons = document.querySelectorAll('.palette-btn');
  const fontButtons = document.querySelectorAll('.font-btn');
  const previewCard = document.getElementById('sandbox-preview-card');
  const previewTitle = document.getElementById('sandbox-preview-title');
  const previewBadge = document.getElementById('sandbox-preview-badge');
  const previewDesc = document.getElementById('sandbox-preview-desc');
  const previewBtn = document.getElementById('sandbox-preview-btn');
  const colorSwatchesContainer = document.getElementById('sandbox-swatches');

  const palettes = {
    modern: {
      name: "Modern Cyber & Vibrant",
      bg: "bg-slate-950",
      cardBg: "#0F172A",
      border: "#3B82F6",
      accent: "#EC4899",
      text: "#F8FAFC",
      badgeBg: "rgba(236, 72, 153, 0.15)",
      badgeText: "#F472B6",
      swatches: ["#0F172A", "#3B82F6", "#EC4899", "#8B5CF6", "#F8FAFC"]
    },
    corporate: {
      name: "Clean Executive Blue",
      bg: "bg-blue-950",
      cardBg: "#1E293B",
      border: "#60A5FA",
      accent: "#3B82F6",
      text: "#F1F5F9",
      badgeBg: "rgba(59, 130, 246, 0.2)",
      badgeText: "#60A5FA",
      swatches: ["#0B132B", "#1C2541", "#3B82F6", "#60A5FA", "#E2E8F0"]
    },
    warm: {
      name: "Warm Editorial Amber",
      bg: "bg-amber-950",
      cardBg: "#1C1917",
      border: "#F59E0B",
      accent: "#D97706",
      text: "#FAFAF9",
      badgeBg: "rgba(245, 158, 11, 0.2)",
      badgeText: "#FBBF24",
      swatches: ["#1C1917", "#44403C", "#F59E0B", "#FBBF24", "#FAFAF9"]
    },
    emerald: {
      name: "Organic Emerald & Gold",
      bg: "bg-emerald-950",
      cardBg: "#064E3B",
      border: "#10B981",
      accent: "#34D399",
      text: "#ECFDF5",
      badgeBg: "rgba(16, 185, 129, 0.2)",
      badgeText: "#6EE7B7",
      swatches: ["#022C22", "#064E3B", "#10B981", "#34D399", "#F0FDF4"]
    }
  };

  const fontPairs = {
    jakarta: {
      headingFont: "'Plus Jakarta Sans', sans-serif",
      bodyFont: "'Outfit', sans-serif",
      weight: "700"
    },
    outfit: {
      headingFont: "'Outfit', sans-serif",
      bodyFont: "'Plus Jakarta Sans', sans-serif",
      weight: "800"
    },
    mono: {
      headingFont: "'Courier New', monospace",
      bodyFont: "sans-serif",
      weight: "700"
    }
  };

  let currentPalette = 'modern';
  let currentFont = 'jakarta';

  function applySandboxStyles() {
    if (!previewCard) return;

    const p = palettes[currentPalette];
    const f = fontPairs[currentFont];

    previewCard.style.backgroundColor = p.cardBg;
    previewCard.style.borderColor = p.border;

    if (previewTitle) {
      previewTitle.style.fontFamily = f.headingFont;
      previewTitle.style.fontWeight = f.weight;
      previewTitle.style.color = p.text;
    }

    if (previewBadge) {
      previewBadge.style.backgroundColor = p.badgeBg;
      previewBadge.style.color = p.badgeText;
      previewBadge.style.borderColor = p.border;
    }

    if (previewDesc) {
      previewDesc.style.fontFamily = f.bodyFont;
    }

    if (previewBtn) {
      previewBtn.style.backgroundColor = p.accent;
      previewBtn.style.color = "#FFFFFF";
    }

    // Render swatches
    if (colorSwatchesContainer) {
      colorSwatchesContainer.innerHTML = p.swatches.map(color => `
        <div class="flex flex-col items-center gap-1 group/swatch">
          <div class="w-10 h-10 rounded-xl shadow-md border border-white/20 transition-transform group-hover/swatch:scale-110 duration-200" style="background-color: ${color}"></div>
          <span class="text-[10px] font-mono opacity-80 uppercase tracking-tighter">${color}</span>
        </div>
      `).join('');
    }
  }

  paletteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      paletteButtons.forEach(b => b.classList.remove('ring-2', 'ring-pink-500', 'border-pink-500', 'bg-white/10'));
      btn.classList.add('ring-2', 'ring-pink-500', 'border-pink-500', 'bg-white/10');
      currentPalette = btn.dataset.palette || 'modern';
      applySandboxStyles();
    });
  });

  fontButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      fontButtons.forEach(b => b.classList.remove('ring-2', 'ring-purple-500', 'border-purple-500', 'bg-white/10'));
      btn.classList.add('ring-2', 'ring-purple-500', 'border-purple-500', 'bg-white/10');
      currentFont = btn.dataset.font || 'jakarta';
      applySandboxStyles();
    });
  });

  // Initial call
  applySandboxStyles();
}
