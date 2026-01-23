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
          {edu.certificate && (
            <a
              href={`${import.meta.env.VITE_API_BASE_URL}/${edu.certificate}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 16l4-5h-3V4h-2v7H8l4 5zM5 18h14v2H5z" />
              </svg>
              Download Certificate
          </a>
          )}
        </div>
      ))}
    </div>
  );
}
