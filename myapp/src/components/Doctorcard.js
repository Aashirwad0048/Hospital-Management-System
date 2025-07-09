import React, { useState } from 'react';
import axios from 'axios';
import API_CONFIG from '../config/api';

const DoctorCard = ({ doctor, onEdit, onDelete, onAttendanceUpdate }) => {
    const [updatingAttendance, setUpdatingAttendance] = useState(false);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [attendanceStatus, setAttendanceStatus] = useState(doctor.attendance?.todayStatus || 'absent');
    const [attendanceNotes, setAttendanceNotes] = useState(doctor.attendance?.notes || '');

    const getExperienceLevel = (years) => {
        if (years < 5) return { label: 'Junior', color: 'bg-blue-100 text-blue-700' };
        if (years < 15) return { label: 'Experienced', color: 'bg-green-100 text-green-700' };
        return { label: 'Senior', color: 'bg-purple-100 text-purple-700' };
    };

    const getAttendanceStatus = (status) => {
        switch (status) {
            case 'present':
                return { label: 'Present', color: 'bg-green-100 text-green-700', icon: '✅' };
            case 'absent':
                return { label: 'Absent', color: 'bg-red-100 text-red-700', icon: '❌' };
            case 'on_leave':
                return { label: 'On Leave', color: 'bg-yellow-100 text-yellow-700', icon: '🏖️' };
            case 'off_duty':
                return { label: 'Off Duty', color: 'bg-gray-100 text-gray-700', icon: '🚫' };
            default:
                return { label: 'Unknown', color: 'bg-gray-100 text-gray-700', icon: '❓' };
        }
    };

    const experienceLevel = getExperienceLevel(doctor.experience);
    const attendanceInfo = getAttendanceStatus(doctor.attendance?.todayStatus || 'absent');

    const handleAttendanceUpdate = async () => {
        setUpdatingAttendance(true);
        try {
            console.log('🔔 Frontend: Attendance update request');
            console.log('📝 Status:', attendanceStatus);
            console.log('📝 Notes:', attendanceNotes);
            console.log('🆔 Doctor ID:', doctor._id);
            console.log('🌐 API URL:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS_UPDATE_ATTENDANCE(doctor._id)}`);
            
            const response = await axios.post(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS_UPDATE_ATTENDANCE(doctor._id)}`,
                {
                    status: attendanceStatus,
                    notes: attendanceNotes
                }
            );
            
            console.log('✅ Frontend: Attendance updated successfully');
            console.log('📊 Response:', response.data);
            
            if (onAttendanceUpdate) {
                onAttendanceUpdate(response.data);
            }
            
            setShowAttendanceModal(false);
        } catch (error) {
            console.error('❌ Frontend: Error updating attendance:', error);
            console.error('📊 Error response:', error.response?.data);
            console.error('📊 Error status:', error.response?.status);
            alert(`Failed to update attendance: ${error.response?.data?.message || error.message}`);
        } finally {
            setUpdatingAttendance(false);
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300">
                {/* Header with doctor info */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {doctor.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{doctor.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${experienceLevel.color}`}>
                                    {experienceLevel.label}
                                </span>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${attendanceInfo.color}`}>
                                    {attendanceInfo.icon} {attendanceInfo.label}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-2xl">👨‍⚕️</div>
                </div>

                {/* Doctor Details */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm">🏥</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Specialization</p>
                            <p className="font-semibold text-gray-900">{doctor.specialization}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-sm">⏰</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Experience</p>
                            <p className="font-semibold text-gray-900">{doctor.experience} years</p>
                        </div>
                    </div>

                    {/* Attendance Details */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wide">Today's Status</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${attendanceInfo.color}`}>
                                {attendanceInfo.icon} {attendanceInfo.label}
                            </span>
                        </div>
                        {doctor.attendance?.checkInTime && (
                            <p className="text-xs text-gray-600">Check-in: {formatTime(doctor.attendance.checkInTime)}</p>
                        )}
                        {doctor.attendance?.checkOutTime && (
                            <p className="text-xs text-gray-600">Check-out: {formatTime(doctor.attendance.checkOutTime)}</p>
                        )}
                        {doctor.attendance?.notes && (
                            <p className="text-xs text-gray-600 mt-1">📝 {doctor.attendance.notes}</p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => setShowAttendanceModal(true)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Attendance
                    </button>
                <button
                    onClick={() => onEdit(doctor)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    Edit
                </button>
                <button
                    onClick={() => onDelete(doctor._id)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    Delete
                </button>
            </div>
        </div>

            {/* Attendance Modal */}
            {showAttendanceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Update Attendance - {doctor.name}
                            </h3>
                            <button
                                onClick={() => setShowAttendanceModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Attendance Status
                                </label>
                                <select
                                    value={attendanceStatus}
                                    onChange={(e) => setAttendanceStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="present">✅ Present</option>
                                    <option value="absent">❌ Absent</option>
                                    <option value="on_leave">🏖️ On Leave</option>
                                    <option value="off_duty">🚫 Off Duty</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={attendanceNotes}
                                    onChange={(e) => setAttendanceNotes(e.target.value)}
                                    placeholder="Add any notes about the attendance..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={handleAttendanceUpdate}
                                    disabled={updatingAttendance}
                                    className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                                >
                                    {updatingAttendance ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Attendance'
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowAttendanceModal(false)}
                                    className="inline-flex justify-center items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DoctorCard;
