// models/Appointment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    scheduledDate: { type: Date, required: true },
    scheduledTime: { type: String, required: true }, // e.g., "14:30"
    arrivalTime: { type: Date }, // When patient actually arrived
    status: { 
        type: String, 
        enum: ['scheduled', 'arrived', 'in_progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Virtual for arrival status
appointmentSchema.virtual('arrivalStatus').get(function() {
    if (!this.arrivalTime) return 'not_arrived';
    
    const scheduledDateTime = new Date(this.scheduledDate);
    const [hours, minutes] = this.scheduledTime.split(':');
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const arrivalDateTime = new Date(this.arrivalTime);
    const timeDifference = arrivalDateTime - scheduledDateTime;
    
    // If arrived within 15 minutes of scheduled time, consider on time
    if (timeDifference <= 15 * 60 * 1000) {
        return 'on_time';
    } else {
        return 'late';
    }
});

// Ensure virtuals are serialized
appointmentSchema.set('toJSON', { virtuals: true });
appointmentSchema.set('toObject', { virtuals: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;