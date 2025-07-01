import React, { useState, useEffect } from 'react';
import { useAuth } from "../Context/AuthContext";
import { useParams,useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from '../utils/axiosInstance';

export default function WorkExperience({ data = {}, updateFormData, jobCategory }) {
  const { auth } = useAuth();
  const userId = auth.userId;
  const { jobId } = useParams();
  const location = useLocation();

   const effectiveJobCategory =
    jobCategory || location.state?.jobCategory || auth?.jobCategory || '';

  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toISOString().split("T")[0] : '';

  const [form, setForm] = useState({
    teaching: data?.teaching?.length > 0 ? data.teaching : [initialEntry()],
    industry: data?.industry?.length > 0 ? data.industry : []
  });

  const [errors, setErrors] = useState({ teaching: [], industry: [] });

  function initialEntry() {
    return {
      designation: '', institution: '', address: '', specialization: '',
      certificate: '', from: '', to: '', currentlyWorking: false,
      certificateFile: null
    };
  }

  useEffect(() => {
    if (!userId) return;

    axiosInstance.get(`/api/workExperience/get`, { params: { userId, jobId } })
      .then(res => {
        const responseData = res.data;
        setForm({
          teaching: responseData.teaching?.length > 0
            ? responseData.teaching.map(e => ({ ...e, certificateFile: null, currentlyWorking: e.currentlyWorking || false }))
            : [initialEntry()],
          industry: responseData.industry?.length > 0
            ? responseData.industry.map(e => ({ ...e, certificateFile: null, currentlyWorking: e.currentlyWorking || false }))
            : []
        });
      })
      .catch(err => console.error("Error fetching Work experience details:", err));
  }, [userId]);

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
    updated[index].certificateFile = file;
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
    setForm(prev => ({ ...prev, [type]: updated }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { teaching: [], industry: [] };

    const isValidEntry = (entry) =>
      entry.designation && entry.institution && entry.address &&
      entry.certificate && entry.from &&
      (entry.currentlyWorking || entry.to) &&
      (!entry.to || new Date(entry.from) <= new Date(entry.to));

    if (effectiveJobCategory == 'Teaching')
    {
      newErrors.teaching = form.teaching.map(e => isValidEntry(e) ? null : 'Please complete all fields.');
      if (newErrors.teaching.some(Boolean)) valid = false;
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

    const teachingArray = form.teaching.map((item,idx) => {
      if (item.certificate === 'Yes' && item.certificateFile instanceof File) {
        formData.append(`teachingCertificates_${idx}`, item.certificateFile);
        return { ...item, certificate: item.certificateFile.name };
      }
      return { ...item, certificateFile: undefined };
    });

    const industryArray = form.industry.map((item,idx) => {
      if (item.certificate === 'Yes' && item.certificateFile instanceof File) {
        formData.append(`industryCertificates_${idx}`, item.certificateFile);
        return { ...item, certificate: item.certificateFile.name };
      }
      return { ...item, certificateFile: undefined };
    });

    const cleanedTeaching = teachingArray.filter(item => {
      return (
        item.designation?.trim() ||
        item.institution?.trim() ||
        item.specialization?.trim() ||
        item.address?.trim() ||
        item.certificate?.trim() ||
        item.from ||
        item.to
      )
    });

    const cleanedIndustry = industryArray.filter(item => {
      return (
        item.designation?.trim() ||
        item.institution?.trim() ||
        item.specialization?.trim() ||
        item.address?.trim() ||
        item.certificate?.trim() ||
        item.from ||
        item.to
      )
    });

    formData.append('teaching', JSON.stringify(cleanedTeaching));
    formData.append('industry', JSON.stringify(cleanedIndustry));

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
      {form[type].map((entry, index) => {
        const error = errors[type][index];
        const inputClass = (field) =>
          `w-full border rounded px-3 py-2 ${error && !entry[field] ? 'border-red-500' : ''}`;

        return (
          <div key={index} className="bg-gray-50 border rounded-lg p-6 space-y-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Designation *</label>
                <input type="text" value={entry.designation} onChange={(e) => handleChange(type, index, 'designation', e.target.value)} className={inputClass('designation')} />
              </div>
              <div>
                <label className="block font-medium mb-1">Institution Name *</label>
                <input type="text" value={entry.institution} onChange={(e) => handleChange(type, index, 'institution', e.target.value)} className={inputClass('institution')} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Address of the Institution *</label>
                <input type="text" value={entry.address} onChange={(e) => handleChange(type, index, 'address', e.target.value)} className={inputClass('address')} />
              </div>
              <div>
                <label className="block font-medium mb-1">Specialization *</label>
                <input type="text" value={entry.specialization} onChange={(e) => handleChange(type, index, 'specialization', e.target.value)} className={inputClass('specialization')} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-1">Certificate Available *</label>
                <select value={entry.certificate} onChange={(e) => handleChange(type, index, 'certificate', e.target.value)} className={inputClass('certificate')}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">From *</label>
                <input type="date" value={formatDate(entry.from)} onChange={(e) => handleChange(type, index, 'from', e.target.value)} className={inputClass('from')} />
              </div>
              <div>
                <label className="block font-medium mb-1">To {entry.currentlyWorking ? "(Disabled)" : "*"}</label>
                <input type="date" value={formatDate(entry.to)} onChange={(e) => handleChange(type, index, 'to', e.target.value)} className={inputClass('to')} disabled={entry.currentlyWorking} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" checked={entry.currentlyWorking} onChange={(e) => handleChange(type, index, 'currentlyWorking', e.target.checked)} />
              <label className="text-sm">Currently Working</label>
            </div>

            {entry.certificate === 'Yes' && (
              <div>
                <label className="block font-medium mb-1">Upload Certificate *</label>
                <input type="file" accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => handleFileChange(type, index, e.target.files[0])}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                {entry?.certificateFile && (
                  <p className="mt-1 text-sm text-gray-600 font-medium">
                    {entry.certificateFile.name}
                  </p>
                )}
              </div>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            {form[type].length > 1 && (
              <div className="text-right">
                <button type="button" onClick={() => removeEntry(type, index)} className="text-red-600 hover:underline text-sm">Remove Entry</button>
              </div>
            )}
          </div>
        );
      })}

      <button type="button" onClick={() => addEntry(type)} className="text-blue-700 hover:text-blue-900 font-medium text-sm mt-2">+ Add More</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 space-y-10 max-w-5xl mx-auto">
      <h3 className="text-2xl font-bold text-blue-900 border-b pb-2">Work Experience</h3>

      {effectiveJobCategory === 'Teaching' && renderSection("Teaching Experience", "teaching")}

      {effectiveJobCategory !== 'Teaching' && renderSection("Industry Experience", "industry")}

      <div className="text-right">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700">Save & Continue</button>
      </div>
    </form>
  );
}


 