import React, { useState } from 'react';
import { useAuth } from "../Context/AuthContext";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

export default function WorkExperience({ data={}, updateFormData, jobCategory }) {
  const { auth } = useAuth();
  const userId = auth.userId;
  const {jobId} = useParams();
  const [form, setForm] = useState({
    teaching: data?.teaching?.length > 0 ? data.teaching : [{
      designation: '', institution: '', specialization: '', address: '',
      certificate: '', from: '', to: ''
    }],
    industry: data?.industry?.length > 0 ? data.industry : [{
      designation: '', institution: '', specialization: '', address: '',
      certificate: '', from: '', to: ''
    }]
  });
  const [errors, setErrors] = useState({ teaching: [], industry: [] });

  useEffect(()=>{
    const fetchWorkExperienceData = async() =>{
      try{
        const res = await axiosInstance.get(`/api/workExperience/get`, {
          params: { userId },
        });
        const data = res.data;
        const formatDate = (date) => {
          return date ? new Date(date).toISOString().split('T')[0] : '';
        }
        const formattedTeaching = data.teaching?.map(entry => ({
          ...entry,
          from: formatDate(entry.from),
          to: formatDate(entry.to),
        })) || [];
        const formattedIndustry = data.industry?.map(entry => ({
          ...entry,
          from: formatDate(entry.from),
          to: formatDate(entry.to),
        })) || [];
        setForm(prev => ({
          ...prev,
          teaching: formattedTeaching,
          industry: formattedIndustry,
        }));
      } catch(err) {
        console.error("Error fetching Work experience details:", err);
      }
    }
    if (userId) fetchWorkExperienceData();
  },[userId])

  const handleChange = (type, index, field, value) => {
    const updated = [...form[type]];
    updated[index][field] = value;
    setForm(prev => ({ ...prev, [type]: updated }));
  };

  const addEntry = (type) => {
    setForm(prev => ({
      ...prev,
      [type]: [...prev[type], {
        designation: '', institution: '', specialization:'',address: '',
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
      entry.designation && entry.institution && entry.specialization && entry.address &&
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submission = {
      userId,
      teaching : jobCategory === 'Teaching' ? form.teaching : [],
      industry: form.industry
    };

    const formData = new FormData();

    // Append simple fields
    formData.append('userId', userId);

    const teachingArray = submission.teaching.map((item, index) => {
      if (item.certificate instanceof File) {
        formData.append(`teachingCertificates`, item.certificate); // multiple files
        return { ...item, certificate: item.certificate.name };
      }
      return item;
    });

    const industryArray = submission.industry.map((item, index) => {
      if (item.certificate instanceof File) {
        formData.append(`industryCertificates`, item.certificate); // multiple files
        return { ...item, certificate: item.certificate.name };
      }
      return item;
    });

    formData.append('teaching', JSON.stringify(teachingArray));
    formData.append('industry', JSON.stringify(industryArray));

    try {
      const res = await axiosInstance.post('/api/workExperience/save', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.status === 200 || res.status === 201)  {
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Specialization *</label>
              <input
                type="text"
                value={entry.specialization}
                onChange={(e) => handleChange(type, index, 'specialization', e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                value={entry.address}
                onChange={(e) => handleChange(type, index, 'address', e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>


          {/* <div>
            <label className="block font-medium text-gray-700 mb-1">Address of Institution *</label>
            <textarea
              value={entry.address}
              onChange={(e) => handleChange(type, index, 'address', e.target.value)}
              className="w-full border rounded px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div> */}

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
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 space-y-10 max-w-5xl mx-auto">
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



 