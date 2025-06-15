const express = require('express');
const path = require('path');
const app = express();
const port = 3005;

// Statik dosyaları serve et
app.use(express.static(__dirname));

// Ana sayfa için route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Dietkem landing page http://localhost:${port} adresinde çalışıyor`);
}); 