import React from 'react';

export default function WorkExperienceDetails({ work }) {
  const { industry = [], teaching = [] } = work || {};

  return (
    <div className="space-y-6">
      {/* Industry Experience */}
      {industry.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-4">Industry Experience</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {industry.map((item, index) => (
              <div key={index} className="bg-white shadow-md p-4 rounded-2xl border border-gray-200">
                <p><span className="font-medium text-gray-600">Organization:</span> {item.organization}</p>
                <p><span className="font-medium text-gray-600">Designation:</span> {item.designation}</p>
                <p><span className="font-medium text-gray-600">From:</span> {new Date(item.from).toLocaleDateString()}</p>
                <p><span className="font-medium text-gray-600">To:</span> {new Date(item.to).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teaching Experience */}
      {teaching.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-4">Teaching Experience</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {teaching.map((item, index) => (
              <div key={index} className="bg-white shadow-md p-4 rounded-2xl border border-gray-200">
                <p><span className="font-medium text-gray-600">Institution:</span> {item.institution}</p>
                <p><span className="font-medium text-gray-600">Designation:</span> {item.designation}</p>
                <p><span className="font-medium text-gray-600">From:</span> {new Date(item.from).toLocaleDateString()}</p>
                <p><span className="font-medium text-gray-600">To:</span> {new Date(item.to).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* If no data */}
      {industry.length === 0 && teaching.length === 0 && (
        <p className="text-gray-500 italic">No work experience details available.</p>
      )}
    </div>
  );
}
