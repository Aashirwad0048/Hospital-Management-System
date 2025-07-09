import React from 'react';
import axios from 'axios';
import API_CONFIG from '../config/api';

const AppointmentCard = ({ appointment, onEdit, onDelete, onUpdate }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            full: date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            time: date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            short: date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            })
        };
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const dateInfo = formatDate(appointment.scheduledDate);
    const scheduledTime = formatTime(appointment.scheduledTime);
    const isToday = new Date(appointment.scheduledDate).toDateString() === new Date().toDateString();
    const isPast = new Date(appointment.scheduledDate) < new Date();

    // Get arrival status
    const getArrivalStatus = () => {
        if (!appointment.arrivalTime) return 'not_arrived';
        return appointment.arrivalStatus || 'not_arrived';
    };

    const arrivalStatus = getArrivalStatus();

    const getArrivalIcon = () => {
        switch (arrivalStatus) {
            case 'on_time': return '✅';
            case 'late': return '⏰';
            case 'not_arrived': return '⏳';
            default: return '❓';
        }
    };

    const getArrivalText = () => {
        switch (arrivalStatus) {
            case 'on_time': return 'On Time';
            case 'late': return 'Late';
            case 'not_arrived': return 'Not Arrived';
            default: return 'Unknown';
        }
    };

    const getArrivalColor = () => {
        switch (arrivalStatus) {
            case 'on_time': return 'bg-green-100 text-green-700';
            case 'late': return 'bg-yellow-100 text-yellow-700';
            case 'not_arrived': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleMarkArrival = async () => {
        try {
            const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENTS_ARRIVAL(appointment._id)}`);
            if (onUpdate) {
                onUpdate(response.data);
            }
        } catch (error) {
            console.error('Error marking arrival:', error);
            alert('Failed to mark arrival. Please try again.');
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300">
            {/* Header with status indicator */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                        isPast ? 'bg-red-500' : isToday ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        isPast ? 'bg-red-100 text-red-700' : 
                        isToday ? 'bg-green-100 text-green-700' : 
                        'bg-blue-100 text-blue-700'
                    }`}>
                        {isPast ? 'Past' : isToday ? 'Today' : 'Upcoming'}
                    </span>
                </div>
                <div className="text-2xl">📅</div>
            </div>

            {/* Patient Info */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">👤</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Patient</p>
                        <p className="font-semibold text-gray-900">
                            {appointment.patient?.name || 'Unknown Patient'}
                        </p>
                        {appointment.patient?.age && (
                            <p className="text-xs text-gray-600">
                                Age: {appointment.patient.age} | {appointment.patient.gender}
            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">👨‍⚕️</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Doctor</p>
                        <p className="font-semibold text-gray-900">
                            {appointment.doctor?.name || 'Unknown Doctor'}
                        </p>
                        {appointment.doctor?.specialization && (
                            <p className="text-xs text-gray-600">
                                {appointment.doctor.specialization}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Date and Time */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2 mb-1">
                    <span className="text-gray-600">🕒</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Scheduled</span>
                </div>
                <p className="font-medium text-gray-900 text-sm">{dateInfo.short}</p>
                <p className="text-xs text-gray-600">{scheduledTime}</p>
            </div>

            {/* Arrival Status */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-lg">{getArrivalIcon()}</span>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Arrival Status</p>
                            <p className={`text-sm font-medium ${getArrivalColor().split(' ')[1]}`}>
                                {getArrivalText()}
                            </p>
                        </div>
                    </div>
                    {arrivalStatus === 'not_arrived' && isToday && (
                        <button
                            onClick={handleMarkArrival}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                        >
                            Mark Arrival
                        </button>
                    )}
                </div>
                {appointment.arrivalTime && (
                    <p className="text-xs text-gray-600 mt-1">
                        Arrived: {new Date(appointment.arrivalTime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
            </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
                <button
                    onClick={() => onEdit(appointment)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                </button>
                <button
                    onClick={() => onDelete(appointment._id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                </button>
            </div>
        </div>
    );
};

export default AppointmentCard;
