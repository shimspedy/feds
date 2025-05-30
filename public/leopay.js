/**
 * Legacy leopay.js - Now uses the modern page manager system
 * This file is maintained for backward compatibility
 */

// Import the new modular system
import { LeoPayPage } from './js/page-manager.js';

// Initialize using the new system
document.addEventListener('DOMContentLoaded', async () => {
    const page = new LeoPayPage();
    await page.init();
});
