const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ 
        message: 'HMS API is running - Simple version',
        status: 'OK',
        port: PORT
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// Doctors endpoint (mock data for testing)
app.get('/doctors', (req, res) => {
    res.json([
        {
            _id: 'test123',
            name: 'Dr. Test',
            specialization: 'General Medicine',
            attendance: {
                todayStatus: 'present',
                lastUpdated: new Date()
            }
        }
    ]);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Simple server is running on localhost:${PORT}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
