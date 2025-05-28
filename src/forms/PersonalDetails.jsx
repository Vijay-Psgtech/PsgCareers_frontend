import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Calendar, Phone, Mail, Home } from 'lucide-react';

export default function PersonalDetails({ updateFormData }) {
  const { id: userId } = useParams();

  const [form, setForm] = useState({
    fullName: '', dob: '', gender: '', motherTongue: '', religion: '', community: '', category: '', maritalStatus: '',
    spouseName: '', fatherName: '', physicallyChallenged: '', natureOfChallenge: '', aadhar: '', pan: '', mobile: '',
    email: '', permanentAddress: '', permanentCity: '', permanentState: '', permanentCountry: '', permanentPincode: '',
    sameAsPermanent: false, communicationAddress: '', communicationCity: '', communicationState: '',
    communicationCountry: '', communicationPincode: '', languagesKnown: [], resume: null, photo: null
  });

  useEffect(() => {
    const stored = localStorage.getItem(`user_${userId}_personal`);
    if (stored) {
      setForm(JSON.parse(stored));
    }
  }, [userId]);

  const updateAndPersist = (updatedForm) => {
    setForm(updatedForm);
    localStorage.setItem(`user_${userId}_personal`, JSON.stringify(updatedForm));
  };

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file && file.size > 20 * 1024 * 1024) {
        alert(`${name === 'photo' ? 'Photo' : 'Resume'} must be under 20MB`);
        return;
      }
      updateAndPersist({ ...form, [name]: file });
    } else {
      updateAndPersist({
        ...form,
        [name]: type === 'checkbox' ? checked : value,
        ...(name === 'sameAsPermanent' && checked ? {
          communicationAddress: form.permanentAddress,
          communicationCity: form.permanentCity,
          communicationState: form.permanentState,
          communicationCountry: form.permanentCountry,
          communicationPincode: form.permanentPincode
        } : {})
      });
    }
  };

  const handleLanguageChange = (index, field, value) => {
    const updated = [...form.languagesKnown];
    updated[index] = { ...updated[index], [field]: value };
    updateAndPersist({ ...form, languagesKnown: updated });
  };

  const addLanguage = () => {
    updateAndPersist({
      ...form,
      languagesKnown: [...form.languagesKnown, { language: '', read: false, write: false, speak: false }]
    });
  };

  const removeLanguage = index => {
    const updated = [...form.languagesKnown];
    updated.splice(index, 1);
    updateAndPersist({ ...form, languagesKnown: updated });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;
    const aadharRegex = /^\d{12}$/;
    const panRegex = /^[A-Z]{5}\d{4}[A-Z]$/;
    const pincodeRegex = /^\d{6}$/;

    if (!form.fullName.trim()) return 'Full Name is required';
    if (!form.dob) return 'Date of Birth is required';
    if (!form.gender) return 'Please select Gender';
    if (!form.category.trim()) return 'Category is required';
    if (!form.maritalStatus) return 'Marital Status is required';

    if (!mobileRegex.test(form.mobile.trim())) return 'Enter a valid 10-digit Mobile Number';
    if (!emailRegex.test(form.email.trim())) return 'Enter a valid Email address';

    if (form.aadhar && !aadharRegex.test(form.aadhar.trim())) return 'Aadhar must be a 12-digit number';
    if (form.pan && !panRegex.test(form.pan.trim())) return 'PAN must be in valid format (e.g., ABCDE1234F)';

    if (!form.permanentAddress.trim()) return 'Permanent Address is required';
    if (form.permanentPincode && !pincodeRegex.test(form.permanentPincode.trim())) return 'Permanent Pincode must be 6 digits';

    if (!form.communicationAddress.trim()) return 'Communication Address is required';
    if (form.communicationPincode && !pincodeRegex.test(form.communicationPincode.trim())) return 'Communication Pincode must be 6 digits';

    for (let i = 0; i < form.languagesKnown.length; i++) {
      const lang = form.languagesKnown[i];
      if (!lang.language.trim()) return `Language ${i + 1} is missing a name`;
      if (!lang.read && !lang.write && !lang.speak) return `Select at least one skill for language ${lang.language || i + 1}`;
    }

    return null;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const error = validateForm();
    if (error) return alert(error);
    updateFormData(form);
    alert("Personal details saved successfully!");
  };

  const renderLabeledInput = (label, name, type = 'text', required = false, icon = null) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800">
        {icon && <span className="text-gray-400 mr-2">{icon}</span>}
        <input
          type={type}
          name={name}
          value={form[name] || ''}
          onChange={handleChange}
          required={required}
          className="w-full bg-transparent focus:outline-none text-sm text-gray-800 dark:text-white"
        />
      </div>
    </div>
  );

  const renderSelect = (label, name, options, required = false) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <select
        name={name}
        value={form[name] || ''}
        onChange={handleChange}
        required={required}
        className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
      >
        <option value="">Select</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 shadow-xl rounded-xl p-10 space-y-10 max-w-7xl mx-auto">
      <h3 className="text-4xl font-extrabold text-blue-800 dark:text-blue-300 border-b pb-3">Personal Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderLabeledInput('Full Name', 'fullName', 'text', true, <User size={16} />)}
        {renderLabeledInput('Date of Birth', 'dob', 'date', true, <Calendar size={16} />)}
        {renderSelect('Gender', 'gender', ['Male', 'Female', 'Transgender'], true)}
        {renderLabeledInput('Mother Tongue', 'motherTongue')}
        {renderLabeledInput('Religion', 'religion')}
        {renderLabeledInput('Community', 'community')}
        {renderSelect('Category', 'category', ['FC', 'BC', 'OBC', 'BMC', 'MBC', 'SC', 'ST', 'DNC', 'OTHERS'], true)}
        {renderSelect('Marital Status', 'maritalStatus', ['Single', 'Married', 'Divorced', 'Widow'], true)}
        {renderLabeledInput('Spouse Name', 'spouseName')}
        {renderLabeledInput("Father's Name", 'fatherName')}
        {renderSelect('Physically Challenged', 'physicallyChallenged', ['Yes', 'No'])}
        {form.physicallyChallenged === 'Yes' && renderLabeledInput('Nature of Challenge', 'natureOfChallenge')}
        {renderLabeledInput('Aadhar Number', 'aadhar')}
        {renderLabeledInput('PAN Number', 'pan')}
        {renderLabeledInput('Mobile Number', 'mobile', 'text', true, <Phone size={16} />)}
        {renderLabeledInput('Email', 'email', 'email', true, <Mail size={16} />)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Photo (Max 20MB)</label>
          <input type="file" name="photo" accept="image/jpeg" onChange={handleChange} className="text-sm" />
          {form.photo && <p className="text-sm text-green-600 mt-2">{form.photo.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Resume (PDF, Max 20MB)</label>
          <input type="file" name="resume" accept="application/pdf" onChange={handleChange} className="text-sm" />
          {form.resume && <p className="text-sm text-green-600 mt-2">{form.resume.name}</p>}
        </div>
      </div>

      <h4 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Permanent Address</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderLabeledInput('Address', 'permanentAddress', 'text', true, <Home size={16} />)}
        {renderLabeledInput('City', 'permanentCity')}
        {renderLabeledInput('State', 'permanentState')}
        {renderLabeledInput('Country', 'permanentCountry')}
        {renderLabeledInput('Pincode', 'permanentPincode')}
      </div>

      <label className="flex items-center gap-2 mt-4 text-gray-700 dark:text-gray-300">
        <input type="checkbox" name="sameAsPermanent" checked={form.sameAsPermanent} onChange={handleChange} />
        Same as Permanent Address
      </label>

      <h4 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Communication Address</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderLabeledInput('Address', 'communicationAddress', 'text', true)}
        {renderLabeledInput('City', 'communicationCity')}
        {renderLabeledInput('State', 'communicationState')}
        {renderLabeledInput('Country', 'communicationCountry')}
        {renderLabeledInput('Pincode', 'communicationPincode')}
      </div>

      <h4 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Languages Known</h4>
      <div className="space-y-4">
        {form.languagesKnown.map((lang, index) => (
          <div key={index} className="flex flex-wrap items-center gap-4">
            <input
              placeholder="Language"
              value={lang.language}
              onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded px-4 py-2 w-40"
            />
            {['read', 'write', 'speak'].map(skill => (
              <label key={skill} className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={lang[skill]}
                  onChange={(e) => handleLanguageChange(index, skill, e.target.checked)}
                /> {skill.charAt(0).toUpperCase() + skill.slice(1)}
              </label>
            ))}
            <button type="button" onClick={() => removeLanguage(index)} className="text-red-600 text-sm">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addLanguage} className="text-blue-600 text-sm hover:underline">
          + Add Language
        </button>
      </div>

      <div className="text-right">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow">
          Save & Continue
        </button>
      </div>
    </form>
  );
}
