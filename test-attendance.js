const axios = require('axios');

const testAttendance = async () => {
    const baseURL = 'http://localhost:5000';
    
    try {
        console.log('🧪 Testing attendance functionality...');
        
        // First, get all doctors
        console.log('📋 Fetching doctors...');
        const doctorsResponse = await axios.get(`${baseURL}/doctors`);
        const doctors = doctorsResponse.data;
        
        if (doctors.length === 0) {
            console.log('❌ No doctors found. Please add a doctor first.');
            return;
        }
        
        console.log(`✅ Found ${doctors.length} doctors`);
        
        // Test with the first doctor
        const testDoctor = doctors[0];
        console.log(`🧪 Testing with doctor: ${testDoctor.name} (ID: ${testDoctor._id})`);
        
        // Test attendance update
        console.log('🔄 Testing attendance update to "present"...');
        const updateResponse = await axios.post(
            `${baseURL}/doctors/attendance/${testDoctor._id}`,
            {
                status: 'present',
                notes: 'Test attendance update'
            }
        );
        
        console.log('✅ Attendance update successful!');
        console.log('📊 Updated doctor data:', JSON.stringify(updateResponse.data, null, 2));
        
        // Test attendance summary
        console.log('📊 Testing attendance summary...');
        const summaryResponse = await axios.get(`${baseURL}/doctors/attendance-summary`);
        console.log('✅ Attendance summary:', summaryResponse.data);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('📊 Error response:', error.response.data);
            console.error('📊 Error status:', error.response.status);
        }
    }
};

// Run test
testAttendance(); 