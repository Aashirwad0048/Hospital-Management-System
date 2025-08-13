const axios = require('axios');

async function testAttendanceAPI() {
    const baseURL = 'http://localhost:5000';
    
    try {
        console.log('🧪 Testing basic connectivity...');
        
        // Test health endpoint
        try {
            const healthResponse = await axios.get(`${baseURL}/health`, { timeout: 5000 });
            console.log('✅ Health check passed:', healthResponse.status);
        } catch (error) {
            console.log('❌ Health check failed:', error.message);
        }
        
        // Test doctors endpoint
        try {
            const doctorsResponse = await axios.get(`${baseURL}/doctors`, { timeout: 5000 });
            console.log('✅ Doctors endpoint passed:', doctorsResponse.status);
            console.log('📊 Found doctors:', doctorsResponse.data.length);
            
            if (doctorsResponse.data.length > 0) {
                const testDoctor = doctorsResponse.data[0];
                console.log(`🧪 Testing attendance update for doctor: ${testDoctor.name}`);
                
                // Test attendance update
                const attendanceResponse = await axios.post(
                    `${baseURL}/doctors/attendance/${testDoctor._id}`,
                    {
                        status: 'present',
                        notes: 'Test attendance update'
                    },
                    { timeout: 5000 }
                );
                console.log('✅ Attendance update passed:', attendanceResponse.status);
            }
        } catch (error) {
            console.log('❌ Doctors endpoint failed:', error.message);
            if (error.code === 'ECONNREFUSED') {
                console.log('🔍 Connection refused - server may not be running properly');
            }
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testAttendanceAPI();
