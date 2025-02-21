import React from 'react';

const HospitalCard = ({ hospital, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {hospital.hospital_name}
      </h3>
      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {hospital._address_original_first_line}
        </p>
        <p className="flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {hospital.telephone || 'N/A'}
        </p>
        <p className="flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {hospital._hospital_care_type || 'General Hospital'}
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {hospital._discipline_systems_of_medicine || 'Medical Facility'}
        </span>
      </div>
    </div>
  );
};

export default HospitalCard;