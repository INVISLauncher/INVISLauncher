import { I18nEngine } from './i18n.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Internationalization (i18n)
  const i18n = new I18nEngine();
  await i18n.init();

  // 2. Sticky Navbar & Scroll Progress Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Active section nav link highlight via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  // 3. Interactive UI Showcase Preview Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = document.getElementById(targetTab);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });

  // 4. Screenshot Carousel Slider Controller
  const sliderTrack = document.getElementById('sliderTrack');
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  const dots = document.querySelectorAll('.slider-dot');

  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoSlideTimer = null;

  function updateSlider(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
      updateSlider(currentSlide + 1);
    }, 4500);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      updateSlider(currentSlide - 1);
      startAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
      updateSlider(currentSlide + 1);
      startAutoSlide();
    });

    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        updateSlider(idx);
        startAutoSlide();
      });
    });

    startAutoSlide();
  }

  // 5. FAQ Accordion Toggle
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close all other accordion items
      document.querySelectorAll('.accordion-item').forEach((i) => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 6. Changelog Modal Controller
  const changelogModal = document.getElementById('changelogModal');
  const openChangelogBtn = document.getElementById('openChangelogBtn');
  const closeChangelogBtn = document.getElementById('closeChangelogBtn');
  const closeChangelogBtn2 = document.getElementById('closeChangelogBtn2');

  function openModal() {
    if (changelogModal) changelogModal.classList.add('active');
  }

  function closeModal() {
    if (changelogModal) changelogModal.classList.remove('active');
  }

  if (openChangelogBtn) openChangelogBtn.addEventListener('click', openModal);
  if (closeChangelogBtn) closeChangelogBtn.addEventListener('click', closeModal);
  if (closeChangelogBtn2) closeChangelogBtn2.addEventListener('click', closeModal);

  if (changelogModal) {
    changelogModal.addEventListener('click', (e) => {
      if (e.target === changelogModal) closeModal();
    });
  }

  // 7. Dedicated Privacy Policy & Terms of Service View Router
  const privacyView = document.getElementById('privacyView');
  const termsView = document.getElementById('termsView');
  const openPrivacyFooterBtn = document.getElementById('openPrivacyFooterBtn');
  const openTermsFooterBtn = document.getElementById('openTermsFooterBtn');
  const backFromLegalBtns = document.querySelectorAll('.backFromLegalBtn');

  function showPrivacy() {
    if (privacyView) privacyView.classList.add('active');
    if (termsView) termsView.classList.remove('active');
    window.location.hash = 'privacy';
  }

  function showTerms() {
    if (termsView) termsView.classList.add('active');
    if (privacyView) privacyView.classList.remove('active');
    window.location.hash = 'terms';
  }

  function hideLegalViews() {
    if (privacyView) privacyView.classList.remove('active');
    if (termsView) termsView.classList.remove('active');
    if (window.location.hash === '#privacy' || window.location.hash === '#terms') {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }

  if (openPrivacyFooterBtn) openPrivacyFooterBtn.addEventListener('click', showPrivacy);
  if (openTermsFooterBtn) openTermsFooterBtn.addEventListener('click', showTerms);

  backFromLegalBtns.forEach((btn) => btn.addEventListener('click', hideLegalViews));

  // Check URL Hash on page load
  if (window.location.hash === '#privacy') showPrivacy();
  if (window.location.hash === '#terms') showTerms();

  // 8. Animated Canvas Particle Mesh Background for Hero
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    });

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2
    }));

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00FF88';
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 255, 136, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }
});
