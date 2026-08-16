const fs = require('fs');

// 1. Update index.html CAPTCHA section with clean SVG icons and bulletproof HTML structure
let html = fs.readFileSync('index.html', 'utf8');

const oldCaptchaHTML = `<div class="captcha-challenge-card">
                <div class="captcha-mode-badge" id="captchaModeLabel">MOD: METİN TANINMASI</div>
                <div class="captcha-type-tabs">
                  <button type="button" class="captcha-tab-btn active" id="tabText" onclick="window.setCaptchaMode('text')"><i class="fa-solid fa-font"></i> Metin</button>
                  <button type="button" class="captcha-tab-btn" id="tabMath" onclick="window.setCaptchaMode('math')"><i class="fa-solid fa-calculator"></i> Matematik</button>
                </div>
                <div class="captcha-display-area">
                  <div class="captcha-visual-code" id="captchaDisplay">K9P4X</div>
                  <button type="button" class="captcha-refresh-big" onclick="window.generateVisualCaptcha()" title="Yeni Kod Üret"><i class="fa-solid fa-rotate-right"></i></button>
                </div>
                <div class="captcha-answer-row">
                  <input type="text" id="fbCaptcha" class="captcha-answer-input" maxlength="8" placeholder="CEVABI GİRİN" required autocomplete="off" />
                </div>
                <div class="captcha-timer-bar"><div class="captcha-timer-fill" id="captchaTimerFill"></div></div>
              </div>`;

const newCaptchaHTML = `<div class="captcha-challenge-card">
                <div class="captcha-mode-badge" id="captchaModeLabel">MOD: METİN TANINMASI</div>
                <div class="captcha-type-tabs">
                  <button type="button" class="captcha-tab-btn active" id="tabText" onclick="window.setCaptchaMode('text')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
                    <span>Metin</span>
                  </button>
                  <button type="button" class="captcha-tab-btn" id="tabMath" onclick="window.setCaptchaMode('math')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="8" y1="14" x2="12" y2="14"></line><line x1="8" y1="18" x2="12" y2="18"></line><line x1="16" y1="14" x2="16" y2="18"></line><line x1="14" y1="16" x2="18" y2="16"></line></svg>
                    <span>Matematik</span>
                  </button>
                </div>
                <div class="captcha-display-area">
                  <div class="captcha-visual-code" id="captchaDisplay">K9P4X</div>
                  <button type="button" class="captcha-refresh-big" onclick="window.generateVisualCaptcha()" title="Yeni Kod Üret">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                  </button>
                </div>
                <div class="captcha-answer-row">
                  <input type="text" id="fbCaptcha" class="captcha-answer-input" maxlength="8" placeholder="CEVABI GİRİN" required autocomplete="off" />
                </div>
                <div class="captcha-timer-bar"><div class="captcha-timer-fill" id="captchaTimerFill"></div></div>
              </div>`;

if (html.includes('<div class="captcha-challenge-card">')) {
  html = html.replace(oldCaptchaHTML, newCaptchaHTML);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('✓ index.html captcha markup updated with inline SVGs');
} else {
  console.log('❌ Captcha markup in index.html not found');
}

// 2. Overhaul CAPTCHA CSS in src/style.css with strict browser resets
let css = fs.readFileSync('src/style.css', 'utf8');

const newCaptchaCSS = `
/* ==========================================================================
   ADVANCED CAPTCHA — STRICT RESET & HIGH-TECH GLOW UI
   ========================================================================== */
.captcha-challenge-card {
  background: rgba(7, 10, 18, 0.95);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: var(--radius-md);
  padding: 22px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
.captcha-challenge-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 2px;
  background: linear-gradient(90deg, var(--emerald-primary), var(--cyan-accent), var(--emerald-primary));
  background-size: 200%;
  animation: shimmerLine 2.5s linear infinite;
}
@keyframes shimmerLine {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.captcha-mode-badge {
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--text-muted);
  text-align: right;
  margin-bottom: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.captcha-type-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

button.captcha-tab-btn, button.captcha-refresh-big {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  font-family: var(--font-body);
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.captcha-tab-btn {
  padding: 8px 16px !important;
  border-radius: 8px !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  background: rgba(15, 23, 42, 0.8) !important;
  color: #94A3B8 !important;
  font-size: 0.85rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.captcha-tab-btn:hover {
  background: rgba(0, 255, 136, 0.1) !important;
  border-color: rgba(0, 255, 136, 0.4) !important;
  color: #00FF88 !important;
}

.captcha-tab-btn.active {
  background: rgba(0, 255, 136, 0.15) !important;
  border-color: #00FF88 !important;
  color: #00FF88 !important;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.25) !important;
}

.captcha-display-area {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.captcha-visual-code {
  flex: 1;
  background: rgba(5, 8, 16, 0.95) !important;
  border: 1px solid rgba(0, 255, 136, 0.3) !important;
  border-radius: 10px !important;
  padding: 12px 20px !important;
  font-family: 'Courier New', Consolas, monospace !important;
  font-size: 1.7rem !important;
  font-weight: 900 !important;
  letter-spacing: 10px !important;
  color: #00FF88 !important;
  text-shadow: 0 0 18px rgba(0, 255, 136, 0.8), 0 0 30px rgba(0, 255, 136, 0.4) !important;
  user-select: none;
  text-align: center;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 255, 136, 0.1) !important;
}

.captcha-refresh-big {
  width: 50px !important;
  height: 50px !important;
  border-radius: 10px !important;
  border: 1px solid rgba(0, 255, 136, 0.3) !important;
  background: rgba(0, 255, 136, 0.08) !important;
  color: #00FF88 !important;
  font-size: 1.1rem;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

.captcha-refresh-big:hover {
  background: #00FF88 !important;
  color: #05080E !important;
  transform: rotate(180deg) scale(1.08) !important;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.5) !important;
}

.captcha-answer-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.captcha-answer-input {
  flex: 1;
  background: rgba(10, 15, 26, 0.9) !important;
  border: 1px solid rgba(0, 255, 136, 0.3) !important;
  border-radius: 10px !important;
  color: #F1F5F9 !important;
  padding: 12px 16px !important;
  text-transform: uppercase;
  letter-spacing: 4px;
  font-weight: 800 !important;
  font-size: 1.05rem !important;
  text-align: center;
  outline: none !important;
  transition: all 0.25s ease !important;
}

.captcha-answer-input:focus {
  border-color: #00FF88 !important;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.3), inset 0 0 10px rgba(0, 255, 136, 0.05) !important;
}

.captcha-timer-bar {
  height: 3px;
  background: rgba(0, 255, 136, 0.15);
  border-radius: 3px;
  margin-top: 14px;
  overflow: hidden;
}

.captcha-timer-fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, var(--emerald-primary), var(--cyan-accent));
  border-radius: 3px;
  transition: width 1s linear;
}
`;

// Replace ADVANCED CAPTCHA section in style.css
const cssCaptStart = css.indexOf('/* ADVANCED CAPTCHA */');
if (cssCaptStart !== -1) {
  const cssCaptEnd = css.indexOf('/* EMAIL STRENGTH METER */', cssCaptStart);
  if (cssCaptEnd !== -1) {
    css = css.slice(0, cssCaptStart) + newCaptchaCSS + '\n' + css.slice(cssCaptEnd);
  } else {
    css = css.slice(0, cssCaptStart) + newCaptchaCSS;
  }
} else {
  css += '\n' + newCaptchaCSS;
}

fs.writeFileSync('src/style.css', css, 'utf8');
console.log('✓ src/style.css captcha styles updated with strict resets');
