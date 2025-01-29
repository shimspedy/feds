const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const port = process.env.PORT || 3000;



app.use(express.static(path.join(__dirname, '../public')));

// Apply the middleware
// app.use(addCanonicalLinkTag);

app.get('/state/:state', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'state.html'));
});
app.get('/:leostate', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'leostate.html'));
});

app.get('/leopay/:state', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'leopay.html'));
});

app.get('/gs/:state/:grade', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'gs.html'));
});

app.get('/leo/:state/:grade', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'leo.html'));
});



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'states.html'));
});

app.get('/:states', (req, res) => {
    const state = decodeURIComponent(req.params.state);
    console.log('Serving state page for:', state);
    res.sendFile(path.join(__dirname, 'public', 'lawstate.html'));
});

app.get('/:tates/:city', (req, res) => {
    const state = decodeURIComponent(req.params.state);
    const city = decodeURIComponent(req.params.city);
    console.log('Serving city page for:', state, city);
    res.sendFile(path.join(__dirname, 'public', 'city.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
