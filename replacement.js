const fs = require('fs');
let content = fs.readFileSync('src/main.js', 'utf8');

// ---- 1. Replace CAPTCHA block (chars 2508-2969) ----
const captStart = content.indexOf('// Visual Anti-Bot Captcha Generator');
const captEnd   = content.indexOf('\n};', captStart) + 3; // includes the closing '};'

const newCaptcha = `// ===================================================================
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
};`;

content = content.slice(0, captStart) + newCaptcha + content.slice(captEnd);
fs.writeFileSync('src/main.js', content, 'utf8');
console.log('CAPTCHA block replaced successfully. New size:', content.length);
