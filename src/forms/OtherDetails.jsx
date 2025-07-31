import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from "../Context/AuthContext";
import { toast } from 'react-toastify';
import { FaEye, FaTrash } from 'react-icons/fa';

export default function OtherDetails({ updateFormData }) {
  const nextSectionRef = useRef(null);
  const { auth } = useAuth();
  const userId = auth?.userId;

  const documentList = [
    "10th Marksheet", "12th Marksheet", "UG Degree Certificate",
    "UG Consolidated Marksheet", "PG Degree Certificate", "PG Consolidated Marksheet",
    "Diploma Certificate (if any)", "Aadhar Card", "PAN Card",
    "Recent Payslip (Current Org)", "Appraisal Letter (Current Org)",
    "Appointment Letter (Current Org)", "Relieving/Experience Letter (Previous Org)",
    "Offer Letter (Previous Org)", "Additional Documents"
  ];

  const [form, setForm] = useState({
    reference1: { name: '', address: '', designation: '', mobile: '', email: '' },
    reference2: { name: '', address: '', designation: '', mobile: '', email: '' },
    lastPay: '', expectedPay: '', joiningTime: '', relativesAtPSG: '',
    attendedPSGInterview: '', vacancySource: '', otherComments: '',
    documents: {},
  });

  const [existingFiles, setExistingFiles] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchData() {
      if (!userId) return;
      try {
        const res = await axiosInstance.get(`/api/otherDetails/${userId}`);
        if (res.data) {
          const { reference1, reference2, documents = {}, ...rest } = res.data;
          setForm((prev) => ({
            ...prev,
            ...rest,
            reference1: reference1 || prev.reference1,
            reference2: reference2 || prev.reference2,
          }));
          setExistingFiles(documents);
        }
      } catch (err) {
        console.error('Failed to fetch other details:', err);
      }
    }
    fetchData();
  }, [userId]);

  const handleChange = (e, ref = null) => {
    const { name, value } = e.target;
    if (ref) {
      setForm((prev) => ({ ...prev, [ref]: { ...prev[ref], [name]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e, docLabel) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [docLabel]: file,
        },
      }));
      e.target.value = null;
    }
  };

  const handleDelete = async (docLabel) => {
    try {
      await axiosInstance.delete(`/api/otherDetails/document/${userId}`, {
        data: { label: docLabel },
      });
      setExistingFiles((prev) => {
        const updated = { ...prev };
        delete updated[docLabel];
        return updated;
      });
      toast.success(`Deleted document: ${docLabel}`);
    } catch (err) {
      console.error('Delete failed', err);
      toast.error('Failed to delete document');
    }
  };

  const handleRemoveNewlySelectedFile = (docLabel) => {
    setForm((prev) => {
      const updatedDocs = { ...prev.documents };
      delete updatedDocs[docLabel];
      return { ...prev, documents: updatedDocs };
    });
  };

  const validateFields = () => {
    const required = ['joiningTime', 'attendedPSGInterview', 'vacancySource', 'expectedPay', 'lastPay'];
    const newErrors = {};
    let valid = true;
    required.forEach((field) => {
      if (!String(form[field] || '').trim()) {
        newErrors[field] = true;
        valid = false;
      }
    });
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error('User ID missing');
    if (!validateFields()) return toast.error('Please fill all mandatory fields.');

    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('reference1', JSON.stringify(form.reference1));
      formData.append('reference2', JSON.stringify(form.reference2));
      formData.append('lastPay', form.lastPay);
      formData.append('expectedPay', form.expectedPay);
      formData.append('joiningTime', form.joiningTime);
      formData.append('relativesAtPSG', form.relativesAtPSG);
      formData.append('attendedPSGInterview', form.attendedPSGInterview);
      formData.append('vacancySource', form.vacancySource);
      formData.append('otherComments', form.otherComments);

      Object.entries(form.documents).forEach(([label, file]) => {
        if (file instanceof File) {
          formData.append('documents', file, `${label}-${file.name}`);
        }
      });

      const res = await axiosInstance.post('/api/otherDetails', formData);
      if (res.data) {
        toast.success('Other Details updated successfully');
        updateFormData && updateFormData(res.data);
        nextSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Failed to save other details:', err);
      toast.error('Error saving details. Try again.');
    }
  };

  const getDownloadLink = (filename) => {
    if (!filename) return null;
    return `${import.meta.env.VITE_API_BASE_URL}/${filename}`;
  };

  const renderReferenceFields = (refKey, title) => (
    <div>
      <h3 className="text-lg font-semibold text-blue-800 mb-2">{title}</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['name', 'address', 'designation', 'mobile', 'email'].map((field) => (
          <div key={field}>
            <label htmlFor={`${refKey}-${field}`} className="block font-medium mb-1 capitalize">{field}</label>
            <input
              id={`${refKey}-${field}`}
              name={field}
              type="text"
              value={form[refKey]?.[field] ?? ''}
              onChange={(e) => handleChange(e, refKey)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-10 space-y-10 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 border-b pb-4">Other Details</h2>
      {renderReferenceFields('reference1', 'Reference 1')}
      {renderReferenceFields('reference2', 'Reference 2')}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[{ id: 'lastPay', label: 'Last Drawn Pay', placeholder: 'If fresher, enter 0' }, { id: 'expectedPay', label: 'Expected Pay', placeholder: 'If fresher, enter 0' }, { id: 'joiningTime', label: 'Notice Period' }].map(({ id, label, placeholder }) => (
          <div key={id}>
            <label className="block font-medium mb-1">{label} <span className="text-red-600">*</span></label>
            <input
              id={id}
              name={id}
              value={form[id]}
              onChange={handleChange}
              placeholder={placeholder}
              className={`w-full border rounded px-3 py-2 ${errors[id] ? 'border-red-500' : ''}`}
            />
            {errors[id] && <p className="text-red-600 text-sm">Required</p>}
          </div>
        ))}
      </div>

      <div>
        <label className="block font-medium mb-1">Close relatives at PSG </label>
        <textarea name="relativesAtPSG" value={form.relativesAtPSG} onChange={handleChange} rows={3} className="w-full border rounded px-3 py-2" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {[{ id: 'attendedPSGInterview', label: 'Attended PSG Interview', options: ['Yes', 'No'] }, { id: 'vacancySource', label: 'Source of Vacancy', options: ['Newspaper', 'Website', 'Social Media', 'Friends', 'Others'] }].map(({ id, label, options }) => (
          <div key={id}>
            <label className="block font-medium mb-1">{label} <span className="text-red-600">*</span></label>
            <select
              name={id}
              value={form[id]}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 ${errors[id] ? 'border-red-500' : ''}`}
            >
              <option value="">Select</option>
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            {errors[id] && <p className="text-red-600 text-sm">Required</p>}
          </div>
        ))}
      </div>

      <div>
        <label className="block font-medium mb-1">Any other comments </label>
        <textarea name="otherComments" value={form.otherComments} onChange={handleChange} rows={3} className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-blue-800">Upload Documents </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border">Document Name</th>
                <th className="p-3 border">Upload</th>
                <th className="p-3 border">Selected / Existing File</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documentList.map((doc) => {
                const existing = existingFiles[doc];
                const selected = form.documents[doc];
                const previewURL = getDownloadLink(existing);

                const isPreviewable = (file) => {
                  const type = file?.type || '';
                  return /pdf|image|msword|officedocument/.test(type);
                };

                return (
                  <tr key={doc} className="border-t">
                    <td className="p-3 border font-medium text-gray-800">{doc}</td>
                    <td className="p-3 border">
                      <label htmlFor={`doc-${doc}`} className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-700">
                        Choose File
                      </label>
                      <input
                        id={`doc-${doc}`}
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, doc)}
                      />
                    </td>
                    <td className="p-3 border text-gray-700">
                      {selected?.name ? (
                        <div className="flex items-center gap-2">
                          <span>{selected.name}</span>
                          <button type="button" onClick={() => handleRemoveNewlySelectedFile(doc)} className="text-red-600 hover:text-red-800 text-xs">Remove</button>
                        </div>
                      ) : existing ? (
                        <span className="text-gray-700">{existing}</span>
                      ) : (
                        <span className="text-gray-400">No file chosen</span>
                      )}
                    </td>
                    <td className="p-3 border flex gap-3 items-center">
                      {selected && isPreviewable(selected) && (
                        <a href={URL.createObjectURL(selected)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800" title="Preview uploaded file">
                          <FaEye />
                        </a>
                      )}
                      {existing && (
                        <>
                          <a href={previewURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800" title="View existing file">
                            <FaEye />
                          </a>
                          <button
                            onClick={() => handleDelete(doc)}
                            type="button"
                            className="text-red-600 hover:text-red-800"
                            title="Delete existing file"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-right">
        <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded shadow">
          Save & Continue
        </button>
      </div>

      <div ref={nextSectionRef}></div>
    </form>
  );
}
 