import { I18nEngine } from './i18n.js';

// Import images directly so Vite bundles them into hashed dist/assets URLs
import logoImg from './assets/logo.jpg';
import realShot1 from './assets/real_shot1.png';
import realShot2 from './assets/real_shot2.png';
import realShot3 from './assets/real_shot3.png';
import realShot4 from './assets/real_shot4.png';

// Global i18n instance initialized immediately
const i18n = new I18nEngine();
window.i18nEngine = i18n;
window.i18n = i18n;

// Disposable Email Domain Blacklist
const DISPOSABLE_DOMAINS = [
  'tempmail.com', 'temp-mail.org', 'guerrillamail.com', '10minutemail.com',
  'trashmail.com', 'mailinator.com', 'sharklasers.com', 'dispostable.com',
  'yopmail.com', 'getnada.com', 'fakemail.net', 'crazymailing.com',
  'dropmail.me', 'throwawaymail.com', 'mohmal.com', 'generator.email',
  'emailondeck.com', 'tempmailo.com', 'burnermail.io', 'mailnesia.com',
  'maildrop.cc', 'receive-smss.com', 'disposablemail.com', 'mytrashmail.com',
  'tempmail.net', 'tempmail.ninja', 'tmpmail.org', 'bupmail.com', 'zohomail.top'
];

function validateRealEmail(emailStr) {
  const email = emailStr.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'format' };
  }

  const parts = email.split('@');
  if (parts.length !== 2) return { valid: false, reason: 'format' };

  const domain = parts[1];
  if (DISPOSABLE_DOMAINS.includes(domain)) {
    return { valid: false, reason: 'disposable' };
  }

  const domainParts = domain.split('.');
  if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
    return { valid: false, reason: 'domain' };
  }

  return { valid: true };
}

// Visual Anti-Bot Canvas Captcha Generator
window.currentCaptchaCode = '';

window.generateVisualCaptcha = function() {
  const canvas = document.getElementById('captchaCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Clear background
  ctx.fillStyle = '#070A11';
  ctx.fillRect(0, 0, width, height);

  // Generate 5-char alphanumeric code (excluding ambiguous chars)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  window.currentCaptchaCode = code;

  // Draw background noise lines
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = `rgba(0, 255, 136, ${Math.random() * 0.4 + 0.15})`;
    ctx.lineWidth = Math.random() * 2 + 1;
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }

  // Draw noise dots
  for (let i = 0; i < 35; i++) {
    ctx.fillStyle = `rgba(0, 240, 255, ${Math.random() * 0.5})`;
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw distorted characters
  ctx.font = 'bold 22px Outfit, sans-serif';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    ctx.save();
    const x = 16 + i * 24;
    const y = height / 2 + (Math.random() * 4 - 2);
    const angle = (Math.random() - 0.5) * 0.4;
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.fillStyle = i % 2 === 0 ? '#00FF88' : '#00F0FF';
    ctx.shadowColor = '#00FF88';
    ctx.shadowBlur = 6;
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }
};

// Global Language Functions for zero-friction click handlers
window.toggleLangMenu = function(e) {
  if (e) e.stopPropagation();
  const langMenu = document.getElementById('langMenu');
  if (langMenu) langMenu.classList.toggle('open');
};

window.switchLanguage = function(lang, e) {
  if (e) e.stopPropagation();
  i18n.loadLanguage(lang);
  const langMenu = document.getElementById('langMenu');
  if (langMenu) langMenu.classList.remove('open');
};

// Global Form Submit Handler with Real Email Verification & CAPTCHA Check
window.handleFeedbackSubmit = async function(e) {
  if (e) e.preventDefault();

  const fbEmail = document.getElementById('fbEmail');
  const fbSubject = document.getElementById('fbSubject');
  const fbDesc = document.getElementById('fbDesc');
  const fbCaptcha = document.getElementById('fbCaptcha');
  const subjectCount = document.getElementById('subjectCount');
  const descCount = document.getElementById('descCount');
  const submitFeedbackBtn = document.getElementById('submitFeedbackBtn');

  const userEmailVal = fbEmail ? fbEmail.value.trim() : '';
  const subjectVal = fbSubject ? fbSubject.value.trim() : '';
  const descVal = fbDesc ? fbDesc.value.trim() : '';
  const userCaptchaVal = fbCaptcha ? fbCaptcha.value.trim() : '';

  const currentLang = i18n.currentLang || 'tr';

  // 1. Strict Real Email Verification & Anti-Temp-Mail Check
  const emailCheck = validateRealEmail(userEmailVal);
  if (!emailCheck.valid) {
    if (emailCheck.reason === 'disposable') {
      showFormAlert(currentLang === 'en' ? '⚠️ Temporary (Temp-Mail) email addresses are blocked! Please use a real email.' : '⚠️ Geçici (Temp-Mail) e-posta adresleri engellenmiştir! Lütfen gerçek e-posta adresinizi girin.', 'error');
    } else {
      showFormAlert(currentLang === 'en' ? '⚠️ Please enter a valid real email address!' : '⚠️ Lütfen geçerli bir gerçek e-posta adresi girin.', 'error');
    }
    return false;
  }

  // 2. Minimum character check
  if (subjectVal.length < 5 || descVal.length < 15) {
    showFormAlert(currentLang === 'en' ? 'Please enter a subject of at least 5 chars and description of 15 chars.' : 'Lütfen en az 5 karakterlik konu ve 15 karakterlik açıklama yazın.', 'error');
    return false;
  }

  // 3. CAPTCHA Verification Code Check
  if (!userCaptchaVal || userCaptchaVal.toUpperCase() !== window.currentCaptchaCode.toUpperCase()) {
    showFormAlert(currentLang === 'en' ? '❌ CAPTCHA verification code is incorrect! Please try again.' : '❌ Güvenlik doğrulaması (CAPTCHA) kodu hatalı! Lütfen kodu tekrar girin.', 'error');
    if (window.generateVisualCaptcha) window.generateVisualCaptcha();
    if (fbCaptcha) fbCaptcha.value = '';
    return false;
  }

  // 4. 24-Hour Limit Check (Max 3 submissions per 24h)
  const historyStr = localStorage.getItem('invis_feedback_history') || '[]';
  let history = [];
  try { history = JSON.parse(historyStr); } catch { history = []; }
  const now = Date.now();
  history = history.filter((ts) => now - ts < 86400000);

  if (history.length >= 3) {
    showFormAlert(currentLang === 'en' ? 'You have reached the limit of 3 feedback submissions per 24 hours. Please try again later.' : 'Son 24 saat içinde maksimum 3 geri bildirim gönderme hakkınızı doldurdunuz. Lütfen daha sonra tekrar deneyin.', 'error');
    return false;
  }

  // 5. UI Loading State
  if (submitFeedbackBtn) {
    submitFeedbackBtn.disabled = true;
    submitFeedbackBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${currentLang === 'en' ? 'Sending...' : 'Gönderiliyor...'}</span>`;
  }

  showFormAlert(currentLang === 'en' ? 'Sending your feedback to invislauncher@gmail.com...' : 'Geri bildiriminiz invislauncher@gmail.com adresine iletiliyor...', 'success');

  let sentSuccessfully = false;

  // Try API 1: Web3Forms API
  try {
    const res1 = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: 'a888c3a9-fb01-4475-9279-d1bf1e231e67',
        email: userEmailVal,
        replyto: userEmailVal,
        subject: `[INVIS Launcher Geri Bildirim] ${subjectVal}`,
        message: `Gönderen E-Posta: ${userEmailVal}\nKonu: ${subjectVal}\n\nDetaylar:\n${descVal}`
      })
    });
    if (res1.ok || res1.status === 200) sentSuccessfully = true;
  } catch (err) {
    console.warn('Web3Forms API submit error:', err);
  }

  // Try API 2: FormSubmit API (if API 1 fails)
  if (!sentSuccessfully) {
    try {
      const res2 = await fetch('https://formsubmit.co/ajax/invislauncher@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _replyto: userEmailVal,
          _captcha: 'false',
          _url: window.location.href,
          name: 'INVIS Launcher User',
          subject: `[INVIS Launcher Geri Bildirim] ${subjectVal}`,
          message: `Gönderen E-Posta: ${userEmailVal}\nKonu: ${subjectVal}\n\nDetaylar:\n${descVal}`
        })
      });
      if (res2.ok || res2.status === 200) sentSuccessfully = true;
    } catch (err) {
      console.warn('FormSubmit API submit error:', err);
    }
  }

  // Final Response & Handling
  if (sentSuccessfully) {
    history.push(now);
    localStorage.setItem('invis_feedback_history', JSON.stringify(history));

    showFormAlert(currentLang === 'en' ? '✅ Your feedback has been successfully sent to invislauncher@gmail.com! Thank you.' : '✅ Geri bildiriminiz başarıyla invislauncher@gmail.com adresine iletildi! Teşekkür ederiz.', 'success');
    const form = document.getElementById('feedbackForm');
    if (form) form.reset();
    if (subjectCount) subjectCount.textContent = '0/80';
    if (descCount) descCount.textContent = '0/1000';
    const badge = document.getElementById('emailVerifyBadge');
    if (badge) badge.style.display = 'none';
  } else {
    // Fallback: Mailto link trigger
    openMailtoFallback(userEmailVal, subjectVal, descVal);
  }

  if (submitFeedbackBtn) {
    submitFeedbackBtn.disabled = false;
    submitFeedbackBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> <span>${currentLang === 'en' ? 'Send Feedback' : 'Geri Bildirimi Gönder'}</span>`;
  }
  if (window.generateVisualCaptcha) window.generateVisualCaptcha();

  return false;
};

function openMailtoFallback(userEmailVal, subjectVal, descVal) {
  showFormAlert('⚠️ E-posta istemciniz hazırlanıyor...', 'success');
  const mailUrl = `mailto:invislauncher@gmail.com?subject=${encodeURIComponent('[INVIS Geri Bildirim] ' + subjectVal)}&body=${encodeURIComponent('Gönderen: ' + userEmailVal + '\n\n' + descVal)}`;
  setTimeout(() => {
    window.location.href = mailUrl;
  }, 600);
}

function showFormAlert(msg, type) {
  const formAlert = document.getElementById('formAlert');
  if (!formAlert) return;
  formAlert.textContent = msg;
  formAlert.className = `form-alert ${type}`;
  formAlert.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', async () => {
  // 0. Bind Bundled Images Immediately to DOM
  function bindImages() {
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
  }

  bindImages();

  // 1. Initialize i18n
  await i18n.init();
  bindImages();

  // Initialize Visual CAPTCHA
  window.generateVisualCaptcha();

  // Real-Time Email Verification Listener
  const fbEmail = document.getElementById('fbEmail');
  const emailVerifyBadge = document.getElementById('emailVerifyBadge');

  if (fbEmail && emailVerifyBadge) {
    fbEmail.addEventListener('input', () => {
      const val = fbEmail.value.trim();
      if (!val) {
        emailVerifyBadge.style.display = 'none';
        return;
      }
      const res = validateRealEmail(val);
      if (res.valid) {
        emailVerifyBadge.className = 'email-verify-badge valid';
        emailVerifyBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${i18n.currentLang === 'en' ? 'Valid Real Email Format' : 'Geçerli Gerçek E-Posta Formatı'}</span>`;
      } else {
        emailVerifyBadge.className = 'email-verify-badge invalid';
        if (res.reason === 'disposable') {
          emailVerifyBadge.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> <span>${i18n.currentLang === 'en' ? 'Disposable / Temp-Mail Engelled!' : 'Geçici (Temp-Mail) E-Posta Engellendi!'}</span>`;
        } else {
          emailVerifyBadge.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> <span>${i18n.currentLang === 'en' ? 'Invalid Email Format' : 'Geçersiz E-Posta Formatı'}</span>`;
        }
      }
    });
  }

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    const langDropdown = document.getElementById('langDropdown');
    const langMenu = document.getElementById('langMenu');
    if (langDropdown && !langDropdown.contains(e.target) && langMenu) {
      langMenu.classList.remove('open');
    }
  });

  // 2. Reliable ScrollSpy Highlight on Navbar Links
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateScrollSpy() {
    if (window.scrollY > 40) {
      if (navbar) navbar.classList.add('scrolled');
    } else {
      if (navbar) navbar.classList.remove('scrolled');
    }

    const scrollPos = window.scrollY + 180;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateScrollSpy);
  updateScrollSpy();

  // 3. Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    { threshold: 0.08 }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // 4. Preview Tabs
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

  // Character Counter Badges
  const fbSubject = document.getElementById('fbSubject');
  const fbDesc = document.getElementById('fbDesc');
  const subjectCount = document.getElementById('subjectCount');
  const descCount = document.getElementById('descCount');

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

  // 10. Animated Canvas Particle Mesh Background
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
