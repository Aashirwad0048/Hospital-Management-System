const express = require('express');
const app = express();
const PORT = 5001;

app.get('/test', (req, res) => {
    res.json({ message: 'Test server is working!', port: PORT });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🧪 Test server running on port ${PORT}`);
    console.log(`🌐 Test URL: http://localhost:${PORT}/test`);
});
