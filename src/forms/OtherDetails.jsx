import React, { useState, useEffect, useRef } from 'react';

export default function OtherDetails({ data, updateFormData }) {
  const nextSectionRef = useRef(null);

  const [form, setForm] = useState({
    reference1: { name: '', address: '', designation: '', mobile: '', email: '' },
    reference2: { name: '', address: '', designation: '', mobile: '', email: '' },
    lastPay: '',
    expectedPay: '',
    joiningTime: '',
    relativesAtPSG: '',
    attendedPSGInterview: '',
    vacancySource: '',
    otherComments: '',
    resume: null,
  });

  useEffect(() => {
    if (data) setForm((prev) => ({ ...prev, ...data }));
  }, [data]);

  const handleChange = (e, ref = null) => {
    const { name, value } = e.target;
    if (ref) {
      setForm((prev) => ({
        ...prev,
        [ref]: { ...prev[ref], [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData(form);
    localStorage.setItem('otherDetails', JSON.stringify(form));
    setTimeout(() => {
      nextSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const renderReferenceFields = (refKey, title) => (
    <div>
      <h3 className="text-lg font-semibold text-blue-800 mb-2">{title}</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['name', 'address', 'designation', 'mobile', 'email'].map((field) => {
          const inputId = `${refKey}-${field}`;
          return (
            <div key={field}>
              <label htmlFor={inputId} className="block font-medium mb-1 capitalize">
                {field}
              </label>
              <input
                id={inputId}
                name={field}
                type="text"
                value={form[refKey][field]}
                onChange={(e) => handleChange(e, refKey)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-10 space-y-10">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">4. Other Details</h2>

      {renderReferenceFields('reference1', 'Reference 1')}
      {renderReferenceFields('reference2', 'Reference 2')}

      {/* Pay & Joining */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label htmlFor="lastPay" className="block font-medium mb-1">Last Drawn Pay</label>
          <input
            id="lastPay"
            type="number"
            name="lastPay"
            value={form.lastPay}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            min="0"
          />
        </div>
        <div>
          <label htmlFor="expectedPay" className="block font-medium mb-1">Expected Pay</label>
          <input
            id="expectedPay"
            type="number"
            name="expectedPay"
            value={form.expectedPay}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            min="0"
          />
        </div>
        <div>
          <label htmlFor="joiningTime" className="block font-medium mb-1">Joining Time Required</label>
          <input
            id="joiningTime"
            type="text"
            name="joiningTime"
            value={form.joiningTime}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Relatives */}
      <div>
        <label htmlFor="relativesAtPSG" className="block font-medium mb-1">
          Close relatives employed in PSG Institutions (Name, Relationship, Designation)
        </label>
        <textarea
          id="relativesAtPSG"
          name="relativesAtPSG"
          value={form.relativesAtPSG}
          onChange={handleChange}
          rows={3}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Select Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="attendedPSGInterview" className="block font-medium mb-1">
            Attended PSG Interview
          </label>
          <select
            id="attendedPSGInterview"
            name="attendedPSGInterview"
            value={form.attendedPSGInterview}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div>
          <label htmlFor="vacancySource" className="block font-medium mb-1">
            Source of Vacancy
          </label>
          <select
            id="vacancySource"
            name="vacancySource"
            value={form.vacancySource}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="Newspaper">Newspaper</option>
            <option value="Website">Website</option>
            <option value="Social Media">Social Media</option>
            <option value="Friends">Friends</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>

      {/* Comments */}
      <div>
        <label htmlFor="otherComments" className="block font-medium mb-1">Any other comments</label>
        <textarea
          id="otherComments"
          name="otherComments"
          value={form.otherComments}
          onChange={handleChange}
          rows={3}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Resume Upload */}
      <div>
        <label htmlFor="resume" className="block font-medium mb-1 text-gray-700">
          Upload Resume <span className="text-red-600">*</span>
        </label>
        <input
          id="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          required
          aria-required="true"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Submit */}
      <div className="text-right">
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save & Continue
        </button>
      </div>

      <div ref={nextSectionRef}></div>
    </form>
  );
}
