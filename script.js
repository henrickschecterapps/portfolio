/**
 * Henrique Matos — Portfolio Logic
 * Handles: Reveal on Scroll, Navbar Effects, Portfolio Filtering, Video Modal, Collapsible Cards
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. REVEAL ON SCROLL (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Optional: stop observing once visible
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15, // Trigger when 15% of element is visible
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // 2. NAVBAR SCROLL EFFECT
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  // 3. PORTFOLIO FILTERING
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          // Re-trigger reveal animation if hidden before
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
    card.addEventListener('click', (e) => {
      // Don't open video if clicking inside an expandable card's detail or button
      if (e.target.closest('.card-detail') || e.target.closest('.card-collapse-btn')) return;

      const videoId = card.getAttribute('data-vid');
      const type = card.getAttribute('data-type'); // 'youtube'

      if (videoId && type === 'youtube') {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        modalFrame.innerHTML = `<iframe src="${embedUrl}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock scroll
      } else if (card.getAttribute('data-expandable') === 'true') {
        // Handle expand logic instead of video
        card.classList.toggle('expanded');
      }
    });
  });

  // Close Modal
  const closeModal = () => {
    modal.classList.remove('open');
    modalFrame.innerHTML = '';
    document.body.style.overflow = ''; // Unlock scroll
  };

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Esc key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });


  // 5. EXPANDABLE CARDS COLLAPSE BUTTON
  const collapseBtns = document.querySelectorAll('.card-collapse-btn');
  collapseBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent modal from opening
      const card = btn.closest('.portfolio-card');
      card.classList.remove('expanded');
      // Scroll back to card top smoothly
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

});
