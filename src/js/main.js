import { projectsData } from './projectsData.js';
import { skillsData } from './skillsData.js';
import { initSandbox } from './sandbox.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initCustomCursor();
  renderProjects('all');
  initProjectFilters();
  renderSkills();
  initContactForm();
  initModal();
  initSandbox();
  initScrollEffects();
  initBeforeAfterSlider();
  initResumeModal();
  initTiltAndSpotlight();
});

/* ==========================================================================
   1. Theme Management (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('theme-toggle-sun');
  const moonIcon = document.getElementById('theme-toggle-moon');
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');

  function applyTheme(isDark) {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      if (sunIcon) sunIcon.classList.remove('hidden');
      if (moonIcon) moonIcon.classList.add('hidden');
      if (metaColorScheme) metaColorScheme.content = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      if (sunIcon) sunIcon.classList.add('hidden');
      if (moonIcon) moonIcon.classList.remove('hidden');
      if (metaColorScheme) metaColorScheme.content = 'light';
    }
  }

  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let isDark = storedTheme ? storedTheme === 'dark' : systemPrefersDark;

  applyTheme(isDark);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      isDark = !document.documentElement.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      applyTheme(isDark);
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches);
    }
  });
}

/* ==========================================================================
   2. Navbar & Mobile Menu Drawer
   ========================================================================== */
function initNavbar() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
      }
    });
  });
}

/* ==========================================================================
   3. Featured Projects Grid & Filtering
   ========================================================================== */
function renderProjects(filterCategory = 'all') {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  const filtered = filterCategory === 'all' 
    ? projectsData 
    : projectsData.filter(p => p.categorySlug === filterCategory);

  container.innerHTML = filtered.map(project => {
    let mediaHTML = '';

    if (project.mediaType === 'video') {
      mediaHTML = `
        <video class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" muted loop autoplay playsinline poster="/assets/images/porfilio image 1.png">
          <source src="${project.videoSrc}" type="video/mp4">
        </video>
        <div class="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <div class="w-12 h-12 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-lg backdrop-blur transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <svg class="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      `;
    } else if (project.mediaType === 'pdf') {
      mediaHTML = `
        <div class="relative w-full h-full overflow-hidden bg-slate-900 group/pdf">
          <img src="${project.image || '/assets/images/presentation-preview.png'}" alt="${project.title}" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-between p-4">
            <div class="flex justify-between items-center">
              <span class="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-pink-600/90 text-white backdrop-blur shadow-md">
                PDF Slide Deck
              </span>
              <span class="w-8 h-8 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center group-hover/pdf:scale-110 group-hover/pdf:bg-pink-500 transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </span>
            </div>
            <div class="text-white">
              <span class="text-xs font-semibold text-pink-400 block font-mono">Template-Based Deck</span>
              <span class="text-xs text-slate-300">Click button below to open full presentation</span>
            </div>
          </div>
        </div>
      `;
    } else if (project.image) {
      mediaHTML = `
        <img src="${project.image}" alt="${project.title}" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
        <div class="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span class="px-4 py-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white text-xs font-bold shadow-lg backdrop-blur transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            Click for Case Study ✨
          </span>
        </div>
      `;
    } else {
      mediaHTML = project.bannerSvg || '';
    }

    const buttonHTML = project.mediaType === 'pdf'
      ? `
        <a 
          href="${project.pdfSrc}" 
          target="_blank" 
          rel="noopener noreferrer"
          class="btn-shine w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-pink-600 hover:bg-pink-700 text-white transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-95">
          <span>Open PDF Presentation</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        </a>
      `
      : `
        <button 
          data-project-id="${project.id}" 
          class="btn-shine open-modal-btn w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-pink-600 text-white dark:bg-slate-800 dark:hover:bg-pink-600 dark:text-white transition-all duration-300 shadow-sm hover:scale-[1.02] active:scale-95">
          <span>${project.mediaType === 'video' ? 'Play Video Reel' : 'View Project Case Study'}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      `;

    return `
      <article class="tilt-card spotlight-card group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:border-pink-500/50 dark:hover:border-pink-500/50 transition-all duration-300 flex flex-col">
        <!-- Media Container -->
        <div class="relative h-60 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          ${mediaHTML}
          <div class="absolute top-4 left-4 z-10">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-black/75 backdrop-blur-md text-white border border-white/20 shadow-md">
              ${project.category}
            </span>
          </div>
          <div class="absolute top-4 right-4 z-10">
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-pink-500/90 text-white shadow-md group-hover:scale-105 transition-transform">
              ${project.metrics}
            </span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span>Client: ${project.client}</span>
              <span>${project.year}</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors mb-2">
              ${project.title}
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              ${project.shortDesc}
            </p>
          </div>

          <div>
            <!-- Tools & Tech Pills -->
            <div class="flex flex-wrap gap-1.5 mb-5">
              ${project.tools.map(tool => `
                <span class="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 group-hover:border-pink-500/30 transition-colors">
                  ${tool}
                </span>
              `).join('')}
            </div>

            <!-- Action Button -->
            ${buttonHTML}
          </div>
        </div>
      </article>
    `;
  }).join('');

  attachModalListeners();
  initTiltAndSpotlight();
}

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-pink-600', 'text-white', 'shadow-md');
        b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
      });
      btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
      btn.classList.add('bg-pink-600', 'text-white', 'shadow-md');

      const filterCategory = btn.dataset.filter || 'all';
      renderProjects(filterCategory);
    });
  });
}

/* ==========================================================================
   4. Case Study Modal (<dialog>) with Clean Media Rendering
   ========================================================================== */
function initModal() {
  const dialog = document.getElementById('project-modal');
  const closeBtn = document.getElementById('close-modal-btn');

  if (!dialog) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', () => dialog.close());
  }

  dialog.addEventListener('click', (e) => {
    const dialogBounds = dialog.getBoundingClientRect();
    if (
      e.clientX < dialogBounds.left ||
      e.clientX > dialogBounds.right ||
      e.clientY < dialogBounds.top ||
      e.clientY > dialogBounds.bottom
    ) {
      dialog.close();
    }
  });
}

function initResumeModal() {
  const openBtn = document.getElementById('open-resume-btn');
  const modal = document.getElementById('resume-modal');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => modal.showModal());

    modal.addEventListener('click', (e) => {
      const bounds = modal.getBoundingClientRect();
      if (
        e.clientX < bounds.left ||
        e.clientX > bounds.right ||
        e.clientY < bounds.top ||
        e.clientY > bounds.bottom
      ) {
        modal.close();
      }
    });
  }
}

function attachModalListeners() {
  const dialog = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-dynamic-content');
  if (!dialog || !modalContent) return;

  const openBtns = document.querySelectorAll('.open-modal-btn');
  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.dataset.projectId;
      const project = projectsData.find(p => p.id === projectId);
      if (!project) return;

      let modalMediaHTML = '';

      if (project.mediaType === 'video') {
        modalMediaHTML = `
          <div class="space-y-3">
            <video controls class="w-full h-auto max-h-[500px] rounded-xl shadow-lg bg-black" preload="metadata" poster="/assets/images/porfilio image 1.png">
              <source src="${project.videoSrc}" type="video/mp4">
              Your browser does not support HTML video.
            </video>
            <div class="text-right">
              <a href="${project.videoSrc}" target="_blank" download class="inline-flex items-center gap-1 text-xs font-semibold text-pink-500 hover:underline">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Download Video File (.mp4)
              </a>
            </div>
          </div>
        `;
      } else if (project.mediaType === 'pdf') {
        modalMediaHTML = `
          <div class="space-y-4 text-center p-8 rounded-2xl bg-slate-900 text-white border border-slate-800">
            <div class="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center mx-auto shadow-lg">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold">Template-Based Presentation Deck</h3>
            <p class="text-xs text-slate-300 max-w-md mx-auto">Click below to open the complete PDF presentation in a new tab for seamless full-screen viewing and downloading.</p>
            <a href="${project.pdfSrc}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-pink-600 hover:bg-pink-700 text-white transition-all shadow-lg">
              <span>Open PDF in New Tab</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>
        `;
      } else if (project.gallery && project.gallery.length > 0) {
        modalMediaHTML = `
          <div class="space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Instagram Campaign Grid Gallery</h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              ${project.gallery.map(img => `
                <a href="${img}" target="_blank" class="block group relative overflow-hidden rounded-xl border border-slate-700 shadow-sm">
                  <img src="${img}" alt="Instagram post" loading="lazy" class="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-300">
                </a>
              `).join('')}
            </div>
          </div>
        `;
      } else if (project.image) {
        modalMediaHTML = `
          <div class="relative h-72 w-full rounded-xl overflow-hidden shadow-md">
            <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover">
          </div>
        `;
      } else {
        modalMediaHTML = `<div class="relative h-64 w-full rounded-xl overflow-hidden shadow-inner">${project.bannerSvg}</div>`;
      }

      modalContent.innerHTML = `
        <div class="space-y-6">
          ${modalMediaHTML}

          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-600 dark:text-pink-400 mb-1">
                ${project.category}
              </span>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white">${project.title}</h2>
            </div>
            <div class="text-right text-sm text-slate-500 dark:text-slate-400">
              <p><strong class="text-slate-800 dark:text-slate-200">Client:</strong> ${project.client}</p>
              <p><strong class="text-slate-800 dark:text-slate-200">Year:</strong> ${project.year}</p>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Project Overview</h4>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
              ${project.fullDesc}
            </p>
          </div>

          <div>
            <h4 class="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Key Design Deliverables</h4>
            <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              ${project.details.map(item => `
                <li class="flex items-start gap-2">
                  <svg class="w-5 h-5 text-pink-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  <span>${item}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <div>
            <h4 class="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Tools & Design Stack</h4>
            <div class="flex flex-wrap gap-2">
              ${project.tools.map(tool => `
                <span class="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  ${tool}
                </span>
              `).join('')}
            </div>
          </div>

          <div class="pt-4 flex gap-3">
            <button onclick="document.getElementById('project-modal').close()" class="flex-1 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow-md transition-all">
              Close Preview
            </button>
          </div>
        </div>
      `;

      dialog.showModal();
    });
  });
}

/* ==========================================================================
   5. Render Skills Section
   ========================================================================== */
function renderSkills() {
  const container = document.getElementById('skills-grid');
  if (!container) return;

  const iconSvgMap = {
    'palette': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>',
    'layout-template': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>',
    'sparkles': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>',
    'grid': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',
    'type': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"/></svg>',
    'image': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
  };

  container.innerHTML = skillsData.map(skill => `
    <div class="tilt-card spotlight-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-500/50 transition-all shadow-sm hover:shadow-2xl flex flex-col justify-between group">
      <div>
        <div class="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300 shadow-md">
          ${iconSvgMap[skill.icon] || ''}
        </div>
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-pink-500 transition-colors">${skill.category}</h3>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          ${skill.description}
        </p>
      </div>

      <div>
        <div class="mb-4">
          <div class="flex justify-between items-center text-xs font-semibold mb-1">
            <span class="text-slate-500 dark:text-slate-400">Proficiency</span>
            <span class="text-pink-600 dark:text-pink-400 font-bold">${skill.level}%</span>
          </div>
          <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
            <div class="h-full rounded-full shimmer-bar transition-all duration-1000 shadow-sm" style="width: ${skill.level}%"></div>
          </div>
        </div>

        <div class="flex flex-wrap gap-1.5">
          ${skill.tools.map(t => `
            <span class="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 group-hover:border-pink-500/30 border border-slate-200 dark:border-slate-700 transition-colors">
              ${t}
            </span>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');

  initTiltAndSpotlight();
}

/* ==========================================================================
   6. Before / After Comparison Slider Logic
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('before-after-slider');
  const rangeInput = document.getElementById('slider-range-input');
  const beforeLayer = document.getElementById('before-layer');
  const divider = document.getElementById('slider-divider');

  if (!container || !rangeInput || !beforeLayer || !divider) return;

  function updateSlider(val) {
    const clamped = Math.max(0, Math.min(100, val));
    beforeLayer.style.height = `${clamped}%`;
    divider.style.top = `${clamped}%`;
    rangeInput.value = clamped;
  }

  // Handle click & drag range input
  rangeInput.addEventListener('input', (e) => {
    updateSlider(e.target.value);
  });

  // Handle vertical hover-based curtain reveal as mouse moves UP & DOWN across card
  let isHovered = false;
  container.addEventListener('mouseenter', () => { isHovered = true; });
  container.addEventListener('mouseleave', () => { isHovered = false; });

  container.addEventListener('mousemove', (e) => {
    if (!isHovered) return;
    const rect = container.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = (y / rect.height) * 100;
    updateSlider(percentage);
  });

  // Mobile Touch support (vertical reveal)
  container.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      const rect = container.getBoundingClientRect();
      const y = e.touches[0].clientY - rect.top;
      const percentage = (y / rect.height) * 100;
      updateSlider(percentage);
    }
  }, { passive: true });

  updateSlider(50);
}

/* ==========================================================================
   7. Contact Form & Feedback Toast
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = form.elements['name']?.value;
    const email = form.elements['email']?.value;
    const message = form.elements['message']?.value;

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    showToast(`Thank you, ${name}! Your message has been sent successfully. ✨`, 'success');
    form.reset();
  });
}

function showToast(msg, type = 'success') {
  const toast = document.getElementById('contact-toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.className = `fixed bottom-8 right-8 z-50 px-6 py-3.5 rounded-xl shadow-2xl font-semibold text-sm transition-all duration-300 transform translate-y-0 ${
    type === 'success' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' : 'bg-rose-600 text-white'
  }`;

  setTimeout(() => {
    toast.className = 'fixed bottom-8 right-8 z-50 px-6 py-3.5 rounded-xl shadow-2xl font-semibold text-sm transition-all duration-300 transform translate-y-24 opacity-0 pointer-events-none';
  }, 4000);
}

/* ==========================================================================
   8. Scroll Effects & Progress Bar
   ========================================================================== */
function initScrollEffects() {
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        backToTopBtn.classList.add('opacity-100', 'translate-y-0');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   9. Custom Cursor & Interactive Pointer Follower
   ========================================================================== */
function initCustomCursor() {
  const cursorDot = document.getElementById('custom-cursor-dot');
  const cursorRing = document.getElementById('custom-cursor-ring');

  if (!cursorDot || !cursorRing) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Attach hover state triggers for interactive elements
  const updateInteractiveListeners = () => {
    const interactives = document.querySelectorAll('a, button, input, select, textarea, .tilt-card, .swatch-btn, .nav-link, .filter-btn');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering-link'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering-link'));
    });
  };

  updateInteractiveListeners();
  
  // Re-attach listeners when dynamic content renders
  const observer = new MutationObserver(updateInteractiveListeners);
  observer.observe(document.body, { childList: true, subtree: true });
}

/* ==========================================================================
   10. 3D Tilt Card & Mouse Spotlight Dynamics
   ========================================================================== */
function initTiltAndSpotlight() {
  const cards = document.querySelectorAll('.tilt-card, .spotlight-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update spotlight CSS variable position
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (card.classList.contains('tilt-card')) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg
        const rotateY = ((x - centerX) / centerX) * 5; // max 5 deg

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (card.classList.contains('tilt-card')) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    });
  });
}
