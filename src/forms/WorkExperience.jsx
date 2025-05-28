import React, { useState } from 'react';

export default function WorkExperience({ data, updateFormData, jobCategory }) {
  const [form, setForm] = useState({
    teaching: data.teaching || [{
      designation: '', institution: '', address: '',
      certificate: '', from: '', to: ''
    }],
    industry: data.industry || [{
      designation: '', institution: '', address: '',
      certificate: '', from: '', to: ''
    }]
  });

  const [errors, setErrors] = useState({ teaching: [], industry: [] });

  const handleChange = (type, index, field, value) => {
    const updated = [...form[type]];
    updated[index][field] = value;
    setForm(prev => ({ ...prev, [type]: updated }));
  };

  const addEntry = (type) => {
    setForm(prev => ({
      ...prev,
      [type]: [...prev[type], {
        designation: '', institution: '', address: '',
        certificate: '', from: '', to: ''
      }]
    }));
  };

  const removeEntry = (type, index) => {
    const updated = [...form[type]];
    updated.splice(index, 1);
    setForm(prev => ({ ...prev, [type]: updated }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { teaching: [], industry: [] };

    const isValidEntry = (entry) =>
      entry.designation && entry.institution && entry.address &&
      entry.certificate && entry.from && entry.to;

    if (jobCategory === 'Teaching') {
      newErrors.teaching = form.teaching.map(e => isValidEntry(e) ? null : 'Please complete all fields.');
      newErrors.industry = form.industry.map(e => isValidEntry(e) ? null : 'Please complete all fields.');
      if (newErrors.teaching.some(Boolean) || newErrors.industry.some(Boolean)) valid = false;
    } else {
      newErrors.industry = form.industry.map(e => isValidEntry(e) ? null : 'Please complete all fields.');
      if (newErrors.industry.some(Boolean)) valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const filteredData = {
      teaching: jobCategory === 'Teaching' ? form.teaching : [],
      industry: form.industry
    };
    updateFormData(filteredData);
  };

  const renderSection = (label, type) => (
    <div className="space-y-6">
      <h4 className="text-xl font-semibold text-blue-800 border-b pb-1">{label}</h4>
      {form[type].map((entry, index) => (
        <div key={index} className="bg-gray-50 border rounded-lg p-6 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Designation *</label>
              <input
                type="text"
                value={entry.designation}
                onChange={(e) => handleChange(type, index, 'designation', e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Institution Name *</label>
              <input
                type="text"
                value={entry.institution}
                onChange={(e) => handleChange(type, index, 'institution', e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Address of Institution *</label>
            <textarea
              value={entry.address}
              onChange={(e) => handleChange(type, index, 'address', e.target.value)}
              className="w-full border rounded px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Certificate Available *</label>
              <select
                value={entry.certificate}
                onChange={(e) => handleChange(type, index, 'certificate', e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">From *</label>
              <input
                type="date"
                value={entry.from}
                onChange={(e) => handleChange(type, index, 'from', e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">To *</label>
              <input
                type="date"
                value={entry.to}
                onChange={(e) => handleChange(type, index, 'to', e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {errors[type][index] && (
            <p className="text-red-600 text-sm mt-2">{errors[type][index]}</p>
          )}

          {form[type].length > 1 && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => removeEntry(type, index)}
                className="text-red-600 hover:underline text-sm"
              >
                Remove Entry
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => addEntry(type)}
        className="text-blue-700 hover:text-blue-900 font-medium text-sm"
      >
        + Add More
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <h3 className="text-2xl font-bold text-blue-900 border-b pb-2">Work Experience</h3>

      {jobCategory === 'Teaching' && (
        <>
          {renderSection("Teaching Experience", "teaching")}
          {renderSection("Industry Experience", "industry")}
        </>
      )}

      {jobCategory !== 'Teaching' && renderSection("Industry Experience", "industry")}

      <div className="text-right">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          Save & Continue
        </button>
      </div>
    </form>
  );
}



 