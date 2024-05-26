const fs = require('fs');
const path = require('path');

// Define the base URL for your site
const baseUrl = 'https://fedspay.com';

// Load the GS data
const gsDataFilePath = path.join(__dirname, 'public', 'gs-data.json');
const gsData = JSON.parse(fs.readFileSync(gsDataFilePath, 'utf8'));

// Load the LEO data
const leoDataFilePath = path.join(__dirname, 'public', 'leo-data.json');
const leoData = JSON.parse(fs.readFileSync(leoDataFilePath, 'utf8'));

// Generate the sitemap
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add URLs for each state in GS data
for (const state in gsData) {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/state/${state}</loc>\n`;
    sitemap += `    <priority>0.8</priority>\n`;
    sitemap += `  </url>\n`;

    // Add URLs for each GS grade in the state
    for (const grade in gsData[state]) {
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${baseUrl}/gs/${state}/${encodeURIComponent(grade)}</loc>\n`;
        sitemap += `    <priority>0.6</priority>\n`;
        sitemap += `  </url>\n`;
    }
}

// Add URLs for each state in LEO data
for (const state in leoData) {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/leopay/${state}</loc>\n`;
    sitemap += `    <priority>0.8</priority>\n`;
    sitemap += `  </url>\n`;

    // Add URLs for each LEO grade in the state
    for (const grade in leoData[state]) {
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${baseUrl}/leo/${state}/${encodeURIComponent(grade)}</loc>\n`;
        sitemap += `    <priority>0.6</priority>\n`;
        sitemap += `  </url>\n`;
    }
}

sitemap += `</urlset>`;

// Save the sitemap to a file
const sitemapFilePath = path.join(__dirname, 'public', 'sitemap.xml');
fs.writeFileSync(sitemapFilePath, sitemap);

console.log('Sitemap generated successfully.');
