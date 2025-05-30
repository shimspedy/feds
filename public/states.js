/**
 * Legacy states.js - Now uses the modern page manager system
 * This file is maintained for backward compatibility
 */

// Import the new modular system
import { StatesListPage } from './js/page-manager.js';

// Initialize using the new system
document.addEventListener('DOMContentLoaded', async () => {
    const page = new StatesListPage();
    await page.init();
});
