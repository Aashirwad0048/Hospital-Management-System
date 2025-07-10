// API Configuration
const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: 'https://hms-storing-gb32.vercel.app/',
  
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
