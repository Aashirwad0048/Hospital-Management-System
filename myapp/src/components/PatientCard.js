import React from 'react';

const PatientCard = ({ patient, onEdit, onDelete }) => {
    const getGenderIcon = (gender) => {
        if (!gender) return '👤';
        switch (gender.toLowerCase()) {
            case 'male':
                return '👨';
            case 'female':
                return '👩';
            default:
                return '👤';
        }
    };

    const getAgeGroup = (age) => {
        if (!age || age < 18) return { label: 'Child', color: 'bg-blue-100 text-blue-700' };
        if (age < 65) return { label: 'Adult', color: 'bg-green-100 text-green-700' };
        return { label: 'Senior', color: 'bg-purple-100 text-purple-700' };
    };

    const ageGroup = getAgeGroup(patient.age);

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300">
            {/* Header with patient info */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {patient.name ? patient.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{patient.name || 'Unknown Patient'}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${ageGroup.color}`}>
                            {ageGroup.label}
                        </span>
                    </div>
                </div>
                <div className="text-2xl">
                    {getGenderIcon(patient.gender)}
                </div>
            </div>

            {/* Patient Details */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">🎂</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Age</p>
                        <p className="font-semibold text-gray-900">{patient.age || 'Unknown'} years old</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">⚧</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Gender</p>
                        <p className="font-semibold text-gray-900">{patient.gender || 'Not specified'}</p>
                    </div>
                </div>
            </div>

            {/* Patient ID */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                    <span className="text-gray-600">🆔</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Patient ID</span>
                </div>
                <p className="text-xs text-gray-600 font-mono mt-1">{patient._id}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
                <button
                    onClick={() => onEdit(patient)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                </button>
                <button
                    onClick={() => onDelete(patient._id)}
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

export default PatientCard;
