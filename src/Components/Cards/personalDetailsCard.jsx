import React from 'react';

export default function PersonalDetailsCard({ data }) {
  if (!data) return null;

  const {
    fullName,
    gender,
    dob,
    mobile,
    email,
    community,
    category,
    maritalStatus,
    aadhar,
    pan,
    physicallyChallenged,
    motherTongue,
    communicationAddress,
    communicationCity,
    communicationPincode,
    communicationState,
    communicationCountry,
    permanentAddress,
    permanentCity,
    permanentPincode,
    permanentState,
    permanentCountry,
    resumeUrl,
    languagesKnown = [],
    photoUrl,
  } = data;

  return (
    <div className="bg-white p-6 shadow rounded-lg max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Personal Details</h2>

      {/* Grid layout for core fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Detail label="Full Name" value={fullName} />
        <Detail label="Gender" value={gender} />
        <Detail label="Date of Birth" value={new Date(dob).toLocaleDateString()} />
        <Detail label="Mobile" value={mobile} />
        <Detail label="Email" value={email} />
        <Detail label="Community" value={community} />
        <Detail label="Category" value={category} />
        <Detail label="Marital Status" value={maritalStatus} />
        <Detail label="Aadhar" value={aadhar} />
        <Detail label="PAN" value={pan} />
        <Detail label="Physically Challenged" value={physicallyChallenged} />
        <Detail label="Mother Tongue" value={motherTongue} />
      </div>

      {/* Addresses */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddressCard
          title="Communication Address"
          address={communicationAddress}
          city={communicationCity}
          state={communicationState}
          pincode={communicationPincode}
          country={communicationCountry}
        />
        <AddressCard
          title="Permanent Address"
          address={permanentAddress}
          city={permanentCity}
          state={permanentState}
          pincode={permanentPincode}
          country={permanentCountry}
        />
      </div>

      {/* Languages Known */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Languages Known</h3>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Language</th>
              <th className="border px-2 py-1">Read</th>
              <th className="border px-2 py-1">Write</th>
              <th className="border px-2 py-1">Speak</th>
            </tr>
          </thead>
          <tbody>
            {languagesKnown.map((lang, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{lang.language}</td>
                <td className="border px-2 py-1">{lang.read ? '✔️' : '❌'}</td>
                <td className="border px-2 py-1">{lang.write ? '✔️' : '❌'}</td>
                <td className="border px-2 py-1">{lang.speak ? '✔️' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resume and Photo */}
      <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
        {resumeUrl && (
          <a
            href={`${import.meta.env.VITE_API_BASE_URL}/Uploads/${resumeUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 16l4-5h-3V4h-2v7H8l4 5zM5 18h14v2H5z" />
            </svg>
            Download Resume
          </a>
        )}

        {photoUrl && (
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/Uploads/${photoUrl}`}
            alt="Profile"
            className="w-24 h-24 object-cover rounded border"
          />
        )}
      </div>
    </div>
  );
}

const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="font-medium text-gray-800">{value || '-'}</p>
  </div>
);

const AddressCard = ({ title, address, city, state, pincode, country }) => (
  <div className="bg-gray-50 p-4 rounded shadow-sm">
    <h4 className="font-semibold text-gray-700 mb-1">{title}</h4>
    <p className="text-sm text-gray-700">
      {address}, {city}, {state}, {pincode}, {country}
    </p>
  </div>
);
