const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const port = process.env.PORT || 3000;

// Middleware to add canonical link tag
// function addCanonicalLinkTag(req, res, next) {
//     const originalSendFile = res.sendFile;
//     res.sendFile = function (filePath) {
//         fs.readFile(filePath, 'utf8', (err, data) => {
//             if (err) {
//                 return res.status(500).send('Server Error');
//             }

//             const canonicalUrl = `https://www.fedpay.com${req.originalUrl}`;
//             const canonicalLinkTag = `<link rel="canonical" href="${canonicalUrl}">`;

//             const modifiedHtml = data.replace('</head>', `${canonicalLinkTag}</head>`);
//             res.send(modifiedHtml);
//         });
//     };
//     next();
// }

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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
