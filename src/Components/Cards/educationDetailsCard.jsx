import React from 'react';

export default function EducationDetails({ education }) {
  if (!education || !Array.isArray(education.educationList)) {
    return <p className="text-gray-500 italic">No education details available.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {education.educationList.map((edu, index) => (
        <div key={index} className="bg-white shadow-md rounded-2xl p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            {edu.qualification} - {edu.degree}
          </h3>
          <p><span className="font-medium text-gray-600">Specialization:</span> {edu.specialization}</p>
          <p><span className="font-medium text-gray-600">Year:</span> {edu.year}</p>
          <p><span className="font-medium text-gray-600">Percentage:</span> {edu.percentage}%</p>
        </div>
      ))}
    </div>
  );
}
