import { I18nEngine } from './i18n.js';

// Import images directly so Vite bundles them into hashed dist/assets URLs
import logoImg from './assets/logo.jpg';
import realShot1 from './assets/real_shot1.png';
import realShot2 from './assets/real_shot2.png';
import realShot3 from './assets/real_shot3.png';
import realShot4 from './assets/real_shot4.png';

document.addEventListener('DOMContentLoaded', async () => {
  // 0. Bind Bundled Images to DOM
  document.querySelectorAll('.logo-img').forEach((img) => {
    img.src = logoImg;
  });
  const previewLogo = document.querySelector('.window-title img');
  if (previewLogo) previewLogo.src = logoImg;

  document.querySelectorAll('[data-shot="1"]').forEach((img) => {
    img.src = realShot1;
  });
  document.querySelectorAll('[data-shot="2"]').forEach((img) => {
    img.src = realShot2;
  });
  document.querySelectorAll('[data-shot="3"]').forEach((img) => {
    img.src = realShot3;
  });
  document.querySelectorAll('[data-shot="4"]').forEach((img) => {
    img.src = realShot4;
  });

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

  // 3. Scroll Reveal Animation for Sections & Cards
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    { threshold: 0.12 }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // 4. Interactive UI Showcase Preview Tabs
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

  // 5. Screenshot Carousel Slider Controller
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
    if (sliderTrack) sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

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

  // 6. FAQ Accordion Toggle
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.accordion-item').forEach((i) => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 7. Feedback Form & 24-Hour (Max 3 Submissions) Anti-Spam Protection Logic
  const feedbackForm = document.getElementById('feedbackForm');
  const fbSubject = document.getElementById('fbSubject');
  const fbDesc = document.getElementById('fbDesc');
  const fbCaptcha = document.getElementById('fbCaptcha');
  const subjectCount = document.getElementById('subjectCount');
  const descCount = document.getElementById('descCount');
  const captchaQuestion = document.getElementById('captchaQuestion');
  const formAlert = document.getElementById('formAlert');

  let captchaResult = 0;

  function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 9) + 2;
    const num2 = Math.floor(Math.random() * 9) + 1;
    captchaResult = num1 + num2;
    if (captchaQuestion) {
      captchaQuestion.textContent = `${num1} + ${num2} = ?`;
    }
  }
  generateCaptcha();

  // Floating Character Badges inside Bottom Right of Input Fields
  if (fbSubject && subjectCount) {
    fbSubject.addEventListener('input', () => {
      subjectCount.textContent = `${fbSubject.value.length}/80`;
    });
  }

  if (fbDesc && descCount) {
    fbDesc.addEventListener('input', () => {
      descCount.textContent = `${fbDesc.value.length}/1000`;
    });
  }

  function getRecentSubmissions() {
    try {
      const historyStr = localStorage.getItem('invis_feedback_history');
      if (!historyStr) return [];
      const history = JSON.parse(historyStr);
      const now = Date.now();
      // Keep only timestamps from the last 24 hours (86,400,000 ms)
      return history.filter((ts) => now - ts < 86400000);
    } catch {
      return [];
    }
  }

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const subjectVal = fbSubject.value.trim();
      const descVal = fbDesc.value.trim();
      const userCaptcha = parseInt(fbCaptcha.value.trim(), 10);

      // Check 24-Hour Limit (Max 3 Submissions per 24 hours)
      const recentSubmissions = getRecentSubmissions();
      if (recentSubmissions.length >= 3) {
        showFormAlert('Son 24 saat içinde maksimum 3 geri bildirim gönderme hakkınızı doldurdunuz. Lütfen daha sonra tekrar deneyin.', 'error');
        return;
      }

      // Check Min Lengths
      if (subjectVal.length < 5 || descVal.length < 15) {
        showFormAlert('Lütfen en az 5 karakterlik konu ve 15 karakterlik açıklama yazın.', 'error');
        return;
      }

      // Check Math Captcha
      if (userCaptcha !== captchaResult) {
        showFormAlert('Güvenlik doğrulaması cevabı hatalı! Lütfen tekrar deneyin.', 'error');
        generateCaptcha();
        if (fbCaptcha) fbCaptcha.value = '';
        return;
      }

      // Record Submission Timestamp
      recentSubmissions.push(Date.now());
      localStorage.setItem('invis_feedback_history', JSON.stringify(recentSubmissions));

      showFormAlert('Geri bildiriminiz için teşekkürler! E-posta istemciniz hazırlanıyor...', 'success');

      // Open Mailto link
      const mailUrl = `mailto:invislauncher@gmail.com?subject=${encodeURIComponent('[INVIS Geri Bildirim] ' + subjectVal)}&body=${encodeURIComponent(descVal)}`;
      setTimeout(() => {
        window.location.href = mailUrl;
      }, 800);

      feedbackForm.reset();
      if (subjectCount) subjectCount.textContent = '0/80';
      if (descCount) descCount.textContent = '0/1000';
      generateCaptcha();
    });
  }

  function showFormAlert(msg, type) {
    if (!formAlert) return;
    formAlert.textContent = msg;
    formAlert.className = `form-alert ${type}`;
    formAlert.style.display = 'block';

    setTimeout(() => {
      if (type !== 'success') formAlert.style.display = 'none';
    }, 7000);
  }

  // 8. Changelog Modal Controller
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

  // 9. Dedicated Privacy Policy & Terms of Service View Router
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

  if (window.location.hash === '#privacy') showPrivacy();
  if (window.location.hash === '#terms') showTerms();

  // 10. Animated Canvas Particle Mesh Background with Mouse Parallax Interaction
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    let mouse = { x: -1000, y: -1000 };

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    });

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2
    }));

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 100) {
          const force = (100 - distMouse) / 100;
          p.x += (dxMouse / distMouse) * force * 3;
          p.y += (dyMouse / distMouse) * force * 3;
        }

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00FF88';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 255, 136, ${0.18 * (1 - dist / 130)})`;
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
