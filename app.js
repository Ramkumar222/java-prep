// ========================================
// JAVA INTERVIEW MASTER – App Logic
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initSearch();
  initTopicCards();
  initBackToTop();
  initProgressTracking();
  initScrollSpy();
  initKeyboardShortcuts();
});

/* --- Sidebar Toggle (Mobile) --- */
function initSidebar() {
  const toggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (toggle) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  // Nav item clicks
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  });
}

/* --- Search --- */
function initSearch() {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!input || !results) return;

  const allTopics = [];
  document.querySelectorAll('.topic-card').forEach(card => {
    const title = card.querySelector('.topic-title')?.textContent || '';
    const category = card.closest('.category-section')?.querySelector('.category-title')?.textContent || '';
    const catId = card.closest('.category-section')?.id || '';
    allTopics.push({ title, category, catId, card });
  });

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    if (query.length < 2) {
      results.classList.remove('active');
      results.innerHTML = '';
      return;
    }

    const matches = allTopics.filter(t =>
      t.title.toLowerCase().includes(query) || t.category.toLowerCase().includes(query)
    ).slice(0, 15);

    if (matches.length === 0) {
      results.innerHTML = '<div class="no-results">No topics found. Try different keywords.</div>';
      results.classList.add('active');
      return;
    }

    results.innerHTML = matches.map(m => {
      const highlighted = m.title.replace(
        new RegExp(`(${escapeRegex(query)})`, 'gi'),
        '<mark>$1</mark>'
      );
      return `
        <div class="search-result-item" data-cat="${m.catId}" data-title="${m.title}">
          <span class="search-result-cat">${m.category}</span>
          <span class="search-result-title">${highlighted}</span>
        </div>
      `;
    }).join('');

    results.classList.add('active');

    results.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const title = item.dataset.title;
        const match = allTopics.find(t => t.title === title);
        if (match) {
          match.card.classList.add('open');
          match.card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          match.card.style.boxShadow = '0 0 40px rgba(124,58,237,0.4)';
          setTimeout(() => match.card.style.boxShadow = '', 2000);
        }
        results.classList.remove('active');
        input.value = '';
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container') && !e.target.closest('.search-results')) {
      results.classList.remove('active');
    }
  });
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* --- Topic Card Toggle --- */
function initTopicCards() {
  document.querySelectorAll('.topic-header').forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.topic-card');
      const wasOpen = card.classList.contains('open');

      card.classList.toggle('open');

      // Track reading progress
      if (!wasOpen) {
        card.dataset.read = 'true';
        updateProgress();
      }
    });
  });

  // Copy code buttons
  document.querySelectorAll('.code-copy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const codeBlock = btn.closest('.code-block');
      const code = codeBlock.querySelector('pre').textContent;
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = '✓ Copied';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });
}

/* --- Back to Top --- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- Progress Tracking --- */
function initProgressTracking() {
  updateProgress();
}

function updateProgress() {
  const total = document.querySelectorAll('.topic-card').length;
  const read = document.querySelectorAll('.topic-card[data-read="true"]').length;
  const pct = total > 0 ? Math.round((read / total) * 100) : 0;

  const fill = document.querySelector('.progress-fill');
  const label = document.getElementById('progressLabel');

  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = `${read}/${total} topics read`;
}

/* --- Scroll Spy (highlight active nav) --- */
function initScrollSpy() {
  const sections = document.querySelectorAll('.category-section');
  const navItems = document.querySelectorAll('.nav-item');

  if (sections.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(n => n.classList.remove('active'));
        const active = document.querySelector(`.nav-item[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-100px 0px -60% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

/* --- Keyboard Shortcuts --- */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+K or / to focus search
    if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT')) {
      e.preventDefault();
      document.getElementById('searchInput')?.focus();
    }

    // Escape to close search
    if (e.key === 'Escape') {
      document.getElementById('searchInput')?.blur();
      document.getElementById('searchResults')?.classList.remove('active');
    }
  });
}
