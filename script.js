/**
 * Henrique Matos — Portfolio Logic (Global Version)
 * Handles: Reveal on Scroll, Navbar Effects, Portfolio Filtering, Video Modal, Collapsible Cards,
 * i18n (Language Switch), Back to Top.
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. REVEAL ON SCROLL (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // 2. NAVBAR SCROLL EFFECT
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });


  // 3. PORTFOLIO FILTERING
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => card.classList.add('is-visible'), 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // 4. VIDEO MODAL LOGIC
  const modal = document.getElementById('modal');
  const modalFrame = document.getElementById('modal-frame');
  const modalClose = document.getElementById('modal-close');

  portfolioCards.forEach(card => {
    const handleCardInteraction = (e) => {
      if (e.target.closest('.card-detail') || e.target.closest('.card-collapse-btn')) return;

      const videoId = card.getAttribute('data-vid');
      const type = card.getAttribute('data-type');

      if (videoId && type === 'youtube') {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        if (modalFrame) modalFrame.innerHTML = `<iframe src="${embedUrl}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        if (modal) modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else if (card.getAttribute('data-expandable') === 'true') {
        card.classList.toggle('expanded');
        // Update aria-expanded when toggling
        const isExpanded = card.classList.contains('expanded');
        card.setAttribute('aria-expanded', isExpanded.toString());
      }
    };

    card.addEventListener('click', handleCardInteraction);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // Prevent default scroll for Space
        handleCardInteraction(e);
      }
    });
  });

  const closeModal = () => {
    if (modal) modal.classList.remove('open');
    if (modalFrame) modalFrame.innerHTML = '';
    document.body.style.overflow = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
  });


  // 5. EXPANDABLE CARDS COLLAPSE BUTTON
  const collapseBtns = document.querySelectorAll('.card-collapse-btn');
  collapseBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.portfolio-card');
      card.classList.remove('expanded');
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });


  // 6. BACK TO TOP
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // 7. i18n (Internationalization)
  const langBtns = document.querySelectorAll('.lang-btn');
  const translatableItems = document.querySelectorAll('[data-en]');

  const setLanguage = (lang) => {
    localStorage.setItem('portfolio-lang', lang);
    
    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    translatableItems.forEach(item => {
      const enText = item.getAttribute('data-en');
      const ptText = item.getAttribute('data-pt') || item.innerHTML; // Fallback to current innerHTML

      // Store PT text if not already stored
      if (!item.getAttribute('data-pt')) {
          item.setAttribute('data-pt', ptText);
      }

      if (lang === 'en') {
        item.innerHTML = enText;
      } else {
        item.innerHTML = item.getAttribute('data-pt');
      }
    });
  };

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
    });
  });

  // Init language from local storage or default
  const savedLang = localStorage.getItem('portfolio-lang') || 'pt';
  if (savedLang === 'en') setLanguage('en');

});
