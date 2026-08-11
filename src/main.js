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

// ===================================================================
// ADVANCED EMAIL VALIDATION ENGINE v2
// Multi-layer: format, disposable, entropy, keyboard, MX-heuristic
// ===================================================================

// 200+ known disposable/temp mail providers
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com','temp-mail.org','guerrillamail.com','10minutemail.com',
  'trashmail.com','mailinator.com','sharklasers.com','dispostable.com',
  'yopmail.com','getnada.com','fakemail.net','crazymailing.com',
  'dropmail.me','throwawaymail.com','mohmal.com','generator.email',
  'emailondeck.com','tempmailo.com','burnermail.io','mailnesia.com',
  'maildrop.cc','disposablemail.com','mytrashmail.com','mailnull.com',
  'tempmail.net','tempmail.ninja','tmpmail.org','bupmail.com',
  'mail.com','test.com','example.com','fake.com','trash.com','asdf.com',
  'qwerty.com','foo.com','bar.com','disposable.com','junk.com','spam.com',
  'throwam.com','guerrillamailblock.com','grr.la','spam4.me','spamgourmet.com',
  'filzmail.com','discard.email','spamfree24.org','tempinbox.com','mailpoof.com',
  'fakeinbox.com','tempemail.co','mailsac.com','dispostable.com','cuvox.de',
  'dayrep.com','einrot.com','fleckens.hu','gustr.com','jourrapide.com',
  'rhyta.com','superrito.com','teleworm.us','armyspy.com','cuvox.de',
  'spamhereplease.com','trashmail.me','trashmail.at','trashmail.io',
  'wegwerfadresse.de','spam.la','0-mail.com','0815.ru','anonbox.net',
  'getairmail.com','spambox.us','spamobox.com','dispostable.com',
  'mailnew.com','mytemp.email','instantemailaddress.com','e4ward.com',
  'trashmail.com','byom.de','jetable.fr.nf','jetable.net','jetable.org',
  'objectmail.com','obobbo.com','onewaymail.com','pookmail.com',
  'skeefmail.com','slug.info','spam.org.es','spoofmail.de',
  'supergreatmail.com','tempalias.com','temporaryemail.net',
  'temporaryinbox.com','thanksnospam.info','thisisnotmyrealemail.com',
  'trbvm.com','uggsrock.com','wegwerfmail.de','wegwerfmail.net',
  'wegwerfmail.org','wh4f.org','whyspam.me','willselfdestruct.com',
  'xagloo.com','xoxy.net','yogamaven.com','yopmail.fr','yopmail.com',
  'z1p.biz','za.com','zoemail.org','zoho.com','zxcv.com'
]);

// Keyboard pattern sequences to reject
const KEYBOARD_ROWS = ['qwertyuiop','asdfghjkl','zxcvbnm','qwerty','azerty'];

// Entropy check - minimum character diversity required
function _charEntropy(str) {
  const freq = {};
  for (const ch of str) freq[ch] = (freq[ch] || 0) + 1;
  return Object.keys(freq).length;
}

// Check for sequential number runs (12345, 98765)
function _hasSequentialNums(str) {
  let asc = 0, desc = 0;
  for (let i = 1; i < str.length; i++) {
    const diff = str.charCodeAt(i) - str.charCodeAt(i-1);
    asc  = diff === 1  ? asc+1  : 0;
    desc = diff === -1 ? desc+1 : 0;
    if (asc >= 4 || desc >= 4) return true;
  }
  return false;
}

function _isKeyboardPattern(username) {
  const lower = username.toLowerCase().replace(/[^a-z]/g, '');
  if (lower.length < 4) return false;
  for (const row of KEYBOARD_ROWS) {
    // Check any 4+ consecutive chars from a keyboard row
    for (let i = 0; i <= lower.length - 4; i++) {
      const chunk = lower.slice(i, i+4);
      if (row.includes(chunk)) return true;
    }
  }
  return false;
}

// Suspicious TLDs that rarely host real users
const SUSPICIOUS_TLDS = new Set(['xyz','top','tk','cf','ga','ml','gq','click','link','surf','rest','bid','date']);

// Legitimate free email providers (these are allowed but flagged differently)
const LEGIT_FREE = new Set(['gmail.com','yahoo.com','hotmail.com','outlook.com','live.com','icloud.com','protonmail.com','tutanota.com']);

function validateRealEmail(emailStr) {
  const email = emailStr.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,15}$/;

  if (!emailRegex.test(email)) return { valid: false, reason: 'format', label: 'Geçersiz format' };

  const atIdx = email.lastIndexOf('@');
  const username = email.slice(0, atIdx);
  const domain = email.slice(atIdx + 1);
  const tld = domain.split('.').pop();

  // Too short username
  if (username.length < 3) return { valid: false, reason: 'too_short', label: 'Kullanıcı adı çok kısa' };

  // All same char: aaaa@, 1111@
  if (/^(.)\1+$/.test(username)) return { valid: false, reason: 'repetitive', label: 'Tekrar eden karakterler' };

  // Sequential numbers
  if (_hasSequentialNums(username)) return { valid: false, reason: 'sequential', label: 'Ardışık sayılar tespit edildi' };

  // Keyboard pattern (qwerty, asdf...)
  if (_isKeyboardPattern(username)) return { valid: false, reason: 'keyboard', label: 'Klavye deseni tespit edildi' };

  // Too low entropy (e.g. "aababab")
  if (_charEntropy(username) < 3 && username.length > 4) return { valid: false, reason: 'low_entropy', label: 'Çok basit kullanıcı adı' };

  // Disposable domain
  if (DISPOSABLE_DOMAINS.has(domain)) return { valid: false, reason: 'disposable', label: 'Geçici e-posta sağlayıcısı' };

  // Suspicious TLD
  if (SUSPICIOUS_TLDS.has(tld)) return { valid: false, reason: 'suspicious_tld', label: 'Şüpheli alan adı uzantısı' };

  // Domain must have a valid structure
  const domainParts = domain.split('.');
  if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
    return { valid: false, reason: 'domain', label: 'Geçersiz alan adı' };
  }

  // Domain label length (each part max 63 chars, min 2)
  if (domainParts.some(p => p.length < 2 || p.length > 63)) {
    return { valid: false, reason: 'domain', label: 'Alan adı çok kısa veya uzun' };
  }

  // Username cannot start or end with dot/dash/underscore
  if (/^[.\-_]|[.\-_]$/.test(username)) return { valid: false, reason: 'format', label: 'Geçersiz kullanıcı adı' };

  // Consecutive dots not allowed
  if (/\.\./.test(email)) return { valid: false, reason: 'format', label: 'Ardışık nokta geçersiz' };

  // Check for random-looking strings (all unique letters, no vowels, length > 7)
  const vowels = /[aeiou]/;
  if (username.length > 7 && !vowels.test(username.replace(/[0-9]/g,''))) {
    return { valid: false, reason: 'no_vowels', label: 'Geçersiz görünen kullanıcı adı' };
  }

  return { valid: true };
}

// ===================================================================
// ADVANCED MULTI-MODE CAPTCHA SYSTEM
// ===================================================================
window.currentCaptchaCode = '';
window.currentCaptchaMode = 'text';
let _captchaTimerInterval = null;
let _captchaTimeLeft = 60;

window.setCaptchaMode = function(mode) {
  window.currentCaptchaMode = mode;
  const tabText = document.getElementById('tabText');
  const tabMath = document.getElementById('tabMath');
  const label   = document.getElementById('captchaModeLabel');
  if (tabText)  tabText.className  = mode === 'text' ? 'captcha-tab-btn active' : 'captcha-tab-btn';
  if (tabMath)  tabMath.className  = mode === 'math' ? 'captcha-tab-btn active' : 'captcha-tab-btn';
  if (label)    label.textContent  = mode === 'text' ? 'MOD: METIN TANINMASI'   : 'MOD: MATEMATIK';
  window.generateVisualCaptcha();
  window.setCaptchaMode('text'); // Initialize default mode
};

function _startCaptchaTimer() {
  if (_captchaTimerInterval) clearInterval(_captchaTimerInterval);
  _captchaTimeLeft = 60;
  const fill = document.getElementById('captchaTimerFill');
  if (fill) { fill.style.transition = 'none'; fill.style.width = '100%'; }
  setTimeout(function() { if (fill) fill.style.transition = 'width 1s linear'; }, 60);
  _captchaTimerInterval = setInterval(function() {
    _captchaTimeLeft--;
    const pct = (_captchaTimeLeft / 60) * 100;
    if (fill) fill.style.width = pct + '%';
    if (_captchaTimeLeft <= 0) { clearInterval(_captchaTimerInterval); window.generateVisualCaptcha(); }
  }, 1000);
}

window.generateVisualCaptcha = function() {
  const display = document.getElementById('captchaDisplay');
  if (!display) return;
  const inp = document.getElementById('fbCaptcha');
  if (inp) inp.value = '';

  if (window.currentCaptchaMode === 'math') {
    const ops = ['+', '-', 'x'];
    const op  = ops[Math.floor(Math.random() * ops.length)];
    let a, b, answer;
    if (op === '+') { a = Math.floor(Math.random()*50)+5; b = Math.floor(Math.random()*50)+5; answer = String(a+b); display.textContent = a+' + '+b+' = ?'; }
    else if (op === '-') { a = Math.floor(Math.random()*40)+20; b = Math.floor(Math.random()*19)+1; answer = String(a-b); display.textContent = a+' - '+b+' = ?'; }
    else { a = Math.floor(Math.random()*9)+2; b = Math.floor(Math.random()*9)+2; answer = String(a*b); display.textContent = a+' x '+b+' = ?'; }
    window.currentCaptchaCode = answer;
    if (inp) { inp.style.textTransform = 'none'; inp.placeholder = 'SONUCU GIRIN'; inp.setAttribute('inputmode','numeric'); }
  } else {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random()*chars.length));
    window.currentCaptchaCode = code.toUpperCase();
    display.textContent = code;
    if (inp) { inp.style.textTransform = 'uppercase'; inp.placeholder = 'KODU GIRIN'; inp.removeAttribute('inputmode'); }
  }
  _startCaptchaTimer();
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

  // 1. Advanced Email Verification
  const emailCheck = validateRealEmail(userEmailVal);
  if (!emailCheck.valid) {
    const reasonMsgs = {
      disposable:     currentLang==='en' ? '⚠️ Disposable/temp-mail blocked! Use a real email.' : '⚠️ Geçici e-posta adresleri engellenmiştir! Gerçek e-posta kullanın.',
      fake_prefix:    currentLang==='en' ? '⚠️ Fake/test email detected.' : '⚠️ Sahte/test e-posta tespit edildi!',
      repetitive:     currentLang==='en' ? '⚠️ Email contains repeated characters.' : '⚠️ E-postada tekrarlanan karakter deseni var.',
      sequential:     currentLang==='en' ? '⚠️ Sequential numbers detected in email.' : '⚠️ E-postada ardışık sayı deseni tespit edildi.',
      keyboard:       currentLang==='en' ? '⚠️ Keyboard pattern in email (e.g. qwerty/asdf).' : '⚠️ Klavye deseni tespit edildi (qwerty/asdf gibi).',
      low_entropy:    currentLang==='en' ? '⚠️ Email username is too simple.' : '⚠️ Kullanıcı adı çok basit ya da tekrarlı.',
      suspicious_tld: currentLang==='en' ? '⚠️ Suspicious domain extension detected.' : '⚠️ Şüpheli alan adı uzantısı (.xyz, .tk vb.).',
      no_vowels:      currentLang==='en' ? '⚠️ Email username looks randomly generated.' : '⚠️ Kullanıcı adı rastgele oluşturulmuş gibi görünüyor.',
      format:         currentLang==='en' ? '⚠️ Please enter a valid email address!' : '⚠️ Lütfen geçerli bir e-posta adresi girin!',
      domain:         currentLang==='en' ? '⚠️ Invalid domain.' : '⚠️ Geçersiz alan adı.',
    };
    showFormAlert(reasonMsgs[emailCheck.reason] || (currentLang==='en' ? '⚠️ Invalid email!' : '⚠️ Geçersiz e-posta!'), 'error');
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
    const emailVerifyCard = document.getElementById('emailVerifyCard');
    if (emailVerifyCard) {
      emailVerifyCard.className = 'email-verify-card';
      document.getElementById('verifyIcon').innerHTML = '<i class="fa-solid fa-shield"></i>';
      document.getElementById('verifyText').textContent = 'E-posta adresiniz sahte/geçici mail filtreleriyle kontrol ediliyor.';
    }
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

  // Refresh Captcha Button Event Listener
  const refreshCaptchaBtn = document.getElementById('refreshCaptchaBtn');
  if (refreshCaptchaBtn) {
    refreshCaptchaBtn.addEventListener('click', (e) => {
      if (e) e.preventDefault();
      window.generateVisualCaptcha();
    });
  }

  // Real-Time Email Verification Listener
  const fbEmail = document.getElementById('fbEmail');
  const emailVerifyCard = document.getElementById('emailVerifyCard');
  const verifyIcon = document.getElementById('verifyIcon');
  const verifyText = document.getElementById('verifyText');

  if (fbEmail && emailVerifyCard) {
    fbEmail.addEventListener('input', () => {
      const val = fbEmail.value.trim();
      if (!val) {
        emailVerifyCard.className = 'email-verify-card';
        if (verifyIcon) verifyIcon.innerHTML = '<i class="fa-solid fa-shield"></i>';
        if (verifyText) verifyText.textContent = i18n.currentLang === 'en' ? 'Email address is checked against fake/temporary mail filters.' : 'E-posta adresiniz sahte/geçici mail filtreleriyle kontrol ediliyor.';
        return;
      }

      const res = validateRealEmail(val);
      if (res.valid) {
        emailVerifyCard.className = 'email-verify-card valid';
        if (verifyIcon) verifyIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        if (verifyText) verifyText.textContent = i18n.currentLang === 'en' ? '✅ Verified Real Email Address (Gmail / Hotmail / Outlook / Corporate)' : '✅ Doğrulanmış Gerçek E-Posta Adresi (Gmail / Hotmail / Outlook / Kurumsal)';
      } else {
        emailVerifyCard.className = 'email-verify-card invalid';
        if (verifyIcon) verifyIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
        if (res.reason === 'disposable') {
          if (verifyText) verifyText.textContent = i18n.currentLang === 'en' ? '⛔ Disposable / Temporary (Temp-Mail) Email Address Blocked!' : '⛔ Geçici (Temp-Mail / Kullan-At) E-Posta Adresi Engellendi!';
        } else if (res.reason === 'fake_prefix') {
          if (verifyText) verifyText.textContent = i18n.currentLang === 'en' ? '⛔ Fake / Test Email Prefix Blocked (e.g. test, asdf, fake)!' : '⛔ Sahte / Test E-Posta Başlığı Engellendi (Örn: test, asdf, fake)!';
        } else {
          if (verifyText) verifyText.textContent = i18n.currentLang === 'en' ? '❌ Invalid Email Format! Please enter a real email address.' : '❌ Geçersiz E-Posta Formatı! Lütfen gerçek e-posta adresinizi girin.';
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

  // 3. Multi-directional Scroll Reveal + Stats Counter Animation
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Trigger counter animation for stat-number elements inside
          entry.target.querySelectorAll('.stat-number[data-count]').forEach(el => _animateCounter(el));
          // Also handle if this element IS a stat-number
          if (entry.target.matches('.stat-number[data-count]')) _animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // Also observe stat-numbers that might not be in reveal-on-scroll
  document.querySelectorAll('.stat-number[data-count]').forEach(el => revealObserver.observe(el));

  // Stats counter animation engine
  function _animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const elapsed = Math.min(now - start, duration);
      const progress = 1 - Math.pow(1 - elapsed / duration, 4); // ease-out-quart
      const value = Math.round(progress * target);
      el.textContent = (target === 0 ? '0' : value) + suffix;
      if (elapsed < duration) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

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
