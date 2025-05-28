import React, { useState, useEffect } from 'react';

export default function EducationDetails({ data, updateFormData, jobCategory, jobId }) {
  const [educationList, setEducationList] = useState([
    {
      qualification: '', degree: '', specialization: '', percentage: '',
      year: '', school: '', university: '', mode: '', type: '', arrears: ''
    }
  ]);
  const [eligibilityTest, setEligibilityTest] = useState([]);
  const [extraCurricular, setExtraCurricular] = useState([]);
  const [achievements, setAchievements] = useState('');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(`applicationData-${jobId}`));
    if (savedData?.educationList) setEducationList(savedData.educationList);
    if (savedData?.eligibilityTest) setEligibilityTest(savedData.eligibilityTest);
    if (savedData?.extraCurricular) setExtraCurricular(savedData.extraCurricular);
    if (savedData?.achievements) setAchievements(savedData.achievements);
  }, [jobId]);

  const handleChange = (index, field, value) => {
    const updated = [...educationList];
    updated[index][field] = value;
    setEducationList(updated);
  };

  const handleCheckboxGroup = (setter, value) => {
    setter(prev =>
      prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]
    );
  };

  const addRow = () => {
    setEducationList([...educationList, {
      qualification: '', degree: '', specialization: '', percentage: '',
      year: '', school: '', university: '', mode: '', type: '', arrears: ''
    }]);
  };

  const removeRow = (index) => {
    const updated = [...educationList];
    updated.splice(index, 1);
    setEducationList(updated);
  };

  const validate = () => {
    const newErrors = educationList.map(edu => {
      const entryErrors = {};
      ['qualification', 'degree', 'specialization', 'percentage', 'year', 'school', 'university', 'mode', 'type'].forEach(field => {
        if (!edu[field]) entryErrors[field] = 'Required';
      });
      return entryErrors;
    });
    setErrors(newErrors);
    return newErrors.every(e => Object.keys(e).length === 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = { educationList, eligibilityTest, extraCurricular, achievements };
    updateFormData(formData);
    localStorage.setItem(`applicationData-${jobId}`, JSON.stringify({ ...data, ...formData }));

    const nextSection = document.querySelector('#research-section');
    if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-10 space-y-10">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Educational Details</h2>

      {jobCategory === 'Teaching' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2">Eligibility Test</label>
            <div className="flex flex-wrap gap-4">
              {['NET', 'SET', 'SLET'].map(test => (
                <label key={test} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={eligibilityTest.includes(test)}
                    onChange={() => handleCheckboxGroup(setEligibilityTest, test)}
                  /> {test}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Extra Curricular Activities</label>
            <div className="flex flex-wrap gap-4">
              {['NSS', 'NCC', 'NAAC', 'IQAC', 'ISO'].map(item => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={extraCurricular.includes(item)}
                    onChange={() => handleCheckboxGroup(setExtraCurricular, item)}
                  /> {item}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {educationList.map((edu, index) => (
        <div key={index} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 border-b pb-6 relative">
          {[
            ['qualification', 'Qualification *', 'select', ['10th', '12th', 'UG', 'PG', 'Ph.D', 'Certificate Course']],
            ['degree', 'Degree *'],
            ['specialization', 'Specialization *'],
            ['percentage', 'Percentage *'],
            ['year', 'Year of Completion *'],
            ['school', 'School / College *'],
            ['university', 'University *'],
            ['mode', 'Regular / Correspondence *', 'select', ['Regular', 'Correspondence']],
            ['type', 'Part-Time / Full-Time *', 'select', ['Part Time', 'Full Time']],
            ['arrears', 'No of Arrears']
          ].map(([field, label, type = 'input', options]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              {type === 'select' ? (
                <select
                  value={edu[field]}
                  onChange={e => handleChange(index, field, e.target.value)}
                  className="input w-full border border-gray-300 rounded px-3 py-2"
                  required={label.includes('*')}
                >
                  <option value="">----------</option>
                  {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input
                  value={edu[field]}
                  onChange={e => handleChange(index, field, e.target.value)}
                  className="input w-full border border-gray-300 rounded px-3 py-2"
                  required={label.includes('*')}
                />
              )}
              {errors[index]?.[field] && (
                <span className="text-sm text-red-600">{errors[index][field]}</span>
              )}
            </div>
          ))}
          <div className="col-span-full text-right mt-4">
            <button
              type="button"
              onClick={() => removeRow(index)}
              className="text-red-600 border border-red-300 px-4 py-1 rounded hover:bg-red-50 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="text-blue-600 font-semibold text-sm hover:underline"
      >
        + Add More
      </button>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Special Achievements in academics, if any (Not exceeding 300 words)
        </label>
        <textarea
          value={achievements}
          onChange={(e) => setAchievements(e.target.value)}
          rows={3}
          className="input w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Write here..."
        />
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
        >
          Save & Continue
        </button>
      </div>
    </form>
  );
}





