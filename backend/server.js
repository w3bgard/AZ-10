const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// سرو فایل‌های استاتیک از پوشه frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// مسیریابی برای صفحه اصلی
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/index.html'));
});

// مسیریابی برای صفحه جزئیات ترک
app.get('/track/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/src/pages/track-template.html'));
});

// اجرای سرور
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 