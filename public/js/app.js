/**
 * Main application entry point
 * Uses the new modular system for better maintainability
 */

// Import the page manager which will auto-initialize based on the current page
import { initializePage } from './page-manager.js';

/**
 * Load header and footer components
 */
async function loadComponents() {
    // Load header component
    const menuPlaceholder = document.getElementById('menu-placeholder');
    if (menuPlaceholder) {
        try {
            const menuResponse = await fetch('/menu.html');
            if (menuResponse.ok) {
                const menuHtml = await menuResponse.text();
                menuPlaceholder.innerHTML = menuHtml;
                
                // Initialize enhanced mobile navigation
                initializeEnhancedSidenav();
            }
        } catch (error) {
            console.error('Error loading header:', error);
        }
    }
    
    // Load footer component
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        try {
            const footerResponse = await fetch('/footer.html');
            if (footerResponse.ok) {
                const footerHtml = await footerResponse.text();
                footerPlaceholder.innerHTML = footerHtml;
            }
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }
}

/**
 * Enhanced Sidenav initialization with better UX
 */
function initializeEnhancedSidenav() {
    const sidenavElems = document.querySelectorAll('.sidenav');
    
    if (sidenavElems.length === 0) return;
    
    // Initialize Materialize sidenav if available
    if (window.M && window.M.Sidenav) {
        const instances = window.M.Sidenav.init(sidenavElems, {
            edge: 'left',
            draggable: true,
            preventScrolling: true,
            onOpenStart: () => {
                document.body.style.overflow = 'hidden';
                addSidenavOverlay();
            },
            onCloseStart: () => {
                document.body.style.overflow = '';
                removeSidenavOverlay();
            }
        });
        
        // Enhanced touch and click handling
        enhanceSidenavInteractions(instances[0]);
    } else {
        // Fallback for manual sidenav control
        initializeFallbackSidenav();
    }
    
    // Add active link highlighting
    highlightActiveNavLink();
}

/**
 * Enhanced sidenav interactions for better UX
 */
function enhanceSidenavInteractions(sidenavInstance) {
    const sidenav = document.querySelector('.sidenav');
    const trigger = document.querySelector('.sidenav-trigger');
    
    if (!sidenav || !trigger) return;
    
    // Add ripple effect to menu items
    const menuItems = sidenav.querySelectorAll('li a');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            createRippleEffect(e.target, e);
            // Close sidenav after clicking a link (except user-view)
            if (!item.closest('.user-view')) {
                setTimeout(() => {
                    if (sidenavInstance) {
                        sidenavInstance.close();
                    }
                }, 150);
            }
        });
    });
    
    // Add keyboard navigation
    sidenav.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            sidenavInstance.close();
        }
    });
    
    // Improve focus management
    trigger.addEventListener('click', () => {
        setTimeout(() => {
            const firstLink = sidenav.querySelector('li a:not(.user-view a)');
            if (firstLink) {
                firstLink.focus();
            }
        }, 300);
    });
}

/**
 * Fallback sidenav implementation for better compatibility
 */
function initializeFallbackSidenav() {
    const sidenav = document.querySelector('.sidenav');
    const trigger = document.querySelector('.sidenav-trigger');
    
    if (!sidenav || !trigger) return;
    
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSidenav();
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (sidenav.classList.contains('open') && 
            !sidenav.contains(e.target) && 
            !trigger.contains(e.target)) {
            closeSidenav();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidenav.classList.contains('open')) {
            closeSidenav();
        }
    });
}

function toggleSidenav() {
    const sidenav = document.querySelector('.sidenav');
    if (sidenav.classList.contains('open')) {
        closeSidenav();
    } else {
        openSidenav();
    }
}

function openSidenav() {
    const sidenav = document.querySelector('.sidenav');
    sidenav.classList.add('open');
    document.body.style.overflow = 'hidden';
    addSidenavOverlay();
}

function closeSidenav() {
    const sidenav = document.querySelector('.sidenav');
    sidenav.classList.remove('open');
    document.body.style.overflow = '';
    removeSidenavOverlay();
}

/**
 * Add overlay for better mobile UX
 */
function addSidenavOverlay() {
    let overlay = document.querySelector('.sidenav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidenav-overlay';
        overlay.addEventListener('click', closeSidenav);
        document.body.appendChild(overlay);
    }
    
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
}

function removeSidenavOverlay() {
    const overlay = document.querySelector('.sidenav-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
}

/**
 * Create ripple effect for menu items
 */
function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(0, 123, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
    
    // Add ripple animation CSS if not exists
    if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Highlight active navigation link
 */
function highlightActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        
        // Remove existing active class
        link.classList.remove('active');
        
        // Add active class to matching link
        if (linkPath === currentPath || 
            (currentPath === '/' && linkPath === '/') ||
            (currentPath.includes('/states') && linkPath.includes('/states')) ||
            (currentPath.includes('/leostate') && linkPath.includes('/leostate')) ||
            (currentPath.includes('/state/') && linkPath.includes('/state/')) ||
            (currentPath.includes('/leopay/') && linkPath.includes('/leopay/'))) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Load header and footer components first
    await loadComponents();
    
    // Then initialize the page-specific functionality
    initializePage();
});
