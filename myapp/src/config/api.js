// API Configuration
const API_CONFIG = {
  // Base URL for API calls - Using production server as fallback
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://hms-storing.onrender.com' 
    : 'https://hms-storing.onrender.com', // Using production server for development too
  
  // API Endpoints
  ENDPOINTS: {
    // Appointments
    APPOINTMENTS: '/appointments',
    APPOINTMENTS_ADD: '/appointments/add',
    APPOINTMENTS_UPDATE: (id) => `/appointments/update/${id}`,
    APPOINTMENTS_DELETE: (id) => `/appointments/delete/${id}`,
    APPOINTMENTS_ARRIVAL: (id) => `/appointments/arrival/${id}`,
    
    // Patients
    PATIENTS: '/patients',
    PATIENTS_ADD: '/patients/add',
    PATIENTS_UPDATE: (id) => `/patients/update/${id}`,
    PATIENTS_DELETE: (id) => `/patients/delete/${id}`,
    
    // Doctors
    DOCTORS: '/doctors',
    DOCTORS_ADD: '/doctors/add',
    DOCTORS_UPDATE: (id) => `/doctors/update/${id}`,
    DOCTORS_DELETE: (id) => `/doctors/delete/${id}`,
    
    // Doctor Attendance
    DOCTORS_ATTENDANCE: (status) => `/doctors/attendance/${status}`,
    DOCTORS_ATTENDANCE_SUMMARY: '/doctors/attendance-summary',
    DOCTORS_UPDATE_ATTENDANCE: (id) => `/doctors/attendance/${id}`,
    DOCTORS_BULK_ATTENDANCE: '/doctors/bulk-attendance',
    
    // Health check
    HEALTH: '/health',
    ROOT: '/'
  },
  
  // Request configuration
  REQUEST_CONFIG: {
    timeout: 10000, // 10 seconds
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

export default API_CONFIG; 
