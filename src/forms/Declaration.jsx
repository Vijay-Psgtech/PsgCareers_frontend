// src/forms/Declaration.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Declaration({ data, updateFormData, formData }) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (data?.agreed) setAgreed(data.agreed);
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!agreed) {
      alert('Please confirm the declaration before submitting.');
      return;
    }

    updateFormData({ agreed: true });

    // Final submission logic (example)
    console.log('Form Data to submit:', formData);
    localStorage.removeItem(`applicationFormData_${formData?.jobId || 'temp'}`);

    alert('Form submitted successfully!');
    navigate('/careers');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Declaration</h3>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          className="w-5 h-5"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          required
        />
        <span className="text-gray-700">
          I hereby declare that the information is true to the best of my knowledge.
        </span>
      </label>

      <div className="text-right">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
        >
          Submit Application
        </button>
      </div>
    </form>
  );
}

