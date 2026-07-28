/**
 * i18n Internationalization Engine for INVIS Launcher Website
 * Bundles JSON locales directly with zero runtime fetch dependencies!
 */
import trDict from '../public/locales/tr.json';
import enDict from '../public/locales/en.json';

export class I18nEngine {
  constructor() {
    this.currentLang = localStorage.getItem('invis_lang') || 'tr';
    this.translations = {
      tr: trDict,
      en: enDict
    };
  }

  async init() {
    this.applyTranslations();
    this.setupListeners();
  }

  loadLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('invis_lang', lang);
      this.applyTranslations();
      document.documentElement.lang = lang;

      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
  }

  applyTranslations() {
    const dict = this.translations[this.currentLang];
    if (!dict) return;

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = this.getNestedValue(dict, key);
      if (val !== undefined) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = val;
        } else {
          el.innerHTML = val;
        }
      }
    });

    const langBtns = document.querySelectorAll('.lang-opt');
    langBtns.forEach((btn) => {
      if (btn.getAttribute('data-lang') === this.currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const currentLabel = document.getElementById('currentLangLabel');
    if (currentLabel) {
      currentLabel.textContent = this.currentLang.toUpperCase();
    }
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((prev, curr) => (prev && prev[curr] !== undefined ? prev[curr] : undefined), obj);
  }

  setupListeners() {
    document.querySelectorAll('.lang-opt').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const selectedLang = e.currentTarget.getAttribute('data-lang');
        if (selectedLang && selectedLang !== this.currentLang) {
          this.loadLanguage(selectedLang);
        }
      });
    });
  }
}
