import React, { useState, useEffect } from 'react';
import { useAuth } from "../Context/AuthContext";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from '../utils/axiosInstance';

export default function WorkExperience({ data = {}, updateFormData, jobCategory }) {
  const { auth } = useAuth();
  const userId = auth.userId;
  const { jobId } = useParams();
  const location = useLocation();

  const effectiveJobCategory =
    jobCategory || location.state?.jobCategory || auth?.jobCategory || '';

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toISOString().split("T")[0] : '';

  function initialEntry() {
    return {
      designation: '',
      institution: '',
      address: '',
      specialization: '',
      from: '',
      to: '',
      currentlyWorking: false,
      certificateFile: null
    };
  }

  const [form, setForm] = useState({
    teaching: data?.teaching?.length > 0 ? data.teaching : [initialEntry()],
    industry: data?.industry?.length > 0 ? data.industry : [] // ✅ Empty allowed
  });

  useEffect(() => {
    if (!userId) return;

    axiosInstance.get('/api/workExperience/get', { params: { userId, jobId } })
      .then(res => {
        const responseData = res.data || {};
        setForm({
          teaching: responseData.teaching?.length > 0
            ? responseData.teaching.map(e => ({
                ...initialEntry(),
                ...e,
                certificateFile: null,
                currentlyWorking: !!e.currentlyWorking
              }))
            : [initialEntry()],
          industry: responseData.industry?.length > 0
            ? responseData.industry.map(e => ({
                ...initialEntry(),
                ...e,
                certificateFile: null,
                currentlyWorking: !!e.currentlyWorking
              }))
            : [] // ✅ Empty allowed
        });
      })
      .catch(err => console.error("Error fetching Work experience details:", err));
  }, [userId, jobId]);

  const handleChange = (type, index, field, value) => {
    const updated = [...form[type]];
    updated[index][field] = value;
    if (field === 'currentlyWorking' && value) {
      updated[index]['to'] = '';
    }
    setForm(prev => ({ ...prev, [type]: updated }));
  };

  const handleFileChange = (type, index, file) => {
    const updated = [...form[type]];
    updated[index].certificateFile = file || null;
    setForm(prev => ({ ...prev, [type]: updated }));
  };

  const addEntry = (type) => {
    setForm(prev => ({
      ...prev,
      [type]: [...prev[type], initialEntry()]
    }));
  };

  const removeEntry = (type, index) => {
    const updated = [...form[type]];
    updated.splice(index, 1);
    setForm(prev => ({ ...prev, [type]: updated })); // ✅ No forced initialEntry()
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('userId', userId || '');
    formData.append('jobId', jobId || '');

    const teachingArray = form.teaching.map((item, idx) => {
      let cleanedItem = {
        designation: item.designation || '',
        institution: item.institution || '',
        address: item.address || '',
        specialization: item.specialization || '',
        from: item.from || '',
        to: item.to || '',
        currentlyWorking: !!item.currentlyWorking,
        certificate: ''
      };

      if (item.certificateFile instanceof File) {
        formData.append(`teachingCertificates_${idx}`, item.certificateFile);
        cleanedItem.certificate = item.certificateFile.name;
      }
      return cleanedItem;
    });

    const industryArray = form.industry.map((item, idx) => {
      let cleanedItem = {
        designation: item.designation || '',
        institution: item.institution || '',
        address: item.address || '',
        specialization: item.specialization || '',
        from: item.from || '',
        to: item.to || '',
        currentlyWorking: !!item.currentlyWorking,
        certificate: ''
      };

      if (item.certificateFile instanceof File) {
        formData.append(`industryCertificates_${idx}`, item.certificateFile);
        cleanedItem.certificate = item.certificateFile.name;
      }
      return cleanedItem;
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
              <label className="block font-medium mb-1">Designation</label>
              <input
                type="text"
                value={entry.designation}
                onChange={(e) => handleChange(type, index, 'designation', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Institution Name</label>
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
              <label className="block font-medium mb-1">Address of the Institution</label>
              <input
                type="text"
                value={entry.address}
                onChange={(e) => handleChange(type, index, 'address', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Specialization</label>
              <input
                type="text"
                value={entry.specialization}
                onChange={(e) => handleChange(type, index, 'specialization', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">From</label>
              <input
                type="date"
                value={formatDate(entry.from)}
                onChange={(e) => handleChange(type, index, 'from', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                To {entry.currentlyWorking ? "(Disabled)" : ""}
              </label>
              <input
                type="date"
                value={formatDate(entry.to)}
                onChange={(e) => handleChange(type, index, 'to', e.target.value)}
                className="w-full border rounded px-3 py-2"
                disabled={entry.currentlyWorking}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={entry.currentlyWorking}
              onChange={(e) => handleChange(type, index, 'currentlyWorking', e.target.checked)}
            />
            <label className="text-sm">Currently Working</label>
          </div>

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
        className="text-blue-700 hover:text-blue-900 font-medium text-sm mt-2"
      >
        + Add More
      </button>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-8 space-y-10 max-w-5xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-blue-900 border-b pb-2">Work Experience</h3>

      {effectiveJobCategory === 'Teaching' && renderSection("Teaching Experience", "teaching")}
      {effectiveJobCategory !== 'Teaching' && renderSection("Industry Experience", "industry")}

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

 