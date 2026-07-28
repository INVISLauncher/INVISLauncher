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
    { threshold: 0.15 }
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

  // 7. Feedback Form & Anti-Spam Protection Logic
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

  // Character counters
  if (fbSubject && subjectCount) {
    fbSubject.addEventListener('input', () => {
      subjectCount.textContent = `${fbSubject.value.length} / 80`;
    });
  }

  if (fbDesc && descCount) {
    fbDesc.addEventListener('input', () => {
      descCount.textContent = `${fbDesc.value.length} / 1000`;
    });
  }

  // Form Submit Handler
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const subjectVal = fbSubject.value.trim();
      const descVal = fbDesc.value.trim();
      const userCaptcha = parseInt(fbCaptcha.value.trim(), 10);

      // Check 60s Cooldown / Rate Limiter
      const lastTime = localStorage.getItem('invis_last_feedback_time');
      const now = Date.now();
      if (lastTime && now - parseInt(lastTime, 10) < 60000) {
        const remaining = Math.ceil((60000 - (now - parseInt(lastTime, 10))) / 1000);
        showFormAlert(`Lütfen yeni bir mesaj göndermeden önce ${remaining} saniye bekleyin.`, 'error');
        return;
      }

      // Check Lengths
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

      // Record Submission Time
      localStorage.setItem('invis_last_feedback_time', Date.now().toString());

      showFormAlert('Geri bildiriminiz için teşekkürler! E-posta istemciniz açılıyor...', 'success');

      // Open mailto link formatted with subject and body
      const mailUrl = `mailto:invislauncher@gmail.com?subject=${encodeURIComponent('[INVIS Geri Bildirim] ' + subjectVal)}&body=${encodeURIComponent(descVal)}`;
      setTimeout(() => {
        window.location.href = mailUrl;
      }, 800);

      // Reset Form
      feedbackForm.reset();
      if (subjectCount) subjectCount.textContent = '0 / 80';
      if (descCount) descCount.textContent = '0 / 1000';
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
    }, 6000);
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

        // Repel gently from mouse cursor
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
