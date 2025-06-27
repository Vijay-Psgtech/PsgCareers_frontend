import React from 'react';

const OtherDetailsCard = ({ data }) => {
  if (!data) return null;

  const {
    reference1 = {},
    reference2 = {},
    lastPay,
    expectedPay,
    joiningTime,
    relativesAtPSG,
    attendedPSGInterview,
    vacancySource,
    otherComments,
    resumeUrl
  } = data;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Other Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="font-semibold text-gray-700 mb-1">Reference 1</h3>
          <p><strong>Name:</strong> {reference1.name}</p>
          <p><strong>Designation:</strong> {reference1.designation}</p>
          <p><strong>Address:</strong> {reference1.address}</p>
          <p><strong>Mobile:</strong> {reference1.mobile}</p>
          <p><strong>Email:</strong> {reference1.email}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-1">Reference 2</h3>
          <p><strong>Name:</strong> {reference2.name}</p>
          <p><strong>Designation:</strong> {reference2.designation}</p>
          <p><strong>Address:</strong> {reference2.address}</p>
          <p><strong>Mobile:</strong> {reference2.mobile}</p>
          <p><strong>Email:</strong> {reference2.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <p><strong>Last Pay:</strong> ₹{lastPay}</p>
        <p><strong>Expected Pay:</strong> ₹{expectedPay}</p>
        <p><strong>Joining Time:</strong> {joiningTime}</p>
        <p><strong>Relatives at PSG:</strong> {relativesAtPSG}</p>
        <p><strong>Attended PSG Interview:</strong> {attendedPSGInterview}</p>
        <p><strong>Vacancy Source:</strong> {vacancySource}</p>
        <p><strong>Other Comments:</strong> {otherComments}</p>
      </div>
    </div>
  );
};

export default OtherDetailsCard;
