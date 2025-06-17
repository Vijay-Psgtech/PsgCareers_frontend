import React, { useState, useEffect } from 'react';
import { useAuth } from "../Context/AuthContext";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from '../utils/axiosInstance';

export default function WorkExperience({ data = {}, updateFormData, jobCategory }) {
  const { auth } = useAuth();
  const userId = auth.userId;
  const { jobId } = useParams();

  const [form, setForm] = useState({
    teaching: data?.teaching?.length > 0 ? data.teaching : [{
      designation: '', institution: '', specialization: '', address: '',
      certificate: '', from: '', to: '', certificateFile: null // ✅ Added field
    }],
    industry: data?.industry?.length > 0 ? data.industry : [{
      designation: '', institution: '', specialization: '', address: '',
      certificate: '', from: '', to: '', certificateFile: null // ✅ Added field
    }]
  });

  const [errors, setErrors] = useState({ teaching: [], industry: [] });

  useEffect(() => {
    const fetchWorkExperienceData = async () => {
      try {
        const res = await axiosInstance.get(`/api/workExperience/get`, {
          params: { userId, jobId }
        });

        const responseData = res.data;
        setForm({
          teaching: responseData.teaching?.length > 0
            ? responseData.teaching.map(e => ({ ...e, certificateFile: null }))
            : form.teaching,
          industry: responseData.industry?.length > 0
            ? responseData.industry.map(e => ({ ...e, certificateFile: null }))
            : form.industry
        });
      } catch (err) {
        console.error("Error fetching Work experience details:", err);
      }
    };

    if (userId) fetchWorkExperienceData();
  }, [userId]);

  const handleChange = (type, index, field, value) => {
    const updated = [...form[type]];
    updated[index][field] = value;
    setForm(prev => ({ ...prev, [type]: updated }));
  };

  const handleFileChange = (type, index, file) => {
  const updated = [...form[type]];
  updated[index].certificateFile = file;
  setForm(prev => ({ ...prev, [type]: updated }));
};

  const addEntry = (type) => {
    setForm(prev => ({
      ...prev,
      [type]: [...prev[type], {
        designation: '', institution: '', specialization: '', address: '',
        certificate: '', from: '', to: '', certificateFile: null // ✅ Add file field
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
      entry.designation && entry.institution && entry.specialization &&
      entry.address && entry.certificate && entry.from && entry.to;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('jobId', jobId);

    const teachingArray = form.teaching.map((item, idx) => {
      if (item.certificate === 'Yes' && item.certificateFile instanceof File) {
        formData.append('teachingCertificates', item.certificateFile); // ✅ File append
        return { ...item, certificate: item.certificateFile.name };
      }
      return { ...item, certificateFile: undefined };
    });

    const industryArray = form.industry.map((item, idx) => {
      if (item.certificate === 'Yes' && item.certificateFile instanceof File) {
        formData.append('industryCertificates', item.certificateFile); // ✅ File append
        return { ...item, certificate: item.certificateFile.name };
      }
      return { ...item, certificateFile: undefined };
    });

    formData.append('teaching', JSON.stringify(teachingArray));
    formData.append('industry', JSON.stringify(industryArray));

    try {
      const res = await axiosInstance.post('/api/workExperience/save', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.status === 200 || res.status === 201) {
        updateFormData && updateFormData(formData);
        toast.success('Work Experience Details updated Successfully');
      } else {
        toast.error("Failed to save. Please try again.");
      }
    } catch (err) {
      console.error("Error saving Work Experience data:", err);
      toast.error("Failed to save. Please try again.");
    }
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
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Institution Name *</label>
              <input
                type="text"
                value={entry.institution}
                onChange={(e) => handleChange(type, index, 'institution', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Specialization *</label>
              <input
                type="text"
                value={entry.specialization}
                onChange={(e) => handleChange(type, index, 'specialization', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                value={entry.address}
                onChange={(e) => handleChange(type, index, 'address', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Certificate Available *</label>
              <select
                value={entry.certificate}
                onChange={(e) => handleChange(type, index, 'certificate', e.target.value)}
                className="w-full border rounded px-3 py-2"
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
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">To *</label>
              <input
                type="date"
                value={entry.to}
                onChange={(e) => handleChange(type, index, 'to', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {entry.certificate === 'Yes' && (
  <div className="mt-2">
    <label className="block font-medium text-gray-700 mb-1">Upload Certificate *</label>
    
    <input
      type="file"
      accept=".pdf,.png,.jpg,.jpeg"
      onChange={(e) => handleFileChange(type, index, e.target.files[0])}
      className="block w-full text-sm text-gray-700
                 file:mr-4 file:py-2 file:px-4
                 file:rounded file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-600 file:text-white
                 hover:file:bg-blue-700"
    />

    {/* Show selected file name */}
    {entry?.certificateFile && (
      <p className="mt-1 text-sm text-gray-600 font-medium">
        {entry.certificateFile.name}
      </p>
    )}
  </div>
)}

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



 