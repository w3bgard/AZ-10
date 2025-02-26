// Track details route
app.get('/track/:trackId', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/src/pages/track-template.html'));
}); 