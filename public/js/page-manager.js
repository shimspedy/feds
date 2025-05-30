/**
 * Page Manager for handling common page operations
 * This module provides a unified interface for managing different page types
 */

import { CONFIG, STATE_MAP, US_STATES_MAP, Utils, SEOUtils, DataUtils, DOMUtils, StateListUtils } from './utils.js';

/**
 * Base class for all page managers
 */
class BasePage {
    constructor() {
        this.pathInfo = Utils.parsePath();
        this.initialized = false;
    }

    /**
     * Initialize the page
     */
    async init() {
        if (this.initialized) return;
        
        try {
            await this.loadMenu();
            await this.setupPage();
            this.initialized = true;
        } catch (error) {
            Utils.handleError(error, 'page initialization');
        }
    }

    /**
     * Load menu component
     */
    async loadMenu() {
        const menuPlaceholder = document.querySelector(CONFIG.SELECTORS.MENU_PLACEHOLDER);
        if (menuPlaceholder) {
            try {
                const response = await fetch('/menu.html');
                const menuHTML = await response.text();
                menuPlaceholder.innerHTML = menuHTML;
                
                // Load menu script if not already loaded
                if (!window.menuLoaded) {
                    const script = document.createElement('script');
                    script.src = '/menu.js';
                    document.head.appendChild(script);
                    window.menuLoaded = true;
                }
            } catch (error) {
                console.warn('Could not load menu:', error);
            }
        }
    }

    /**
     * Setup page-specific functionality - to be overridden by subclasses
     */
    async setupPage() {
        throw new Error('setupPage method must be implemented by subclass');
    }

    /**
     * Update page SEO elements
     * @param {string} title - Page title
     * @param {string} description - Meta description
     * @param {string} canonicalUrl - Canonical URL
     */
    updateSEO(title, description, canonicalUrl) {
        SEOUtils.updateTitle(title);
        SEOUtils.updateMetaDescription(description);
        if (canonicalUrl) {
            SEOUtils.updateCanonical(canonicalUrl);
        }
    }
}

/**
 * State page manager for displaying GS grades by state
 */
export class StatePage extends BasePage {
    async setupPage() {
        const { state } = this.pathInfo;
        const stateNameElement = document.querySelector(CONFIG.SELECTORS.STATE_NAME);
        const tableBody = document.querySelector(`${CONFIG.SELECTORS.STATE_TABLE} tbody`);

        if (stateNameElement) {
            stateNameElement.classList.add(CONFIG.CSS_CLASSES.STATE_ABBR);
            stateNameElement.textContent = state;
        }

        // Show loading state
        Utils.showLoading(tableBody);

        try {
            const data = await DataUtils.fetchGSData();
            const stateData = data[state];

            if (stateData && tableBody) {
                DOMUtils.populateTable(tableBody, stateData, 'gs', 'overview', state);
            } else if (tableBody) {
                Utils.handleError(new Error('No data available for this state'), 'data fetch', tableBody);
            }

            // Update SEO and state names
            this.updateStateNames(state);
            this.updatePageSEO(state);

        } catch (error) {
            Utils.handleError(error, 'GS data fetch', tableBody);
        }
    }

    updateStateNames(state) {
        DOMUtils.replaceStateAbbreviations();
    }

    updatePageSEO(state) {
        const fullName = STATE_MAP[state] || state;
        const title = `Federal Employee Salaries in ${fullName}`;
        const description = `${title} - Detailed information on salaries, hourly rates, and overtime rates for federal employees.`;
        const canonicalUrl = `${CONFIG.BASE_URL}/state/${state}`;

        this.updateSEO(title, description, canonicalUrl);
        
        // Update structured data
        const structuredData = SEOUtils.generateStructuredData({}, 'gs');
        SEOUtils.updateStructuredData(structuredData);
    }
}

/**
 * LEO pay page manager for displaying LEO grades by state
 */
export class LeoPayPage extends BasePage {
    async setupPage() {
        const { state } = this.pathInfo;
        const stateNameElement = document.querySelector(CONFIG.SELECTORS.STATE_NAME);
        const tableBody = document.querySelector(`${CONFIG.SELECTORS.STATE_TABLE} tbody`);

        if (stateNameElement) {
            stateNameElement.classList.add(CONFIG.CSS_CLASSES.STATE_ABBR);
            stateNameElement.textContent = state;
        }

        // Show loading state
        Utils.showLoading(tableBody);

        try {
            const data = await DataUtils.fetchLEOData();
            const stateData = data[state];

            if (stateData && tableBody) {
                DOMUtils.populateTable(tableBody, stateData, 'leo', 'overview', state);
            } else if (tableBody) {
                Utils.handleError(new Error('No data available for this state'), 'data fetch', tableBody);
            }

            // Update SEO and state names
            this.updateStateNames(state);
            this.updatePageSEO(state);

        } catch (error) {
            Utils.handleError(error, 'LEO data fetch', tableBody);
        }
    }

    updateStateNames(state) {
        DOMUtils.replaceStateAbbreviations();
    }

    updatePageSEO(state) {
        const fullName = STATE_MAP[state] || state;
        const title = `Law Enforcement and Police Officer Salary Information in ${fullName}`;
        const description = `${title} - Detailed information on salaries, hourly rates, and overtime rates for Law Enforcement Officers and police officers. Learn how much cops make and explore comprehensive salary data.`;
        const canonicalUrl = `${CONFIG.BASE_URL}/leopay/${state}`;

        this.updateSEO(title, description, canonicalUrl);
        
        // Update structured data
        const structuredData = SEOUtils.generateStructuredData({}, 'leo');
        SEOUtils.updateStructuredData(structuredData);
    }
}

/**
 * GS detail page manager for individual grade details
 */
export class GSDetailPage extends BasePage {
    async setupPage() {
        const { state, grade } = this.pathInfo;
        
        const stateNameElement = document.querySelector(CONFIG.SELECTORS.STATE_NAME);
        const tableBody = document.querySelector(`${CONFIG.SELECTORS.GS_TABLE} tbody`);

        if (stateNameElement) {
            stateNameElement.classList.add(CONFIG.CSS_CLASSES.LOCALITY_CODE, CONFIG.CSS_CLASSES.STATE_ABBR);
            stateNameElement.textContent = state;
        }

        // Show loading state
        Utils.showLoading(tableBody, 4);

        try {
            const data = await DataUtils.fetchGSData();
            const cityData = data[state];

            if (cityData && cityData[grade] && tableBody) {
                const gradeData = cityData[grade];
                DOMUtils.populateTable(tableBody, gradeData, 'gs', 'detail');
            } else if (tableBody) {
                Utils.handleError(new Error(`No data available for ${grade} in ${state}`), 'data fetch', tableBody);
            }

            // Update SEO and state names
            this.updateStateNames();
            this.updatePageSEO(state, grade);

        } catch (error) {
            Utils.handleError(error, 'GS detail data fetch', tableBody);
        }
    }

    updateStateNames() {
        DOMUtils.replaceStateAbbreviations();
    }

    updatePageSEO(state, grade) {
        const fullName = STATE_MAP[state] || state;
        const title = `${grade} Federal Employee Salaries in ${fullName}`;
        const description = `${title} - Detailed information on salaries, hourly rates, and overtime rates for federal employees.`;
        const canonicalUrl = `${CONFIG.BASE_URL}/gs/${state}/${encodeURIComponent(grade)}`;

        this.updateSEO(title, description, canonicalUrl);
        
        // Update structured data
        const structuredData = SEOUtils.generateStructuredData({}, 'gs');
        SEOUtils.updateStructuredData(structuredData);
    }
}

/**
 * LEO detail page manager for individual grade details
 */
export class LEODetailPage extends BasePage {
    async setupPage() {
        const { state, grade } = this.pathInfo;
        
        const stateNameElement = document.querySelector(CONFIG.SELECTORS.STATE_NAME);
        const tableBody = document.querySelector(`${CONFIG.SELECTORS.LEO_TABLE} tbody`);

        if (stateNameElement) {
            stateNameElement.classList.add(CONFIG.CSS_CLASSES.STATE_ABBR);
            stateNameElement.textContent = state;
        }

        // Show loading state
        Utils.showLoading(tableBody, 4);

        try {
            const data = await DataUtils.fetchLEOData();
            const stateData = data[state];

            if (stateData && stateData[grade] && tableBody) {
                const gradeData = stateData[grade];
                DOMUtils.populateTable(tableBody, gradeData, 'leo', 'detail');
            } else if (tableBody) {
                Utils.handleError(new Error(`No data available for ${grade} in ${state}`), 'data fetch', tableBody);
            }

            // Update SEO and state names
            this.updateStateNames();
            this.updatePageSEO(state, grade);

        } catch (error) {
            Utils.handleError(error, 'LEO detail data fetch', tableBody);
        }
    }

    updateStateNames() {
        DOMUtils.replaceStateAbbreviations();
    }

    updatePageSEO(state, grade) {
        const fullName = STATE_MAP[state] || state;
        const title = `${grade} Law Enforcement and Police Officer Salary Information in ${fullName}`;
        const description = `${title} - Detailed information on salaries, hourly rates, and overtime rates for Law Enforcement Officers and police officers. Learn how much cops make and explore comprehensive salary data.`;
        const canonicalUrl = `${CONFIG.BASE_URL}/leo/${state}/${encodeURIComponent(grade)}`;

        this.updateSEO(title, description, canonicalUrl);
        
        // Update structured data
        const structuredData = SEOUtils.generateStructuredData({}, 'leo');
        SEOUtils.updateStructuredData(structuredData);
    }
}

/**
 * States list page manager
 */
export class StatesListPage extends BasePage {
    async setupPage() {
        const statesContainer = document.querySelector('#states-grid') || document.querySelector(CONFIG.SELECTORS.STATES_LIST);
        const searchBar = document.querySelector(CONFIG.SELECTORS.SEARCH_BAR);

        try {
            const data = await DataUtils.fetchGSData();
            const availableStates = Object.keys(data).filter(state => STATE_MAP[state]);

            if (statesContainer) {
                StateListUtils.displayStates(statesContainer, availableStates, '/state');
                
                // Setup search functionality
                StateListUtils.setupSearch(searchBar, statesContainer, availableStates, '/state');
            }

        } catch (error) {
            Utils.handleError(error, 'states list setup');
        }
    }
}

/**
 * LEO states list page manager
 */
export class LeoStatesListPage extends BasePage {
    async setupPage() {
        const statesList = document.querySelector(CONFIG.SELECTORS.STATES_LIST);
        const searchBar = document.querySelector(CONFIG.SELECTORS.SEARCH_BAR);

        // Remove loading indicator
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }

        try {
            const data = await DataUtils.fetchLEOData();
            const availableStates = Object.keys(data).filter(state => US_STATES_MAP[state]);

            if (statesList) {
                StateListUtils.displayStates(statesList, availableStates, '/leopay', 'leopay');
                
                // Setup search functionality
                StateListUtils.setupSearch(searchBar, statesList, availableStates, '/leopay', 'leopay');
            } else {
                // Add error row if container not found
                const tbody = document.querySelector('tbody');
                if (tbody) {
                    tbody.innerHTML = '<tr><td colspan="2">Error: Container not found</td></tr>';
                }
            }

        } catch (error) {
            // Add error row if data fetch fails
            if (statesList) {
                statesList.innerHTML = '<tr><td colspan="2">Error loading LEO states data</td></tr>';
            }
            Utils.handleError(error, 'LEO states list setup');
        }
    }
}

/**
 * City page manager
 */
export class CityPage extends BasePage {
    async setupPage() {
        const { state, city } = this.pathInfo;
        const cityNameElement = document.getElementById('city-name');
        const tableBody = document.querySelector(`${CONFIG.SELECTORS.CITY_TABLE} tbody`);

        if (cityNameElement) {
            cityNameElement.textContent = city;
        }

        try {
            const data = await DataUtils.fetchStatePages();
            const stateData = data.states[state];

            if (stateData && tableBody) {
                stateData.codes.forEach(code => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${code}</td>`;
                    tableBody.appendChild(row);
                });
            } else if (tableBody) {
                Utils.handleError(new Error(`No data available for state: ${state}`), 'data fetch', tableBody);
            }

        } catch (error) {
            Utils.handleError(error, 'city page setup', tableBody);
        }
    }
}

/**
 * Page factory for creating appropriate page managers
 */
export class PageFactory {
    /**
     * Create page manager based on current URL
     * @returns {BasePage} Appropriate page manager instance
     */
    static createPage() {
        const pathInfo = Utils.parsePath();
        const pathname = window.location.pathname;
        
        if (pathInfo.isGsPage && pathInfo.segments.length >= 3) {
            return new GSDetailPage();
        } else if (pathInfo.isLeoPage && pathInfo.segments.length >= 3) {
            return new LEODetailPage();
        } else if (pathInfo.isStatePage) {
            return new StatePage();
        } else if (pathInfo.isLeopayPage) {
            return new LeoPayPage();
        } else if (pathInfo.segments.some(segment => segment.includes('leostate')) || pathname.includes('leostate')) {
            return new LeoStatesListPage();
        } else if (pathInfo.segments.some(segment => segment.includes('states')) || pathname.includes('states')) {
            return new StatesListPage();
        } else if (pathInfo.segments.length >= 2) {
            return new CityPage();
        } else if (pathname === '/' || pathname === '/index.html') {
            // Home page - uses states list but with table format
            return new StatesListPage();
        }
        
        // Default fallback
        return new StatesListPage();
    }
}

/**
 * Auto-initialize page when DOM is loaded
 */
export function initializePage() {
    const initialize = async () => {
        try {
            const page = PageFactory.createPage();
            await page.init();
        } catch (error) {
            Utils.handleError(error, 'page auto-initialization');
        }
    };

    // If DOM is already loaded, initialize immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM is already loaded, initialize immediately
        initialize();
    }
}

// Auto-initialize if this module is loaded directly
if (typeof document !== 'undefined') {
    initializePage();
}
