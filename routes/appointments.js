// routes/appointments.js

const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Get all appointments with populated patient and doctor data
router.route('/').get(async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patient', 'name age gender phone')
            .populate('doctor', 'name specialization');
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch appointments', message: err.message });
    }
});

// Add new appointment
router.route('/add').post(async (req, res) => {
    try {
        const { patientId, doctorId, scheduledDate, scheduledTime, notes } = req.body;
        
        // Validate required fields
        if (!patientId || !doctorId || !scheduledDate || !scheduledTime) {
            return res.status(400).json({ 
                error: 'Missing required fields', 
                message: 'patientId, doctorId, scheduledDate, and scheduledTime are required' 
            });
        }

        // Validate date format
        const appointmentDate = new Date(scheduledDate);
        if (isNaN(appointmentDate.getTime())) {
            return res.status(400).json({ 
                error: 'Invalid date format', 
                message: 'Please provide a valid date' 
            });
        }

        // Validate time format (HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(scheduledTime)) {
            return res.status(400).json({ 
                error: 'Invalid time format', 
                message: 'Please provide time in HH:MM format (e.g., 14:30)' 
            });
        }

        // Check if patient and doctor exist
        const patient = await Patient.findById(patientId);
        const doctor = await Doctor.findById(doctorId);
        
        if (!patient) {
            return res.status(404).json({ 
                error: 'Patient not found', 
                message: 'No patient found with the provided ID' 
            });
        }
        
        if (!doctor) {
            return res.status(404).json({ 
                error: 'Doctor not found', 
                message: 'No doctor found with the provided ID' 
            });
        }

        const newAppointment = new Appointment({ 
            patient: patientId,
            doctor: doctorId,
            scheduledDate: appointmentDate,
            scheduledTime: scheduledTime,
            notes: notes || '',
            status: 'scheduled'
        });

        const savedAppointment = await newAppointment.save();
        
        // Populate the saved appointment with patient and doctor data
        const populatedAppointment = await Appointment.findById(savedAppointment._id)
            .populate('patient', 'name age gender phone')
            .populate('doctor', 'name specialization');
            
        res.status(201).json(populatedAppointment);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ 
                error: 'Invalid ID format', 
                message: 'Please provide valid patient and doctor IDs' 
            });
        }
        res.status(400).json({ error: 'Failed to create appointment', message: err.message });
    }
});

// Mark patient arrival
router.route('/arrival/:id').post(async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        
        if (!appointment) {
            return res.status(404).json({ 
                error: 'Appointment not found', 
                message: 'No appointment found with the provided ID' 
            });
        }

        // Mark arrival time
        appointment.arrivalTime = new Date();
        appointment.status = 'arrived';
        appointment.updatedAt = new Date();

        const updatedAppointment = await appointment.save();
        
        // Populate the updated appointment
        const populatedAppointment = await Appointment.findById(updatedAppointment._id)
            .populate('patient', 'name age gender phone')
            .populate('doctor', 'name specialization');
            
        res.json(populatedAppointment);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ 
                error: 'Invalid appointment ID', 
                message: 'Please provide a valid appointment ID' 
            });
        }
        res.status(400).json({ error: 'Failed to mark arrival', message: err.message });
    }
});

// Update appointment data
router.route('/update/:id').post(async (req, res) => {
    try {
        const { patientId, doctorId, scheduledDate, scheduledTime, status, notes } = req.body;
        
        const appointment = await Appointment.findById(req.params.id);
        
        if (!appointment) {
            return res.status(404).json({ 
                error: 'Appointment not found', 
                message: 'No appointment found with the provided ID' 
            });
        }

        // Update fields if provided
        if (patientId) appointment.patient = patientId;
        if (doctorId) appointment.doctor = doctorId;
        if (scheduledDate) {
            const appointmentDate = new Date(scheduledDate);
            if (isNaN(appointmentDate.getTime())) {
                return res.status(400).json({ 
                    error: 'Invalid date format', 
                    message: 'Please provide a valid date' 
                });
            }
            appointment.scheduledDate = appointmentDate;
        }
        if (scheduledTime) {
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(scheduledTime)) {
                return res.status(400).json({ 
                    error: 'Invalid time format', 
                    message: 'Please provide time in HH:MM format (e.g., 14:30)' 
                });
            }
            appointment.scheduledTime = scheduledTime;
        }
        if (status) appointment.status = status;
        if (notes !== undefined) appointment.notes = notes;
        
        appointment.updatedAt = new Date();

        const updatedAppointment = await appointment.save();
        
        // Populate the updated appointment
        const populatedAppointment = await Appointment.findById(updatedAppointment._id)
            .populate('patient', 'name age gender phone')
            .populate('doctor', 'name specialization');
            
        res.json(populatedAppointment);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ 
                error: 'Invalid appointment ID', 
                message: 'Please provide a valid appointment ID' 
            });
        }
        res.status(400).json({ error: 'Failed to update appointment', message: err.message });
    }
});

// Delete appointment
router.route('/delete/:id').delete(async (req, res) => {
    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
        
        if (!deletedAppointment) {
            return res.status(404).json({ 
                error: 'Appointment not found', 
                message: 'No appointment found with the provided ID' 
            });
        }

        res.json({ message: 'Appointment deleted successfully' });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ 
                error: 'Invalid appointment ID', 
                message: 'Please provide a valid appointment ID' 
            });
        }
        res.status(500).json({ error: 'Failed to delete appointment', message: err.message });
    }
});

module.exports = router;