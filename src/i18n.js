/**
 * i18n Internationalization Engine for INVIS Launcher Website
 * Supports EN (English) and TR (Türkçe)
 */

export class I18nEngine {
  constructor() {
    this.currentLang = localStorage.getItem('invis_lang') || 'tr'; // Default to Turkish or user preference
    this.translations = {};
  }

  async init() {
    await this.loadLanguage(this.currentLang);
    this.setupListeners();
  }

  async loadLanguage(lang) {
    try {
      const response = await fetch(`/locales/${lang}.json`);
      if (!response.ok) throw new Error(`Failed to load locale: ${lang}`);
      this.translations[lang] = await response.json();
      this.currentLang = lang;
      localStorage.setItem('invis_lang', lang);
      this.applyTranslations();
      document.documentElement.lang = lang;

      // Dispatch custom event for UI updates
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    } catch (err) {
      console.error('i18n loading error:', err);
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

    // Update active state in language selector UI
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
