const axios = require('axios');

const baseURL = 'http://localhost:5000';

const testAppointmentArrival = async () => {
    console.log('🧪 Testing appointment arrival functionality...');
    
    try {
        // First, get existing appointments
        console.log('📋 Fetching existing appointments...');
        const appointmentsResponse = await axios.get(`${baseURL}/appointments`);
        const appointments = appointmentsResponse.data;
        
        if (appointments.length === 0) {
            console.log('❌ No appointments found. Please create an appointment first.');
            return;
        }
        
        console.log(`✅ Found ${appointments.length} appointments`);
        
        // Find an appointment for today that hasn't arrived yet
        const today = new Date().toISOString().split('T')[0];
        const todayAppointment = appointments.find(apt => {
            const aptDate = new Date(apt.scheduledDate).toISOString().split('T')[0];
            return aptDate === today && !apt.arrivalTime;
        });
        
        if (!todayAppointment) {
            console.log('❌ No appointments for today found, or all have already arrived.');
            console.log('📅 Available appointments:');
            appointments.forEach(apt => {
                const date = new Date(apt.scheduledDate).toISOString().split('T')[0];
                const status = apt.arrivalTime ? 'Arrived' : 'Not Arrived';
                console.log(`   - ${apt.patient?.name || 'Unknown'} on ${date} at ${apt.scheduledTime} (${status})`);
            });
            return;
        }
        
        console.log(`🧪 Testing with appointment: ${todayAppointment.patient?.name || 'Unknown'} (ID: ${todayAppointment._id})`);
        console.log(`📅 Scheduled: ${todayAppointment.scheduledDate} at ${todayAppointment.scheduledTime}`);
        console.log(`📊 Current status: ${todayAppointment.status}`);
        console.log(`⏰ Arrival time: ${todayAppointment.arrivalTime || 'Not set'}`);
        
        // Mark arrival
        console.log('🔄 Marking arrival...');
        const arrivalResponse = await axios.post(`${baseURL}/appointments/arrival/${todayAppointment._id}`);
        const updatedAppointment = arrivalResponse.data;
        
        console.log('✅ Arrival marked successfully!');
        console.log('📊 Updated appointment data:');
        console.log(`   - Status: ${updatedAppointment.status}`);
        console.log(`   - Arrival Time: ${updatedAppointment.arrivalTime}`);
        console.log(`   - Arrival Status: ${updatedAppointment.arrivalStatus}`);
        
        // Test arrival status calculation
        if (updatedAppointment.arrivalStatus) {
            console.log(`🎯 Arrival Status: ${updatedAppointment.arrivalStatus}`);
            if (updatedAppointment.arrivalStatus === 'on_time') {
                console.log('✅ Patient arrived on time!');
            } else if (updatedAppointment.arrivalStatus === 'late') {
                console.log('⏰ Patient arrived late!');
            }
        }
        
    } catch (error) {
        console.error('❌ Error testing appointment arrival:', error.response?.data || error.message);
    }
};

testAppointmentArrival(); 