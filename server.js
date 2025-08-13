const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in environment variables');
    console.log('📝 Please create a .env file with your MongoDB connection string');
    console.log('Example: MONGODB_URI=mongodb://localhost:27017/hms');
    process.exit(1);
}

console.log('🔗 Connecting to MongoDB...');
console.log('📍 MongoDB URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in logs

// Updated Mongoose connection with better error handling
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ MongoDB connected successfully');
        console.log('📊 Database:', conn.connection.name);
        return conn;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.log('💡 Please check your MongoDB connection string in .env file');
        console.log('⚠️  Server will continue without database connection for testing');
        return null;
    }
};

// Connect to MongoDB
connectDB();

// Add process error handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit the process for unhandled rejections in development
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Don't exit the process for uncaught exceptions in development
});

// Routes
app.use('/appointments', require('./routes/appointments'));
app.use('/patients', require('./routes/patients'));
app.use('/doctors', require('./routes/doctors'));

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ 
        message: 'HMS API is running',
        database: mongoose.connection.name || 'connecting...',
        status: mongoose.connection.readyState === 1 ? 'connected' : 'connecting',
        host: HOST,
        port: PORT
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        host: HOST,
        port: PORT
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handlers
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on ${HOST}:${PORT}`);
    console.log(`🌐 API URL: http://${HOST}:${PORT}`);
    console.log(`🏥 Health check: http://${HOST}:${PORT}/health`);
});

server.on('error', (error) => {
    console.error('❌ Server error:', error);
    if (error.code === 'EADDRINUSE') {
        console.log(`❌ Port ${PORT} is already in use. Please try a different port.`);
        process.exit(1);
    }
}); 