import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppointmentCard from './AppointmentCard';
import API_CONFIG from '../config/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    doctorId: '',
    scheduledDate: '',
    scheduledTime: '',
    notes: ''
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Configure axios defaults
  axios.defaults.timeout = 10000; // 10 seconds timeout
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔍 Fetching appointments from:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENTS}`);
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENTS}`);
      console.log('✅ Appointments fetched successfully:', response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      
      // Detailed error logging
      if (error.response) {
        // Server responded with error status
        console.error('📊 Response status:', error.response.status);
        console.error('📊 Response data:', error.response.data);
        setError(`Server error: ${error.response.status} - ${error.response.data?.message || error.response.data?.error || 'Unknown error'}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error('🌐 No response received from server');
        setError('No response from server. Please check if the backend server is running on port 5000.');
      } else {
        // Something else happened
        console.error('🚫 Request setup error:', error.message);
        setError(`Request failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENTS}`);
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS}`);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('➕ Adding appointment:', newAppointment);
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENTS_ADD}`, newAppointment);
      console.log('✅ Appointment added successfully:', response.data);
      
        setAppointments([...appointments, response.data]);
      setNewAppointment({ patientId: '', doctorId: '', scheduledDate: '', scheduledTime: '', notes: '' });
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error adding appointment:', error);
      
      if (error.response) {
        console.error('📊 Response status:', error.response.status);
        console.error('📊 Response data:', error.response.data);
        setError(`Failed to add appointment: ${error.response.data?.message || error.response.data?.error || 'Unknown error'}`);
      } else if (error.request) {
        setError('No response from server. Please check if the backend server is running.');
      } else {
        setError(`Request failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAppointment = async (id, e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('✏️ Updating appointment:', id, selectedAppointment);
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENTS_UPDATE(id)}`, selectedAppointment);
      console.log('✅ Appointment updated successfully:', response.data);
      
        setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === id ? { ...response.data, _id: id } : appointment
        )
        );
        setSelectedAppointment(null);
        setIsEditMode(false);
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error updating appointment:', error);
      
      if (error.response) {
        console.error('📊 Response status:', error.response.status);
        console.error('📊 Response data:', error.response.data);
        setError(`Failed to update appointment: ${error.response.data?.message || error.response.data?.error || 'Unknown error'}`);
      } else if (error.request) {
        setError('No response from server. Please check if the backend server is running.');
      } else {
        setError(`Request failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('🗑️ Deleting appointment:', id);
      await axios.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENTS_DELETE(id)}`);
      console.log('✅ Appointment deleted successfully');
      
      setAppointments((prev) => prev.filter((appointment) => appointment._id !== id));
    } catch (error) {
      console.error('❌ Error deleting appointment:', error);
      
      if (error.response) {
        console.error('📊 Response status:', error.response.status);
        console.error('📊 Response data:', error.response.data);
        setError(`Failed to delete appointment: ${error.response.data?.message || error.response.data?.error || 'Unknown error'}`);
      } else if (error.request) {
        setError('No response from server. Please check if the backend server is running.');
      } else {
        setError(`Request failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditAppointment = (appointment) => {
    // Format date for input field (YYYY-MM-DD)
    const formattedDate = new Date(appointment.scheduledDate).toISOString().split('T')[0];
    setSelectedAppointment({
      ...appointment,
      scheduledDate: formattedDate
    });
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleAppointmentUpdate = (updatedAppointment) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment._id === updatedAppointment._id ? updatedAppointment : appointment
      )
    );
  };

  const appointmentFormData = isEditMode ? selectedAppointment : newAppointment;
  
  const updateFormData = (field, value) => {
    if (isEditMode) {
      setSelectedAppointment({ ...selectedAppointment, [field]: value });
    } else {
      setNewAppointment({ ...newAppointment, [field]: value });
    }
  };

  const resetForm = () => {
    setNewAppointment({ patientId: '', doctorId: '', scheduledDate: '', scheduledTime: '', notes: '' });
    setSelectedAppointment(null);
    setIsEditMode(false);
    setError('');
    setShowForm(false);
  };

  const testConnection = async () => {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/health`);
      console.log('✅ Health check successful:', response.data);
      alert('Connection successful! Server is running.');
    } catch (error) {
      console.error('❌ Health check failed:', error);
      alert('Connection failed! Please check if the server is running.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage patient appointments and schedules</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={testConnection}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Test Connection
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Appointment
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
          {isEditMode ? 'Edit Appointment' : 'Add New Appointment'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={isEditMode ? (e) => handleUpdateAppointment(appointmentFormData._id, e) : handleAddAppointment}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Patient Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient *
                </label>
                <select
                  value={appointmentFormData.patientId}
                  onChange={(e) => updateFormData('patientId', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Patient</option>
                  {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name} ({patient.age} years, {patient.gender})
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor *
                </label>
                <select
                  value={appointmentFormData.doctorId}
                  onChange={(e) => updateFormData('doctorId', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} ({doctor.specialization})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
          <input
                  type="date"
                  value={appointmentFormData.scheduledDate}
                  onChange={(e) => updateFormData('scheduledDate', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
          <input
                  type="time"
                  value={appointmentFormData.scheduledTime}
                  onChange={(e) => updateFormData('scheduledTime', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={appointmentFormData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional notes about the appointment..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (isEditMode ? 'Update Appointment' : 'Add Appointment')}
          </button>
            </div>
        </form>
      </div>
      )}

      {/* Appointments Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new appointment.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Appointment
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onEdit={handleEditAppointment}
              onDelete={handleDeleteAppointment}
              onUpdate={handleAppointmentUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
