const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
