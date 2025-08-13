const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock data for testing
let mockDoctors = [
    {
        _id: '1',
        name: 'Dr. John Smith',
        specialization: 'Cardiology',
        experience: 10,
        attendance: {
            status: 'absent',
            todayStatus: 'absent',
            lastUpdated: new Date(),
            checkInTime: null,
            checkOutTime: null,
            notes: ''
        }
    },
    {
        _id: '2',
        name: 'Dr. Sarah Johnson',
        specialization: 'Pediatrics',
        experience: 8,
        attendance: {
            status: 'present',
            todayStatus: 'present',
            lastUpdated: new Date(),
            checkInTime: new Date(),
            checkOutTime: null,
            notes: 'On duty'
        }
    }
];

// Routes
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: 'mock',
        port: PORT
    });
});

app.get('/doctors', (req, res) => {
    console.log('📋 GET /doctors - Returning mock doctors');
    res.json(mockDoctors);
});

app.get('/doctors/attendance-summary', (req, res) => {
    const summary = {
        present: mockDoctors.filter(d => d.attendance.todayStatus === 'present').length,
        absent: mockDoctors.filter(d => d.attendance.todayStatus === 'absent').length,
        on_leave: mockDoctors.filter(d => d.attendance.todayStatus === 'on_leave').length,
        off_duty: mockDoctors.filter(d => d.attendance.todayStatus === 'off_duty').length,
        total: mockDoctors.length
    };
    console.log('📊 GET /doctors/attendance-summary - Returning summary:', summary);
    res.json(summary);
});

app.post('/doctors/attendance/:id', (req, res) => {
    try {
        console.log('🔔 POST /doctors/attendance/:id - Attendance update request');
        console.log('📝 Request body:', req.body);
        console.log('🆔 Doctor ID:', req.params.id);
        
        const { status, notes } = req.body;
        const validStatuses = ['present', 'absent', 'on_leave', 'off_duty'];
        
        if (!validStatuses.includes(status)) {
            console.log('❌ Invalid status:', status);
            return res.status(400).json({ 
                error: 'Invalid status', 
                message: 'Status must be one of: present, absent, on_leave, off_duty' 
            });
        }

        const doctorIndex = mockDoctors.findIndex(d => d._id === req.params.id);
        
        if (doctorIndex === -1) {
            console.log('❌ Doctor not found');
            return res.status(404).json({ 
                error: 'Doctor not found', 
                message: 'No doctor found with the provided ID' 
            });
        }

        const doctor = mockDoctors[doctorIndex];
        console.log('✅ Doctor found:', doctor.name);

        // Update attendance
        doctor.attendance.status = status;
        doctor.attendance.todayStatus = status;
        doctor.attendance.lastUpdated = new Date();
        doctor.attendance.notes = notes || '';

        if (status === 'present' && !doctor.attendance.checkInTime) {
            doctor.attendance.checkInTime = new Date();
        } else if (status !== 'present') {
            doctor.attendance.checkOutTime = new Date();
        }

        console.log('✅ Attendance updated successfully');
        console.log('📊 Updated attendance:', doctor.attendance);
        
        res.json(doctor);
    } catch (err) {
        console.error('❌ Error in attendance update:', err);
        res.status(500).json({ error: 'Failed to update attendance', message: err.message });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Mock server running on localhost:${PORT}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`👨‍⚕️ Doctors: http://localhost:${PORT}/doctors`);
});
