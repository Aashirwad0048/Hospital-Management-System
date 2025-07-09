// routes/doctors.js

const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Get all doctors
router.route('/').get(async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch doctors', message: err.message });
    }
});

// Get attendance summary (must come before /attendance/:status)
router.route('/attendance-summary').get(async (req, res) => {
    try {
        const summary = await Doctor.aggregate([
            {
                $group: {
                    _id: '$attendance.todayStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        const attendanceSummary = {
            present: 0,
            absent: 0,
            on_leave: 0,
            off_duty: 0,
            total: 0
        };

        summary.forEach(item => {
            attendanceSummary[item._id] = item.count;
            attendanceSummary.total += item.count;
        });

        res.json(attendanceSummary);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch attendance summary', message: err.message });
    }
});

// Update doctor attendance (must come before /attendance/:status)
router.route('/attendance/:id').post(async (req, res) => {
    try {
        console.log('🔔 Attendance update request received');
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

        console.log('🔍 Finding doctor with ID:', req.params.id);
        const doctor = await Doctor.findById(req.params.id);
        
        if (!doctor) {
            console.log('❌ Doctor not found');
            return res.status(404).json({ 
                error: 'Doctor not found', 
                message: 'No doctor found with the provided ID' 
            });
        }

        console.log('✅ Doctor found:', doctor.name);
        console.log('📊 Current attendance:', doctor.attendance);

        // Initialize attendance object if it doesn't exist
        if (!doctor.attendance) {
            console.log('🆕 Initializing attendance object');
            doctor.attendance = {
                status: 'absent',
                lastUpdated: new Date(),
                todayStatus: 'absent',
                checkInTime: null,
                checkOutTime: null,
                notes: ''
            };
        }

        // Update attendance
        doctor.attendance.status = status;
        doctor.attendance.todayStatus = status;
        doctor.attendance.lastUpdated = new Date();
        doctor.attendance.notes = notes || '';

        // Set check-in/check-out times
        if (status === 'present' && !doctor.attendance.checkInTime) {
            console.log('⏰ Setting check-in time');
            doctor.attendance.checkInTime = new Date();
        } else if (status !== 'present') {
            console.log('⏰ Setting check-out time');
            doctor.attendance.checkOutTime = new Date();
        }

        console.log('💾 Saving updated doctor');
        const updatedDoctor = await doctor.save();
        console.log('✅ Doctor saved successfully');
        console.log('📊 Updated attendance:', updatedDoctor.attendance);
        
        res.json(updatedDoctor);
    } catch (err) {
        console.error('❌ Error in attendance update:', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ 
                error: 'Invalid doctor ID', 
                message: 'Please provide a valid doctor ID' 
            });
        }
        res.status(400).json({ error: 'Failed to update attendance', message: err.message });
    }
});

// Get doctors by attendance status (must come after specific routes)
router.route('/attendance/:status').get(async (req, res) => {
    try {
        const { status } = req.params;
        const validStatuses = ['present', 'absent', 'on_leave', 'off_duty'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                error: 'Invalid status', 
                message: 'Status must be one of: present, absent, on_leave, off_duty' 
            });
        }

        const doctors = await Doctor.find({ 'attendance.todayStatus': status });
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch doctors by status', message: err.message });
    }
});

// Add new doctor
router.route('/add').post(async (req, res) => {
    try {
        const { 
            name, 
            specialization, 
            experience, 
            email, 
            phone, 
            emergencyContact,
            workingDays,
            startTime,
            endTime
        } = req.body;
        
        // Validate required fields
        if (!name || !specialization || !experience) {
            return res.status(400).json({ 
                error: 'Missing required fields', 
                message: 'name, specialization, and experience are required' 
            });
        }

        const newDoctor = new Doctor({ 
            name: name.trim(), 
            specialization: specialization.trim(), 
            experience: parseInt(experience),
            contact: {
                email: email?.trim(),
                phone: phone?.trim(),
                emergencyContact: emergencyContact?.trim()
            },
            schedule: {
                workingDays: workingDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                startTime: startTime || '09:00',
                endTime: endTime || '17:00'
            }
        });

        const savedDoctor = await newDoctor.save();
        res.status(201).json(savedDoctor);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create doctor', message: err.message });
    }
});

// Update doctor data
router.route('/update/:id').post(async (req, res) => {
    try {
        const { 
            name, 
            specialization, 
            experience, 
            email, 
            phone, 
            emergencyContact,
            workingDays,
            startTime,
            endTime
        } = req.body;
        
        // Validate required fields
        if (!name || !specialization || !experience) {
            return res.status(400).json({ 
                error: 'Missing required fields', 
                message: 'name, specialization, and experience are required' 
            });
        }

        const doctor = await Doctor.findById(req.params.id);
        
        if (!doctor) {
            return res.status(404).json({ 
                error: 'Doctor not found', 
                message: 'No doctor found with the provided ID' 
            });
        }

        doctor.name = name.trim();
        doctor.specialization = specialization.trim();
        doctor.experience = parseInt(experience);
        doctor.contact = {
            email: email?.trim(),
            phone: phone?.trim(),
            emergencyContact: emergencyContact?.trim()
        };
        doctor.schedule = {
            workingDays: workingDays || doctor.schedule.workingDays,
            startTime: startTime || doctor.schedule.startTime,
            endTime: endTime || doctor.schedule.endTime
        };

        const updatedDoctor = await doctor.save();
        res.json(updatedDoctor);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ 
                error: 'Invalid doctor ID', 
                message: 'Please provide a valid doctor ID' 
            });
        }
        res.status(400).json({ error: 'Failed to update doctor', message: err.message });
    }
});

// Bulk update attendance (for admin)
router.route('/bulk-attendance').post(async (req, res) => {
    try {
        const { updates } = req.body; // Array of { doctorId, status, notes }
        
        if (!Array.isArray(updates)) {
            return res.status(400).json({ 
                error: 'Invalid format', 
                message: 'Updates must be an array' 
            });
        }

        const results = [];
        
        for (const update of updates) {
            try {
                const { doctorId, status, notes } = update;
                const validStatuses = ['present', 'absent', 'on_leave', 'off_duty'];
                
                if (!validStatuses.includes(status)) {
                    results.push({ doctorId, success: false, error: 'Invalid status' });
                    continue;
                }

                const doctor = await Doctor.findById(doctorId);
                
                if (!doctor) {
                    results.push({ doctorId, success: false, error: 'Doctor not found' });
                    continue;
                }

                doctor.attendance.status = status;
                doctor.attendance.todayStatus = status;
                doctor.attendance.lastUpdated = new Date();
                doctor.attendance.notes = notes || '';

                if (status === 'present' && !doctor.attendance.checkInTime) {
                    doctor.attendance.checkInTime = new Date();
                } else if (status !== 'present') {
                    doctor.attendance.checkOutTime = new Date();
                }

                await doctor.save();
                results.push({ doctorId, success: true, doctor: doctor.name });
            } catch (error) {
                results.push({ doctorId: update.doctorId, success: false, error: error.message });
            }
        }

        res.json({ results });
    } catch (err) {
        res.status(400).json({ error: 'Failed to update bulk attendance', message: err.message });
    }
    });

// Delete doctor by ID
router.route('/delete/:id').delete(async (req, res) => {
    try {
        const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
        
        if (!deletedDoctor) {
            return res.status(404).json({ 
                error: 'Doctor not found', 
                message: 'No doctor found with the provided ID' 
            });
            }

        res.json({ message: 'Doctor deleted successfully' });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ 
                error: 'Invalid doctor ID', 
                message: 'Please provide a valid doctor ID' 
            });
        }
        res.status(500).json({ error: 'Failed to delete doctor', message: err.message });
    }
});

module.exports = router;