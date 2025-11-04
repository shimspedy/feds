const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const port = process.env.PORT || 3001;

// SEO middleware - add security and SEO headers
app.use((req, res, next) => {
    // Security headers
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'DENY');
    res.set('X-XSS-Protection', '1; mode=block');
    
    // Cache control for static assets
    if (req.url.match(/\.(css|js|jpg|png|gif|ico)$/)) {
        res.set('Cache-Control', 'public, max-age=86400'); // 1 day
    } else {
        res.set('Cache-Control', 'public, max-age=3600'); // 1 hour for HTML
    }
    
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Handle trailing slashes for SEO (avoid duplicate content)
app.use((req, res, next) => {
    if (req.path.length > 1 && req.path.endsWith('/')) {
        const query = req.url.slice(req.path.length);
        res.redirect(301, req.path.slice(0, -1) + query);
        return;
    }
    next();
});

// GS (General Schedule) routes with descriptive URLs
app.get('/state/:state', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'state.html'));
});

app.get('/federal-gs-pay-scale/:state', (req, res) => {
    // SEO-friendly URL that redirects to the standard route
    res.redirect(301, `/state/${req.params.state}`);
});

app.get('/gs/:state/:grade', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'gs.html'));
});

// LEO (Law Enforcement Officer) routes
app.get('/leostate', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'leostate.html'));
});

app.get('/law-enforcement-pay', (req, res) => {
    // SEO-friendly URL that redirects to the standard route
    res.redirect(301, '/leostate');
});

app.get('/leopay/:state', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'leopay.html'));
});

app.get('/leo/:state/:grade', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'leo.html'));
});

// Wildland Firefighter (GW) routes
app.get('/wildlandstate', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'wildlandstate.html'));
});

app.get('/wildlandpay/:state', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'wildlandpay.html'));
});

app.get('/wildland/:state/:grade', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'wildland.html'));
});

// City routes
app.get('/:state/:city', (req, res) => {
    const state = decodeURIComponent(req.params.state);
    const city = decodeURIComponent(req.params.city);
    console.log('Serving city page for:', state, city);
    res.sendFile(path.join(__dirname, '../public', 'city.html'));
});

// Site Map and Related URLs
app.get('/sitemap', (req, res) => {
    res.redirect('/sitemap.xml');
});

// Handle error pages with specific response codes
app.get('/404', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Handle JS module imports for nested routes
app.get('/state/js/*', (req, res) => {
    const jsPath = req.path.replace('/state/js/', '/js/');
    res.sendFile(path.join(__dirname, '../public', jsPath));
});

app.get('/gs/*/js/*', (req, res) => {
    const jsPath = req.path.split('/js/')[1];
    res.sendFile(path.join(__dirname, '../public', 'js', jsPath));
});

app.get('/leo/*/js/*', (req, res) => {
    const jsPath = req.path.split('/js/')[1];
    res.sendFile(path.join(__dirname, '../public', 'js', jsPath));
});

app.get('/leopay/*/js/*', (req, res) => {
    const jsPath = req.path.split('/js/')[1];
    res.sendFile(path.join(__dirname, '../public', 'js', jsPath));
});

// Catch-all handler for undefined routes
app.use((req, res) => {
    console.log(`404 error for: ${req.originalUrl}`);
    res.status(404).redirect('/404');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
