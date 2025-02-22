/**
 * Language Management System
 * Version: 2.0.0
 * Handles language switching, RTL support, and translations
 */

class LanguageManager {
    constructor() {
        // Constants
        this.STORAGE_KEY = 'language';
        this.DEFAULT_LANG = 'fa';
        this.SUPPORTED_LANGUAGES = {
            fa: {
                name: 'فارسی',
                dir: 'rtl',
                code: 'fa-IR'
            },
            en: {
                name: 'English',
                dir: 'ltr',
                code: 'en-US'
            }
        };

        // DOM Elements
        this.html = document.documentElement;
        this.langToggle = document.getElementById('langToggle');

        // Translations object
        this.translations = {
            fa: {
                home: 'خانه',
                reviews: 'نقدها',
                artists: 'هنرمندان',
                charts: 'چارت‌ها',
                viewAll: 'مشاهده همه',
                mainReleases: 'انتشارات اصلی',
                mainReleasesSubtitle: 'آخرین آثار منتشر شده در جریان اصلی',
                newWave: 'انتشارات نیو ویو',
                newWaveSubtitle: 'آخرین آثار منتشر شده در جریان مستقل',
                community: 'محتوای انجمن',
                communitySubtitle: 'تازه‌ترین محتوای تولید شده توسط انجمن'
            },
            en: {
                home: 'Home',
                reviews: 'Reviews',
                artists: 'Artists',
                charts: 'Charts',
                viewAll: 'View All',
                mainReleases: 'Mainstream Releases',
                mainReleasesSubtitle: 'Rate and review the latest mainstream tracks',
                newWave: 'New Wave Releases',
                newWaveSubtitle: 'Discover the latest independent releases',
                community: 'Community Contents',
                communitySubtitle: 'Explore what\'s new in Persian HipHop culture'
            }
        };

        // Initialize
        this.init();
    }

    /**
     * Initialize language system
     */
    init() {
        // Load saved language or use default
        this.currentLang = this.loadSavedLanguage() || this.DEFAULT_LANG;
        
        // Apply initial language
        this.applyLanguage(this.currentLang);
        
        // Bind events
        this.bindEvents();
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Language toggle button
        if (this.langToggle) {
            this.langToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }

        // Handle form inputs
        document.addEventListener('input', (e) => {
            if (e.target.getAttribute('data-rtl-input')) {
                this.handleRTLInput(e.target);
            }
        });
    }

    /**
     * Toggle between supported languages
     */
    toggleLanguage() {
        const currentLangCode = this.currentLang;
        const langs = Object.keys(this.SUPPORTED_LANGUAGES);
        const currentIndex = langs.indexOf(currentLangCode);
        const nextIndex = (currentIndex + 1) % langs.length;
        const newLang = langs[nextIndex];

        this.applyLanguage(newLang, true);
    }

    /**
     * Apply specified language
     * @param {string} lang - Language code to apply
     * @param {boolean} [save=false] - Whether to save language preference
     */
    applyLanguage(lang, save = false) {
        // Validate language
        if (!this.SUPPORTED_LANGUAGES[lang]) {
            console.error(`Unsupported language: ${lang}`);
            return;
        }

        const langConfig = this.SUPPORTED_LANGUAGES[lang];

        // Update DOM
        this.html.setAttribute('lang', lang);
        this.html.setAttribute('dir', langConfig.dir);
        document.body.classList.toggle('rtl', langConfig.dir === 'rtl');
        
        // Update current language
        this.currentLang = lang;

        // Update translations
        this.updateTranslations(lang);
        
        // Update toggle button
        this.updateToggleButton(lang);
        
        // Update input directions
        this.updateInputDirections(langConfig.dir);

        // Save preference if requested
        if (save) {
            this.saveLanguage(lang);
        }

        // Dispatch language change event
        this.dispatchLanguageEvent(lang);
    }

    /**
     * Update translations across the application
     * @param {string} lang - Language code
     */
    updateTranslations(lang) {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[lang]?.[key]) {
                element.textContent = this.translations[lang][key];
            }
        });
    }

    /**
     * Update language toggle button state
     * @param {string} lang - Current language code
     */
    updateToggleButton(lang) {
        if (!this.langToggle) return;

        const text = this.langToggle.querySelector('.button-text');
        if (text) {
            text.textContent = lang.toUpperCase();
        }

        this.langToggle.setAttribute('aria-label', `Switch to ${
            lang === 'fa' ? 'English' : 'فارسی'
        }`);
    }

    /**
     * Handle RTL input fields
     * @param {HTMLElement} input - Input element
     */
    handleRTLInput(input) {
        const text = input.value;
        const hasRTL = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(text);
        input.dir = hasRTL ? 'rtl' : 'ltr';
    }

    /**
     * Update direction for all inputs
     * @param {string} dir - Direction ('rtl' or 'ltr')
     */
    updateInputDirections(dir) {
        document.querySelectorAll('input[type="text"], textarea').forEach(input => {
            if (!input.getAttribute('data-rtl-input')) {
                input.dir = dir;
            }
        });
    }

    /**
     * Load saved language from localStorage
     * @returns {string|null} Saved language code or null
     */
    loadSavedLanguage() {
        return localStorage.getItem(this.STORAGE_KEY);
    }

    /**
     * Save language preference to localStorage
     * @param {string} lang - Language code to save
     */
    saveLanguage(lang) {
        localStorage.setItem(this.STORAGE_KEY, lang);
    }

    /**
     * Dispatch custom language change event
     * @param {string} lang - New language code
     */
    dispatchLanguageEvent(lang) {
        const event = new CustomEvent('languagechange', {
            detail: { 
                lang,
                config: this.SUPPORTED_LANGUAGES[lang]
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Add new translations
     * @param {string} lang - Language code
     * @param {Object} translations - Translation key-value pairs
     */
    addTranslations(lang, translations) {
        if (!this.translations[lang]) {
            this.translations[lang] = {};
        }
        Object.assign(this.translations[lang], translations);

        // Update translations if this is current language
        if (this.currentLang === lang) {
            this.updateTranslations(lang);
        }
    }

    /**
     * Check if text contains RTL characters
     * @param {string} text - Text to check
     * @returns {boolean} True if text contains RTL characters
     */
    hasRTLCharacters(text) {
        const rtlRegex = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;
        return rtlRegex.test(text);
    }

    /**
     * Get text direction based on content
     * @param {string} text - Text to analyze
     * @returns {string} 'rtl' or 'ltr'
     */
    getTextDirection(text) {
        return this.hasRTLCharacters(text) ? 'rtl' : 'ltr';
    }

    /**
     * Format number according to language
     * @param {number} num - Number to format
     * @param {string} [lang] - Language code (defaults to current)
     * @returns {string} Formatted number
     */
    formatNumber(num, lang = this.currentLang) {
        const formatter = new Intl.NumberFormat(this.SUPPORTED_LANGUAGES[lang].code);
        return formatter.format(num);
    }

    /**
     * Format date according to language
     * @param {Date|string|number} date - Date to format
     * @param {Object} options - Intl.DateTimeFormat options
     * @param {string} [lang] - Language code (defaults to current)
     * @returns {string} Formatted date
     */
    formatDate(date, options = {}, lang = this.currentLang) {
        const formatter = new Intl.DateTimeFormat(
            this.SUPPORTED_LANGUAGES[lang].code,
            options
        );
        return formatter.format(new Date(date));
    }

    /**
     * Handle dynamic content loading
     * @param {HTMLElement} container - Container with new content
     */
    handleDynamicContent(container) {
        // Update translations in new content
        const elements = container.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[this.currentLang]?.[key]) {
                element.textContent = this.translations[this.currentLang][key];
            }
        });

        // Handle RTL inputs in new content
        const inputs = container.querySelectorAll('input[type="text"], textarea');
        inputs.forEach(input => {
            if (input.getAttribute('data-rtl-input')) {
                this.handleRTLInput(input);
            } else {
                input.dir = this.SUPPORTED_LANGUAGES[this.currentLang].dir;
            }
        });
    }

    /**
     * Get current language direction
     * @returns {string} Current direction ('rtl' or 'ltr')
     */
    getCurrentDirection() {
        return this.SUPPORTED_LANGUAGES[this.currentLang].dir;
    }

    /**
     * Check if current language is RTL
     * @returns {boolean} True if current language is RTL
     */
    isRTL() {
        return this.getCurrentDirection() === 'rtl';
    }

    /**
     * Clean up event listeners
     */
    destroy() {
        if (this.langToggle) {
            this.langToggle.removeEventListener('click');
        }
        document.removeEventListener('input');
    }
}

// Initialize language manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
    
    // Listen for dynamic content changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        window.languageManager.handleDynamicContent(node);
                    }
                });
            }
        });
    });

    // Observe DOM changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});