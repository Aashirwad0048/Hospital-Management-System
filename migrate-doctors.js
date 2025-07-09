// migrate-doctors.js

const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hms';

const sampleDoctors = [
  {
    name: 'Dr. John Smith',
    specialization: 'Cardiology',
    experience: 10,
    contact: {
      email: 'john.smith@example.com',
      phone: '1234567890',
      emergencyContact: '9876543210'
    }
  },
  {
    name: 'Dr. Emily Brown',
    specialization: 'Neurology',
    experience: 8,
    contact: {
      email: 'emily.brown@example.com',
      phone: '2345678901',
      emergencyContact: '8765432109'
    }
  },
  {
    name: 'Dr. Michael Lee',
    specialization: 'Orthopedics',
    experience: 12,
    contact: {
      email: 'michael.lee@example.com',
      phone: '3456789012',
      emergencyContact: '7654321098'
    }
  }
];

async function seedDoctors() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    await Doctor.deleteMany({});
    await Doctor.insertMany(sampleDoctors);
    console.log('Sample doctors inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding doctors:', err);
    process.exit(1);
  }
}

seedDoctors(); 