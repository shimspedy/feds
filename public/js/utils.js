/**
 * Shared utilities for the federal employee salary website
 * This module provides reusable functions for data handling, DOM manipulation, and SEO
 */

// Configuration and constants
export const CONFIG = {
    BASE_URL: 'https://fedspay.com',
    API_ENDPOINTS: {
        GS_DATA: '/gs-data.json',
        LEO_DATA: '/leo-data.json',
        STATE_PAGES: '/state_pages.json'
    },
    SELECTORS: {
        STATE_NAME: '#state-name',
        STATE_ABBR: '.state-abbr',
        STATE_TABLE: '#state-table',
        GS_TABLE: '#gs-table',
        LEO_TABLE: '#leo-table',
        CITY_TABLE: '#city-table',
        STATES_LIST: '#states-list',
        SEARCH_BAR: '#search-bar',
        MENU_PLACEHOLDER: '#menu-placeholder'
    },
    CSS_CLASSES: {
        STATE_ABBR: 'state-abbr',
        LOCALITY_CODE: 'locality-code',
        COLLECTION_ITEM: 'collection-item',
        STATE_CODE: 'state-code'
    }
};

// Centralized state mapping (consolidated from multiple files)
export const STATE_MAP = {
    "AL": "Albany-Schenectady, NY-MA",
    "AQ": "Albuquerque-Santa Fe-Las Vegas, NM",
    "ATL": "Atlanta-Athens-Clarke County-Sandy Springs, GA-AL",
    "AU": "Austin-Round Rock-Georgetown, TX",
    "BH": "Birmingham-Hoover-Talladega, AL",
    "BOS": "Boston-Worcester-Providence, MA-RI-NH-CT-ME-VT",
    "BU": "Buffalo-Cheektowaga-Olean, NY",
    "BN": "Burlington-South Burlington-Barre, VT",
    "CT": "Charlotte-Concord, NC-SC",
    "CHI": "Chicago-Naperville, IL-IN-WI",
    "CIN": "Cincinnati-Wilmington-Maysville, OH-KY-IN",
    "CLE": "Cleveland-Akron-Canton, OH-PA",
    "CS": "Colorado Springs, CO",
    "COL": "Columbus-Marion-Zanesville, OH",
    "CC": "Corpus Christi-Kingsville-Alice, TX",
    "DFW": "Dallas-Fort Worth, TX-OK",
    "DV": "Davenport-Moline, IA-IL",
    "DAY": "Dayton-Springfield-Kettering, OH",
    "DEN": "Denver-Aurora, CO",
    "DM": "Des Moines-Ames-West Des Moines, IA",
    "DET": "Detroit-Warren-Ann Arbor, MI",
    "FN": "Fresno-Madera-Hanford, CA",
    "HB": "Harrisburg-Lebanon, PA",
    "HAR": "Hartford-East Hartford, CT-MA",
    "HOU": "Houston-The Woodlands, TX",
    "HNT": "Huntsville-Decatur, AL-TN",
    "IND": "Indianapolis-Carmel-Muncie, IN",
    "KC": "Kansas City-Overland Park-Kansas City, MO-KS",
    "LR": "Laredo, TX",
    "LV": "Las Vegas-Henderson, NV-AZ",
    "LA": "Los Angeles-Long Beach, CA",
    "MFL": "Miami-Port St. Lucie-Fort Lauderdale, FL",
    "MIL": "Milwaukee-Racine-Waukesha, WI",
    "MSP": "Minneapolis-St. Paul, MN-WI",
    "NY": "New York-Newark, NY-NJ-CT-PA",
    "OM": "Omaha-Council Bluffs-Fremont, NE-IA",
    "PB": "Palm Bay-Melbourne-Titusville, FL",
    "PHL": "Philadelphia-Reading-Camden, PA-NJ-DE-MD",
    "PX": "Phoenix-Mesa, AZ",
    "PIT": "Pittsburgh-New Castle-Weirton, PA-OH-WV",
    "POR": "Portland-Vancouver-Salem, OR-WA",
    "RA": "Raleigh-Durham-Cary, NC",
    "RN": "Reno-Fernley, NV",
    "RCH": "Richmond, VA",
    "RT": "Rochester-Batavia-Seneca Falls, NY",
    "SAC": "Sacramento-Roseville, CA-NV",
    "SO": "San Antonio-New Braunfels-Pearsall, TX",
    "SD": "San Diego-Chula Vista-Carlsbad, CA",
    "SF": "San Jose-San Francisco-Oakland, CA",
    "SEA": "Seattle-Tacoma, WA",
    "SN": "Spokane-Spokane Valley-Coeur d'Alene, WA-ID",
    "SL": "St. Louis-St. Charles-Farmington, MO-IL",
    "TU": "Tucson-Nogales, AZ",
    "VB": "Virginia Beach-Norfolk, VA-NC",
    "DCB": "Washington-Baltimore-Arlington, DC-MD-VA-WV-PA",
    "RUS": "Rest of U.S.",
    "AK": "State of Alaska",
    "HI": "State of Hawaii"
};

/**
 * US State abbreviations to full state names mapping
 */
export const US_STATES_MAP = {
    "AL": "Alabama",
    "AK": "Alaska", 
    "AZ": "Arizona",
    "AR": "Arkansas",
    "AS": "American Samoa",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "FL": "Florida",
    "GA": "Georgia",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PA": "Pennsylvania",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
};

/**
 * Utility class for common operations
 */
export class Utils {
    /**
     * Parse URL path and extract relevant parameters
     * @param {string} pathname - Window location pathname
     * @returns {Object} Parsed path information
     */
    static parsePath(pathname = window.location.pathname) {
        const path = pathname.split('/').filter(Boolean);
        
        // Determine the state and grade based on the URL structure
        let state, grade, city;
        
        if (path.includes('state') && path.length >= 2) {
            // For /state/AU, state is the segment after 'state'
            const stateIndex = path.indexOf('state');
            state = path[stateIndex + 1];
            grade = null;
            city = path[path.length - 1];
        } else if (path.includes('gs') && path.length >= 3) {
            // For /gs/AU/GS1, state is path[1], grade is path[2]
            state = path[1];
            grade = path[2] ? decodeURIComponent(path[2]) : null;
            city = path[path.length - 1];
        } else if (path.includes('leo') && path.length >= 3) {
            // For /leo/AU/LEO4, state is path[1], grade is path[2]
            state = path[1];
            grade = path[2] ? decodeURIComponent(path[2]) : null;
            city = path[path.length - 1];
        } else if (path.includes('leopay')) {
            // For /leopay/AU, state is path[1]
            state = path[1];
            grade = null;
            city = path[path.length - 1];
        } else {
            // Default fallback for other routes
            state = path[path.length - 1];
            grade = null;
            city = path[path.length - 1];
        }
        
        return {
            segments: path,
            state: state,
            city: city,
            grade: grade,
            isGsPage: path.includes('gs'),
            isLeoPage: path.includes('leo'),
            isStatePage: path.includes('state'),
            isLeopayPage: path.includes('leopay')
        };
    }

    /**
     * Format currency for display
     * @param {number} amount - Amount to format
     * @returns {string} Formatted currency string
     */
    static formatCurrency(amount) {
        return amount.toLocaleString('en-US', { 
            style: 'currency', 
            currency: 'USD' 
        });
    }

    /**
     * Handle errors consistently across the application
     * @param {Error} error - Error object
     * @param {string} context - Context where error occurred
     * @param {HTMLElement} container - Container to show error message
     */
    static handleError(error, context = 'operation', container = null) {
        console.error(`Error during ${context}:`, error);
        
        if (container) {
            container.innerHTML = `
                <tr>
                    <td colspan="11" class="center-align">
                        <i class="material-icons">error</i>
                        <p>Unable to load data. Please try again later.</p>
                    </td>
                </tr>
            `;
        }
    }

    /**
     * Show loading state
     * @param {HTMLElement} container - Container to show loading state
     * @param {number} columns - Number of columns for loading row
     */
    static showLoading(container, columns = 11) {
        if (container) {
            container.innerHTML = `
                <tr>
                    <td colspan="${columns}" class="center-align">
                        <div class="preloader-wrapper small active">
                            <div class="spinner-layer spinner-blue-only">
                                <div class="circle-clipper left">
                                    <div class="circle"></div>
                                </div>
                                <div class="gap-patch">
                                    <div class="circle"></div>
                                </div>
                                <div class="circle-clipper right">
                                    <div class="circle"></div>
                                </div>
                            </div>
                        </div>
                        <p>Loading data...</p>
                    </td>
                </tr>
            `;
        }
    }

    /**
     * Debounce function for search functionality
     * @param {Function} func - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, delay = 300) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
}

/**
 * SEO utility class for managing page metadata
 */
export class SEOUtils {
    /**
     * Update page title
     * @param {string} title - New page title
     */
    static updateTitle(title) {
        document.title = title;
        
        // Update H1 if it exists
        const h1Element = document.querySelector('h1');
        if (h1Element && h1Element.id !== 'grade-state') {
            h1Element.textContent = title;
        }
    }

    /**
     * Update meta description
     * @param {string} description - New meta description
     */
    static updateMetaDescription(description) {
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = "description";
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = description;
    }

    /**
     * Update canonical URL
     * @param {string} url - Canonical URL
     */
    static updateCanonical(url) {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = "canonical";
            document.head.appendChild(canonical);
        }
        canonical.href = url;
    }

    /**
     * Generate structured data for salary tables
     * @param {Object} data - Table data
     * @param {string} type - Type of data ('gs' or 'leo')
     * @returns {Object} Structured data object
     */
    static generateStructuredData(data, type = 'gs') {
        const serviceType = type === 'gs' ? 'Federal Employee Compensation' : 'Law Enforcement Officer Compensation';
        const serviceName = type === 'gs' ? 'General Schedule Pay Scales' : 'Law Enforcement Officer Pay Scales';

        return {
            "@context": "https://schema.org",
            "@type": "Table",
            "about": {
                "@type": "GovernmentService",
                "name": serviceName,
                "serviceType": serviceType
            },
            "name": `2025 ${serviceName}`,
            "description": `Official 2025 ${serviceName.toLowerCase()} for federal employees`
        };
    }

    /**
     * Update structured data script
     * @param {Object} structuredData - Structured data object
     */
    static updateStructuredData(structuredData) {
        // Remove existing structured data
        const existingScript = document.querySelector('script[type="application/ld+json"]');
        if (existingScript) {
            existingScript.remove();
        }

        // Add new structured data
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }
}

/**
 * Data fetching utility class
 */
export class DataUtils {
    /**
     * Generic fetch wrapper with error handling
     * @param {string} url - URL to fetch
     * @returns {Promise} Fetch promise
     */
    static async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Failed to fetch data from ${url}:`, error);
            throw error;
        }
    }

    /**
     * Fetch GS data
     * @returns {Promise} GS data
     */
    static fetchGSData() {
        return this.fetchData(CONFIG.API_ENDPOINTS.GS_DATA);
    }

    /**
     * Fetch LEO data
     * @returns {Promise} LEO data
     */
    static fetchLEOData() {
        return this.fetchData(CONFIG.API_ENDPOINTS.LEO_DATA);
    }

    /**
     * Fetch state pages data
     * @returns {Promise} State pages data
     */
    static fetchStatePages() {
        return this.fetchData(CONFIG.API_ENDPOINTS.STATE_PAGES);
    }
}

/**
 * DOM manipulation utility class
 */
export class DOMUtils {
    /**
     * Replace state abbreviations with full names
     * @param {string} selector - CSS selector for elements to update
     */
    static replaceStateAbbreviations(selector = CONFIG.SELECTORS.STATE_ABBR) {
        const stateElements = document.querySelectorAll(selector);
        
        stateElements.forEach(element => {
            const abbr = element.textContent.trim();
            if (STATE_MAP[abbr]) {
                element.textContent = STATE_MAP[abbr];
            }
        });
    }

    /**
     * Create table row for salary data
     * @param {Object} data - Row data
     * @param {string} type - Type of data ('gs' or 'leo')
     * @returns {HTMLElement} Table row element
     */
    static createSalaryRow(data, type = 'gs') {
        const row = document.createElement('tr');
        
        if (type === 'gs') {
            row.innerHTML = `
                <td>Step ${data.step}</td>
                <td>${Utils.formatCurrency(data.hourly_salary)}</td>
                <td>${Utils.formatCurrency(data.overtime_salary)}</td>
                <td>${Utils.formatCurrency(data.annual_salary)}</td>
            `;
        } else if (type === 'leo') {
            row.innerHTML = `
                <td>Step ${data.step}</td>
                <td>${Utils.formatCurrency(data.hourly_salary)}</td>
                <td>${Utils.formatCurrency(data.overtime_salary)}</td>
                <td>${Utils.formatCurrency(data.annual_salary)}</td>
            `;
        }
        
        return row;
    }

    /**
     * Create grade row for state tables
     * @param {string} grade - Grade name
     * @param {Array} gradeData - Grade data array
     * @param {string} state - State abbreviation
     * @param {string} type - Type ('gs' or 'leo')
     * @returns {HTMLElement} Table row element
     */
    static createGradeRow(grade, gradeData, state, type = 'gs') {
        const row = document.createElement('tr');
        
        let rowHTML = `<td><a href="../${type}/${state}/${encodeURIComponent(grade)}">${grade}</a></td>`;
        
        gradeData.forEach(stepData => {
            rowHTML += `<td>${Utils.formatCurrency(stepData.annual_salary)}</td>`;
        });
        
        row.innerHTML = rowHTML;
        return row;
    }

    /**
     * Populate table with data
     * @param {HTMLElement} tableBody - Table body element
     * @param {Object} data - Data to populate
     * @param {string} type - Type of data ('gs' or 'leo')
     * @param {string} mode - Mode ('detail' for individual steps, 'overview' for grades)
     * @param {string} state - State abbreviation (for overview mode)
     */
    static populateTable(tableBody, data, type = 'gs', mode = 'detail', state = null) {
        if (!tableBody) return;

        // Clear existing content
        tableBody.innerHTML = '';

        if (!data || Object.keys(data).length === 0) {
            Utils.handleError(new Error('No data available'), 'data population', tableBody);
            return;
        }

        try {
            if (mode === 'detail' && Array.isArray(data)) {
                // Individual step details
                data.forEach(stepData => {
                    const row = DOMUtils.createSalaryRow(stepData, type);
                    tableBody.appendChild(row);
                });
            } else if (mode === 'overview' && state) {
                // Grade overview for a state
                for (const grade in data) {
                    const row = DOMUtils.createGradeRow(grade, data[grade], state, type);
                    tableBody.appendChild(row);
                }
            }
        } catch (error) {
            Utils.handleError(error, 'table population', tableBody);
        }
    }
}

/**
 * State list management utility
 */
export class StateListUtils {
    /**
     * Display states in a list or table format
     * @param {HTMLElement} container - Container element
     * @param {Array} states - Array of state codes
     * @param {string} baseUrl - Base URL for links
     * @param {string} linkType - Type of link ('state', 'leopay')
     */
    static displayStates(container, states, baseUrl = '/state', linkType = 'state') {
        if (!container) return;
        
        const isLiveRegion = container.getAttribute('role') === 'list';
        if (isLiveRegion) {
            container.setAttribute('aria-live', 'polite');
            container.setAttribute('aria-busy', 'true');
        }

        container.innerHTML = '';
        const isList = container.tagName === 'UL';
        const isTable = container.tagName === 'TABLE' || container.tagName === 'TBODY';
        
        states.forEach(state => {
            const fullName = US_STATES_MAP[state] || STATE_MAP[state] || state;
            const linkUrl = `${baseUrl}/${state}`;
            
            if (isList) {
                const listItem = document.createElement('li');
                listItem.classList.add(CONFIG.CSS_CLASSES.COLLECTION_ITEM);
                listItem.innerHTML = `
                    <a href="${linkUrl}" class="${CONFIG.CSS_CLASSES.STATE_ABBR}">${fullName}</a> 
                    <span class="${CONFIG.CSS_CLASSES.STATE_CODE}">(${state})</span>
                `;
                container.appendChild(listItem);
            } else if (isTable) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><a href="${linkUrl}" class="${CONFIG.CSS_CLASSES.STATE_ABBR}">${fullName}</a></td>
                    <td>${state}</td>
                `;
                container.appendChild(row);
            } else {
                // Handle DIV containers (like states-grid)
                const stateDiv = document.createElement('div');
                stateDiv.classList.add('state-item');
                stateDiv.setAttribute('role', 'listitem');
                stateDiv.innerHTML = `
                    <a href="${linkUrl}" class="state-card">
                        <div class="state-name">${fullName}</div>
                        <div class="state-code">${state}</div>
                    </a>
                `;
                container.appendChild(stateDiv);
            }
        });

        if (isLiveRegion) {
            container.setAttribute('aria-busy', 'false');
        }
    }

    /**
     * Filter states based on search term
     * @param {Array} states - Array of state codes
     * @param {string} searchTerm - Search term
     * @returns {Array} Filtered states
     */
    static filterStates(states, searchTerm) {
        if (!searchTerm) return states;
        
        const lowerSearchTerm = searchTerm.toLowerCase();
        return states.filter(state => {
            const fullName = STATE_MAP[state] || state;
            return fullName.toLowerCase().includes(lowerSearchTerm) || 
                   state.toLowerCase().includes(lowerSearchTerm);
        });
    }

    /**
     * Setup search functionality
     * @param {HTMLElement} searchBar - Search input element
     * @param {HTMLElement} container - Container to display results
     * @param {Array} allStates - All available states
     * @param {string} baseUrl - Base URL for links
     * @param {string} linkType - Type of link
     */
    static setupSearch(searchBar, container, allStates, baseUrl = '/state', linkType = 'state') {
        if (!searchBar) return;

        const debouncedSearch = Utils.debounce((searchTerm) => {
            const filteredStates = StateListUtils.filterStates(allStates, searchTerm);
            StateListUtils.displayStates(container, filteredStates, baseUrl, linkType);
        });

        searchBar.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    }
}
