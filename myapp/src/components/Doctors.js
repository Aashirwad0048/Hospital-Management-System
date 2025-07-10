import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Doctorcard from './Doctorcard';
import API_CONFIG from '../config/api';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({ 
    name: '', 
    specialization: '', 
    experience: '',
    email: '',
    phone: '',
    emergencyContact: ''
  });
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [attendanceFilter, setAttendanceFilter] = useState('all');
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    on_leave: 0,
    off_duty: 0,
    total: 0
  });

    useEffect(() => {
    fetchDoctors();
    fetchAttendanceSummary();
    }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS}`);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to fetch doctors. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceSummary = async () => {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS_ATTENDANCE_SUMMARY}`);
      setAttendanceSummary(response.data);
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
    }
  };

  const handleAddDoctor = async (e) => {
        e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS_ADD}`, newDoctor);
                setDoctors([...doctors, response.data]);
      setNewDoctor({ 
        name: '', 
        specialization: '', 
        experience: '',
        email: '',
        phone: '',
        emergencyContact: ''
      });
      setShowForm(false);
      fetchAttendanceSummary();
    } catch (error) {
      console.error('Error adding doctor:', error);
      setError('Failed to add doctor. Please try again.');
    } finally {
      setLoading(false);
    }
    };

  const handleUpdateDoctor = async (id, e) => {
        e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS_UPDATE(id)}`, selectedDoctor);
      setDoctors((prev) =>
        prev.map((doctor) =>
          doctor._id === id ? { ...response.data, _id: id } : doctor
        )
      );
                setSelectedDoctor(null);
                setIsEditMode(false);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating doctor:', error);
      setError('Failed to update doctor. Please try again.');
    } finally {
      setLoading(false);
    }
    };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await axios.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS_DELETE(id)}`);
      setDoctors((prev) => prev.filter((doctor) => doctor._id !== id));
      fetchAttendanceSummary();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setError('Failed to delete doctor. Please try again.');
    } finally {
      setLoading(false);
    }
    };

    const handleEditDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setIsEditMode(true);
    setShowForm(true);
  };

  const handleAttendanceUpdate = (updatedDoctor) => {
    setDoctors((prev) =>
      prev.map((doctor) =>
        doctor._id === updatedDoctor._id ? updatedDoctor : doctor
      )
    );
    fetchAttendanceSummary();
  };

  const doctorFormData = isEditMode ? selectedDoctor : newDoctor;
  
  const updateFormData = (field, value) => {
    if (isEditMode) {
      setSelectedDoctor({ ...selectedDoctor, [field]: value });
    } else {
      setNewDoctor({ ...newDoctor, [field]: value });
    }
  };

  const resetForm = () => {
    setNewDoctor({ 
      name: '', 
      specialization: '', 
      experience: '',
      email: '',
      phone: '',
      emergencyContact: ''
    });
    setSelectedDoctor(null);
    setIsEditMode(false);
    setError('');
    setShowForm(false);
  };

  const getFilteredDoctors = () => {
    if (attendanceFilter === 'all') {
      return doctors;
    }
    return doctors.filter(doctor => 
      doctor.attendance?.todayStatus === attendanceFilter
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-700';
      case 'absent': return 'bg-red-100 text-red-700';
      case 'on_leave': return 'bg-yellow-100 text-yellow-700';
      case 'off_duty': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return '✅';
      case 'absent': return '❌';
      case 'on_leave': return '🏖️';
      case 'off_duty': return '🚫';
      default: return '❓';
    }
    };

    return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">👨‍⚕️ Doctors</h2>
            <p className="text-gray-600 mt-1">
              Manage doctor information, specializations, and attendance
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              {showForm ? '✕ Close Form' : '➕ Add Doctor'}
            </button>
            <button 
              onClick={() => { fetchDoctors(); fetchAttendanceSummary(); }}
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              disabled={loading}
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Attendance Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{attendanceSummary.present}</div>
            <div className="text-sm text-green-700">✅ Present</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">{attendanceSummary.absent}</div>
            <div className="text-sm text-red-700">❌ Absent</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{attendanceSummary.on_leave}</div>
            <div className="text-sm text-yellow-700">🏖️ On Leave</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-600">{attendanceSummary.off_duty}</div>
            <div className="text-sm text-gray-700">🚫 Off Duty</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{attendanceSummary.total}</div>
            <div className="text-sm text-blue-700">👥 Total</div>
          </div>
        </div>
      </div>

      {/* Attendance Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Filter by Attendance</h3>
          <div className="flex flex-wrap gap-2">
            {['all', 'present', 'absent', 'on_leave', 'off_duty'].map((status) => (
              <button
                key={status}
                onClick={() => setAttendanceFilter(status)}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  attendanceFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status !== 'all' && <span className="mr-1">{getStatusIcon(status)}</span>}
                {status === 'all' ? 'All Doctors' : status.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

            {/* Form Section */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditMode ? '✏️ Edit Doctor' : '➕ Add New Doctor'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
                <form
            className="space-y-4"
            onSubmit={isEditMode ? (e) => handleUpdateDoctor(selectedDoctor._id, e) : handleAddDoctor}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                👨‍⚕️ Doctor Name
              </label>
                    <input
                        type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Enter doctor's full name"
                value={doctorFormData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  🏥 Specialization
                </label>
                    <input
                        type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="e.g., Cardiology, Neurology"
                  value={doctorFormData.specialization}
                  onChange={(e) => updateFormData('specialization', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ⏰ Experience (Years)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter years of experience"
                  value={doctorFormData.experience}
                  onChange={(e) => updateFormData('experience', e.target.value)}
                  required
                  min="0"
                  max="50"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  📧 Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="doctor@hospital.com"
                  value={doctorFormData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  📞 Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="+1234567890"
                  value={doctorFormData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  🚨 Emergency Contact
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Emergency number"
                  value={doctorFormData.emergencyContact}
                  onChange={(e) => updateFormData('emergencyContact', e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                        type="submit"
                className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {isEditMode ? '✏️ Update Doctor' : '➕ Add Doctor'}
                  </>
                )}
              </button>
              
              {isEditMode && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="inline-flex justify-center items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
                  disabled={loading}
                >
                  ✕ Cancel
                    </button>
              )}
            </div>
          </form>
        </div>
      )}

            {/* Doctors List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            📋 Doctors List ({getFilteredDoctors().length} of {doctors.length})
                </h3>
          {loading && (
            <div className="flex items-center text-blue-600">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          )}
        </div>
        
        {loading && doctors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading doctors...</div>
          </div>
        )}
        
        {!loading && doctors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500">Get started by adding your first doctor</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              ➕ Add First Doctor
            </button>
          </div>
        )}

        {!loading && doctors.length > 0 && getFilteredDoctors().length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors match the filter</h3>
            <p className="text-gray-500">Try changing the attendance filter</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getFilteredDoctors().map((doctor) => (
            <Doctorcard
                            key={doctor._id}
                            doctor={doctor}
                            onEdit={handleEditDoctor}
                            onDelete={handleDeleteDoctor}
              onAttendanceUpdate={handleAttendanceUpdate}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Doctors;
