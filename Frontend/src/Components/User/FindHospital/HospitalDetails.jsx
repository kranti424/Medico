import React from 'react';

const HospitalDetails = ({ hospital, onBack }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to List
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">{hospital.hospital_name}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DetailSection title="Contact Information">
          <DetailItem icon="phone" label="Phone" value={hospital.telephone} />
          <DetailItem icon="mobile" label="Mobile" value={hospital.mobile_number} />
          <DetailItem icon="emergency" label="Emergency" value={hospital.emergency_num} />
          <DetailItem icon="email" label="Email" value={hospital._hospital_primary_email_id} />
        </DetailSection>

        <DetailSection title="Location Details">
          <DetailItem icon="location" label="Address" value={hospital._address_original_first_line} />
          <DetailItem icon="map" label="Area" value={`${hospital.state}, ${hospital.district}`} />
          <DetailItem icon="pin" label="Pincode" value={hospital._pincode} />
        </DetailSection>

        <DetailSection title="Facilities & Services">
          <DetailItem icon="bed" label="Total Beds" value={hospital._total_num_beds} />
          <DetailItem icon="specialty" label="Specialties" value={hospital.specialties} />
          <DetailItem icon="service" label="Services" value={hospital.facilities} />
        </DetailSection>
      </div>
    </div>
  );
};

const DetailSection = ({ title, children }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    <span className="text-gray-500 text-sm w-24">{label}:</span>
    <span className="text-gray-900 text-sm flex-1">{value || 'N/A'}</span>
  </div>
);

export default HospitalDetails;