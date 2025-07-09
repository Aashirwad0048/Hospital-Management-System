// models/Doctor.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    // Attendance tracking fields
    attendance: {
        status: { 
            type: String, 
            enum: ['present', 'absent', 'on_leave', 'off_duty'], 
            default: 'absent' 
        },
        lastUpdated: { type: Date, default: Date.now },
        todayStatus: { 
            type: String, 
            enum: ['present', 'absent', 'on_leave', 'off_duty'], 
            default: 'absent' 
        },
        checkInTime: { type: Date },
        checkOutTime: { type: Date },
        notes: { type: String }
    },
    // Work schedule
    schedule: {
        workingDays: [{ 
            type: String, 
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        }],
        startTime: { type: String, default: '09:00' },
        endTime: { type: String, default: '17:00' }
    },
    // Contact information
    contact: {
        email: { type: String },
        phone: { type: String },
        emergencyContact: { type: String }
    },
    // Additional fields
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
doctorSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;