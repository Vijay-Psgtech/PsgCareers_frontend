import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

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

  const handleDownload = async (label, path) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/${path}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = label.replace(/\s+/g, '_'); // clean filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

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

      {resumeUrl && (
        <div className="mt-4">
          <a
            href={`${import.meta.env.VITE_API_BASE_URL}${resumeUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-medium hover:underline flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 16.5l4-4h-3V3h-2v9.5H8l4 4z" />
              <path d="M20 18H4v2h16v-2z" />
            </svg>
            Download Resume
          </a>
        </div>
      )}
      {data.documents && Object.keys(data.documents).length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Uploaded Documents</h3>
          <ul className="space-y-3">
            {Object.entries(data.documents).map(([label, path], index) => (
              <li
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border hover:shadow-lg transition"
              >
                {/* Left: Icon + Label */}
                <div className="flex items-start sm:items-center gap-3">
                  <FileText className="text-gray-600 w-5 h-5 mt-0.5 sm:mt-0" />
                  <span className="text-gray-800 font-medium break-words">{label}</span>
                </div>

                {/* Right: View / Download */}
                <div className="flex gap-4 text-sm sm:text-base mt-1 sm:mt-0">
                  <a
                    href={`${import.meta.env.VITE_API_BASE_URL}/${path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View
                  </a>
                  <button
                    onClick={() => handleDownload(label, path)}
                    className="flex items-center gap-1 text-green-600 hover:underline"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OtherDetailsCard;
