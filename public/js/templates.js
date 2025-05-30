/**
 * HTML Template system for reusable components
 * Provides template functions for generating consistent HTML structures
 */

import { CONFIG } from './utils.js';

/**
 * Template utility class for generating HTML components
 */
export class TemplateUtils {
    /**
     * Generate common head section with SEO optimization
     * @param {Object} options - Template options
     * @returns {string} HTML head section
     */
    static generateHead(options = {}) {
        const {
            title = 'Federal Employee Salary Information',
            description = 'Comprehensive federal employee salary data including GS grades and LEO pay scales.',
            keywords = 'Federal Employee Salaries, GS Grades, LEO Pay, Government Salaries',
            canonicalUrl = '',
            type = 'gs', // 'gs' or 'leo'
            structuredData = null
        } = options;

        const serviceName = type === 'gs' ? 'General Schedule Pay Scales' : 'Law Enforcement Officer Pay Scales';
        const defaultStructuredData = {
            "@context": "https://schema.org",
            "@type": "Table",
            "about": {
                "@type": "GovernmentService",
                "name": serviceName,
                "serviceType": type === 'gs' ? 'Federal Employee Compensation' : 'Law Enforcement Officer Compensation'
            },
            "name": `2025 ${serviceName}`
        };

        const finalStructuredData = structuredData || defaultStructuredData;

        return `
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <meta name="description" content="${description}">
            <meta name="keywords" content="${keywords}">
            ${canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}" />` : ''}
            <meta name="robots" content="index, follow">
            
            <!-- Open Graph / Facebook -->
            <meta property="og:type" content="website">
            <meta property="og:url" content="${canonicalUrl}">
            <meta property="og:title" content="${title}">
            <meta property="og:description" content="${description}">
            
            <!-- Twitter -->
            <meta property="twitter:card" content="summary_large_image">
            <meta property="twitter:url" content="${canonicalUrl}">
            <meta property="twitter:title" content="${title}">
            <meta property="twitter:description" content="${description}">
            
            <!-- Stylesheets -->
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
            <link rel="stylesheet" href="/styles.css">
            <link rel="icon" type="image/x-icon" href="/favicon.ico">
            
            <!-- Structured Data -->
            <script type="application/ld+json">
                ${JSON.stringify(finalStructuredData, null, 2)}
            </script>
        `;
    }

    /**
     * Generate salary table template
     * @param {Object} options - Table options
     * @returns {string} HTML table
     */
    static generateSalaryTable(options = {}) {
        const {
            id = 'salary-table',
            type = 'gs', // 'gs' or 'leo'
            mode = 'detail', // 'detail' or 'overview'
            showGrade = true
        } = options;

        let headers = '';
        
        if (mode === 'overview') {
            headers = `
                <th>Grade</th>
                <th>Step 1</th>
                <th>Step 2</th>
                <th>Step 3</th>
                <th>Step 4</th>
                <th>Step 5</th>
                <th>Step 6</th>
                <th>Step 7</th>
                <th>Step 8</th>
                <th>Step 9</th>
                <th>Step 10</th>
            `;
        } else {
            headers = `
                <th>Step</th>
                <th>Hourly ${type === 'gs' ? 'Salary' : 'Rate'}</th>
                <th>Overtime ${type === 'gs' ? 'Salary' : 'Rate'}</th>
                <th>Annual Salary</th>
            `;
        }

        return `
            <table class="highlight responsive-table" id="${id}">
                <thead>
                    <tr>
                        ${headers}
                    </tr>
                </thead>
                <tbody>
                    <!-- Dynamic content will be populated here -->
                </tbody>
            </table>
        `;
    }

    /**
     * Generate states list template
     * @param {Object} options - List options
     * @returns {string} HTML list structure
     */
    static generateStatesList(options = {}) {
        const {
            id = 'states-list',
            showSearch = true,
            listType = 'collection' // 'collection', 'table'
        } = options;

        const searchSection = showSearch ? `
            <div class="row">
                <div class="input-field col s12 m6 offset-m3">
                    <input type="text" id="search-bar" placeholder="Search states...">
                    <label for="search-bar">Search States</label>
                </div>
            </div>
        ` : '';

        if (listType === 'table') {
            return `
                ${searchSection}
                <table class="highlight responsive-table">
                    <thead>
                        <tr>
                            <th>State/Locality</th>
                            <th>Code</th>
                        </tr>
                    </thead>
                    <tbody id="${id}">
                        <!-- Dynamic content -->
                    </tbody>
                </table>
            `;
        }

        return `
            ${searchSection}
            <ul id="${id}" class="collection">
                <!-- Dynamic content -->
            </ul>
        `;
    }

    /**
     * Generate page footer template
     * @param {Object} options - Footer options
     * @returns {string} HTML footer
     */
    static generateFooter(options = {}) {
        const {
            lastUpdated = 'April 2025',
            payType = 'General Schedule'
        } = options;

        return `
            <footer class="page-footer">
                <div class="container">
                    <div class="row">
                        <div class="col s12 m6">
                            <p>Last Updated: ${lastUpdated} | Official 2025 ${payType} Pay Tables</p>
                        </div>
                        <div class="col s12 m6">
                            <p class="right-align">
                                <a href="/" class="white-text">Home</a> | 
                                <a href="/states" class="white-text">All States</a> | 
                                <a href="/leostate" class="white-text">LEO States</a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }

    /**
     * Generate loading spinner template
     * @param {Object} options - Loading options
     * @returns {string} HTML loading spinner
     */
    static generateLoadingSpinner(options = {}) {
        const {
            message = 'Loading data...',
            size = 'small' // 'small', 'medium', 'big'
        } = options;

        return `
            <div class="center-align">
                <div class="preloader-wrapper ${size} active">
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
                <p>${message}</p>
            </div>
        `;
    }

    /**
     * Generate error message template
     * @param {Object} options - Error options
     * @returns {string} HTML error message
     */
    static generateErrorMessage(options = {}) {
        const {
            message = 'Unable to load data. Please try again later.',
            showIcon = true,
            columns = 1
        } = options;

        const icon = showIcon ? '<i class="material-icons">error</i>' : '';
        
        if (columns > 1) {
            return `
                <tr>
                    <td colspan="${columns}" class="center-align">
                        ${icon}
                        <p>${message}</p>
                    </td>
                </tr>
            `;
        }

        return `
            <div class="center-align">
                ${icon}
                <p>${message}</p>
            </div>
        `;
    }

    /**
     * Generate breadcrumb navigation
     * @param {Array} breadcrumbs - Array of breadcrumb objects {text, url}
     * @returns {string} HTML breadcrumb navigation
     */
    static generateBreadcrumbs(breadcrumbs = []) {
        if (!breadcrumbs.length) return '';

        const items = breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            if (isLast) {
                return `<span class="breadcrumb">${item.text}</span>`;
            }
            return `<a href="${item.url}" class="breadcrumb">${item.text}</a>`;
        }).join('');

        return `
            <nav>
                <div class="nav-wrapper">
                    <div class="col s12">
                        ${items}
                    </div>
                </div>
            </nav>
        `;
    }

    /**
     * Generate complete page template
     * @param {Object} options - Page options
     * @returns {string} Complete HTML page
     */
    static generateCompletePage(options = {}) {
        const {
            headOptions = {},
            title = 'Federal Employee Salaries',
            content = '',
            footerOptions = {},
            scripts = [
                'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
                '/js/utils.js',
                '/js/page-manager.js'
            ],
            bodyClass = ''
        } = options;

        const scriptTags = scripts.map(src => `<script src="${src}"></script>`).join('\n    ');

        return `<!DOCTYPE html>
<html lang="en">
<head>
    ${this.generateHead(headOptions)}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
    <div id="menu-placeholder"></div>
    
    <div class="container">
        ${content}
    </div>
    
    ${this.generateFooter(footerOptions)}
    
    ${scriptTags}
</body>
</html>`;
    }
}

/**
 * Specific page templates for common page types
 */
export class PageTemplates {
    /**
     * Generate state salary page template
     * @param {Object} options - Page options
     * @returns {string} Complete HTML page
     */
    static generateStatePage(options = {}) {
        const {
            state = '',
            type = 'gs', // 'gs' or 'leo'
            canonicalUrl = ''
        } = options;

        const pageType = type === 'gs' ? 'Federal Employee' : 'Law Enforcement Officer';
        const title = `${pageType} Salaries in ${state}`;
        const description = `Detailed ${pageType.toLowerCase()} salary information for ${state}. View pay scales, hourly rates, and annual compensation.`;

        const content = `
            <h1 id="state-name" class="state-abbr center-align">${state}</h1>
            <h2 class="center-align">2025 ${pageType} Pay Scales</h2>
            
            <div class="row">
                <div class="col s12">
                    <p class="flow-text">
                        This table provides detailed information about ${pageType.toLowerCase()} compensation 
                        in this locality, including hourly rates, overtime rates, and annual salaries across all grades and steps.
                    </p>
                </div>
            </div>
            
            ${TemplateUtils.generateSalaryTable({ 
                id: type === 'gs' ? 'state-table' : 'state-table', 
                type: type, 
                mode: 'overview' 
            })}
        `;

        return TemplateUtils.generateCompletePage({
            headOptions: {
                title,
                description,
                canonicalUrl,
                type,
                keywords: `${pageType} Salaries, ${state}, Government Pay, Federal Employees, Pay Scales`
            },
            title,
            content,
            footerOptions: {
                payType: type === 'gs' ? 'General Schedule' : 'Law Enforcement Officer'
            }
        });
    }

    /**
     * Generate grade detail page template
     * @param {Object} options - Page options
     * @returns {string} Complete HTML page
     */
    static generateGradeDetailPage(options = {}) {
        const {
            state = '',
            grade = '',
            type = 'gs',
            canonicalUrl = ''
        } = options;

        const pageType = type === 'gs' ? 'Federal Employee' : 'Law Enforcement Officer';
        const title = `${grade} ${pageType} Salaries in ${state}`;
        const description = `Detailed ${grade} ${pageType.toLowerCase()} salary information for ${state}. View step-by-step pay progression with hourly and annual rates.`;

        const content = `
            <h1 id="state-name" class="state-abbr center-align">${state}</h1>
            <h2 id="grade-state" class="center-align">${grade} - 2025 ${pageType} Pay Scale</h2>
            
            <div class="row">
                <div class="col s12">
                    <p class="flow-text">
                        This table shows the detailed pay progression for ${grade} ${pageType.toLowerCase()}s 
                        in this locality, including hourly rates, overtime rates, and annual salaries for each step.
                    </p>
                </div>
            </div>
            
            ${TemplateUtils.generateSalaryTable({ 
                id: type === 'gs' ? 'gs-table' : 'leo-table', 
                type: type, 
                mode: 'detail' 
            })}
        `;

        return TemplateUtils.generateCompletePage({
            headOptions: {
                title,
                description,
                canonicalUrl,
                type,
                keywords: `${grade}, ${pageType} Salaries, ${state}, Government Pay, Step Progression, Pay Scale`
            },
            title,
            content,
            footerOptions: {
                payType: type === 'gs' ? 'General Schedule' : 'Law Enforcement Officer'
            }
        });
    }

    /**
     * Generate states list page template
     * @param {Object} options - Page options
     * @returns {string} Complete HTML page
     */
    static generateStatesListPage(options = {}) {
        const {
            type = 'gs',
            canonicalUrl = ''
        } = options;

        const pageType = type === 'gs' ? 'Federal Employee' : 'Law Enforcement Officer';
        const title = `${pageType} Salary Information by State`;
        const description = `Browse ${pageType.toLowerCase()} salary information by state and locality. Find comprehensive pay data for all available regions.`;

        const content = `
            <h1 class="center-align">${title}</h1>
            
            <div class="row">
                <div class="col s12">
                    <p class="flow-text center-align">
                        Select a state or locality to view detailed ${pageType.toLowerCase()} salary information, 
                        including pay scales for all grades and steps.
                    </p>
                </div>
            </div>
            
            ${TemplateUtils.generateStatesList({ 
                id: 'states-list',
                showSearch: true,
                listType: 'collection'
            })}
        `;

        return TemplateUtils.generateCompletePage({
            headOptions: {
                title,
                description,
                canonicalUrl,
                type,
                keywords: `${pageType} Salaries, States, Government Pay, Federal Employees, Locality Pay`
            },
            title,
            content,
            footerOptions: {
                payType: type === 'gs' ? 'General Schedule' : 'Law Enforcement Officer'
            }
        });
    }
}
