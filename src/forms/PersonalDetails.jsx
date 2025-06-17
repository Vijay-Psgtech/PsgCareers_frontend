import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { toast } from "react-toastify";
dayjs.extend(duration);

export default function PersonalDetails({updateFormData}) {
  const { jobId } = useParams();
  const { auth } = useAuth();
  const userId = auth.userId;

  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    gender: "",
    motherTongue: "",
    religion: "",
    community: "",
    category: "",
    maritalStatus: "",
    spouseName: "",
    fatherName: "",
    physicallyChallenged: "",
    natureOfChallenge: "",
    aadhar: "",
    pan: "",
    mobile: "",
    email: "",
    permanentAddress: "",
    permanentCity: "",
    permanentState: "",
    permanentCountry: "",
    permanentPincode: "",
    sameAsPermanent: false,
    communicationAddress: "",
    communicationCity: "",
    communicationState: "",
    communicationCountry: "",
    communicationPincode: "",
    languagesKnown: [],
    resume: null,
    photo: null,
  });

  const [age, setAge] = useState({ years: "", months: "", days: "" });

  // Calculate age from DOB
  useEffect(() => {
    if (form.dob) {
      const today = dayjs();
      const dobDate = dayjs(form.dob);
      const diffInMonths = today.diff(dobDate, "month");
      const years = Math.floor(diffInMonths / 12);
      const months = diffInMonths % 12;
      const days = today.date() - dobDate.date();

      setAge({
        years,
        months: months < 0 ? 0 : months,
        days: days < 0 ? 0 : days,
      });
    } else {
      setAge({ years: "", months: "", days: "" });
    }
  }, [form.dob]);

  // Fetch saved personal details
  useEffect(() => {
    const fetchData = async () => {
      if (!userId ) return;
      try {
        const res = await axiosInstance.get(
          `/api/personalDetails/${userId}`
        );
        const data = res.data;
        const formatDate = (date) => {
          return date ? new Date(date).toISOString().split('T')[0] : '';
        }

        setForm((prev) => ({
          ...prev,
          ...data,
          dob: formatDate(data.dob),
          languagesKnown: Array.isArray(data.languagesKnown)
            ? data.languagesKnown
            : [],
          sameAsPermanent:
            data.communicationAddress === data.permanentAddress &&
            data.communicationCity === data.permanentCity &&
            data.communicationState === data.permanentState &&
            data.communicationCountry === data.permanentCountry &&
            data.communicationPincode === data.permanentPincode,
          photo: null,
          resume: null,
        }));
      } catch (err) {
        console.error("Error fetching personal details:", err);
      }
    };
    fetchData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file && file.size > 20 * 1024 * 1024) {
        alert(`${name === "photo" ? "Photo" : "Resume"} must be under 20MB`);
        return;
      }
      setForm((prev) => ({ ...prev, [name]: file }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "sameAsPermanent" && checked
        ? {
            communicationAddress: prev.permanentAddress,
            communicationCity: prev.permanentCity,
            communicationState: prev.permanentState,
            communicationCountry: prev.permanentCountry,
            communicationPincode: prev.permanentPincode,
          }
        : name === "sameAsPermanent" && !checked
        ? {
            communicationAddress: "",
            communicationCity: "",
            communicationState: "",
            communicationCountry: "",
            communicationPincode: "",
          }
        : {}),
    }));
  };

  const handleLanguageChange = (index, field, value) => {
    const updated = [...form.languagesKnown];
    updated[index] = { ...updated[index], [field]: value };
    setForm((prev) => ({ ...prev, languagesKnown: updated }));
  };

  const addLanguage = () => {
    setForm((prev) => ({
      ...prev,
      languagesKnown: [
        ...prev.languagesKnown,
        { language: "", read: false, write: false, speak: false },
      ],
    }));
  };

  const removeLanguage = (index) => {
    const updated = [...form.languagesKnown];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, languagesKnown: updated }));
  };

  const validateForm = (form) => {
  const errors = {};

  if (form.physicallyChallenged === "Yes" && !form.natureOfChallenge?.trim()) {
    errors.natureOfChallenge = "Nature of Challenge is required";
  }

  if (!form.aadhar?.match(/^\d{12}$/)) {
    errors.aadhar = "Aadhar must be a 12-digit number";
  }

  if (!form.pan?.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
    errors.pan = "Invalid PAN format (e.g., ABCDE1234F)";
  }

  if (!form.mobile?.match(/^[6-9]\d{9}$/)) {
    errors.mobile = "Mobile number must be a 10-digit Indian number";
  }

  if (!form.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = "Invalid email format";
  }

  return errors;
};


  const handleSubmit = async (e) => {
  e.preventDefault();

  // === VALIDATIONS ===
  const errors = {};

  if (!form.dob) {
    errors.dob = "Please select your Date of Birth.";
  } else {
    const dobDate = dayjs(form.dob);
    const today = dayjs();
    const ageYears = today.diff(dobDate, "year");
    if (ageYears < 18) {
      errors.dob = "You must be at least 18 years old.";
    }
  }

  if (form.physicallyChallenged === "Yes" && !form.natureOfChallenge?.trim()) {
    errors.natureOfChallenge = "Nature of Challenge is required.";
  }

  if (!form.aadhar?.match(/^\d{12}$/)) {
    errors.aadhar = "Aadhar must be a 12-digit number.";
  }

  if (!form.pan?.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
    errors.pan = "PAN must be in format: ABCDE1234F.";
  }

  if (!form.mobile?.match(/^[6-9]\d{9}$/)) {
    errors.mobile = "Enter a valid 10-digit mobile number.";
  }

  if (!form.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = "Enter a valid email address.";
  }

  // If any errors exist, show the first one
  if (Object.keys(errors).length > 0) {
    const firstError = Object.values(errors)[0];
    alert(firstError);
    return;
  }

  try {
    const submission = { ...form, userId, jobId };
    const formData = new FormData();

    for (const key in submission) {
      if (key === "languagesKnown") {
        formData.append(key, JSON.stringify(submission[key]));
      } else if (submission[key] instanceof File) {
        formData.append(key, submission[key]);
      } else {
        formData.append(key, submission[key] ?? "");
      }
    }

    const response = await axiosInstance.post(
      "/api/personalDetails/save",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (response.status === 200 || response.status === 201) {
      toast.success("Personal Details updated successfully");
      updateFormData(form);
    } else {
      alert("Failed to save personal details.");
    }
  } catch (err) {
    console.error("Submission error:", err);
    if (err.response) {
      alert(`Error: ${err.response.data.message || "Submission failed"}`);
    } else {
      alert("Submission failed. Please try again.");
    }
  }
};
  const renderLabeledInput = (label, name, type = "text", required = false) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={form[name] || ""}
        onChange={handleChange}
        required={required}
        className="w-full border rounded px-4 py-2"
      />
    </div>
  );

  const renderSelect = (label, name, options, required = false) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        
        value={form[name] || ""}
        onChange={handleChange}
        required={required}
        className="w-full border rounded px-4 py-2 bg-white"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-8 space-y-10 max-w-5xl mx-auto"
    >
      <h3 className="text-3xl font-bold text-blue-800 border-b pb-2">
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderLabeledInput("Full Name", "fullName", "text", true)}
        {renderLabeledInput("Date of Birth", "dob", "date", true)}
        <div>
          <label className="block text-sm font-medium mb-1">
            Age (  Months / Days /  Years)
          </label>
          <div className="flex gap-2"> 

            <input
              type="text"
              value={age.months}
              readOnly
              placeholder="Months"
              className="w-1/3 border px-2 py-1 rounded bg-gray-100"
            />
            <input
              type="text"
              value={age.days}
              readOnly
              placeholder="Days"
              className="w-1/3 border px-2 py-1 rounded bg-gray-100"
            />
            <input
              type="text"
              value={age.years}
              readOnly
              placeholder="Years"
              className="w-1/3 border px-2 py-1 rounded bg-gray-100"
            />
            
          
          </div>
        </div>
        {renderSelect(
          "Gender",
          "gender",
          ["Male", "Female", "Transgender"],
          true
        )}
        {renderLabeledInput("Mother Tongue", "motherTongue")}
        {renderLabeledInput("Religion", "religion")}
        {renderLabeledInput("Community", "community")}
        {renderSelect("Category", "category", ["General", "OBC", "SC", "ST"])}
        {renderSelect("Marital Status", "maritalStatus", [
          "Married",
          "Unmarried",
          "Divorced",
          "Widowed",
        ])}
        {form.maritalStatus === "Married" &&
          renderLabeledInput("Spouse Name", "spouseName")}
        {renderLabeledInput("Father's Name", "fatherName")}
        {renderSelect("Physically Challenged", "physicallyChallenged", [
          "Yes",
          "No",
        ])}
        {form.physicallyChallenged === "Yes" &&
          renderLabeledInput("Nature of Challenge", "natureOfChallenge")}
        {renderLabeledInput("Aadhar Number", "aadhar")}
        {renderLabeledInput("PAN Number", "pan")}
        {renderLabeledInput("Mobile Number", "mobile", "tel")}
        {renderLabeledInput("Email", "email", "email")}
      </div>

      <div>
        <h4 className="text-xl font-semibold mb-3">Permanent Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderLabeledInput("Address", "permanentAddress")}
          {renderLabeledInput("City", "permanentCity")}
          {renderLabeledInput("State", "permanentState")}
          {renderLabeledInput("Country", "permanentCountry")}
          {renderLabeledInput("Pincode", "permanentPincode")}
        </div>
      </div>

      <div className="mt-6">
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            name="sameAsPermanent"
            checked={form.sameAsPermanent}
            onChange={handleChange}
          />
          <span>Communication Address Same as Permanent Address</span>
        </label>
      </div>

      {!form.sameAsPermanent && (
        <div className="mt-4">
          <h4 className="text-xl font-semibold mb-3">Communication Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderLabeledInput("Address", "communicationAddress")}
            {renderLabeledInput("City", "communicationCity")}
            {renderLabeledInput("State", "communicationState")}
            {renderLabeledInput("Country", "communicationCountry")}
            {renderLabeledInput("Pincode", "communicationPincode")}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h4 className="text-xl font-semibold mb-3">Languages Known</h4>
        {form.languagesKnown.map((lang, idx) => (
          <div
            key={idx}
            className="border p-4 mb-4 rounded flex flex-col md:flex-row items-center md:space-x-6 space-y-3 md:space-y-0"
          >
            <input
              type="text"
              placeholder="Language"
              value={lang.language || ""}
              onChange={(e) =>
                handleLanguageChange(idx, "language", e.target.value)
              }
              className="border rounded px-3 py-1 flex-grow"
            />
            <label className="inline-flex items-center space-x-1">
              <input
                type="checkbox"
                checked={lang.read || false}
                onChange={(e) =>
                  handleLanguageChange(idx, "read", e.target.checked)
                }
              />
              <span>Read</span>
            </label>
            <label className="inline-flex items-center space-x-1">
              <input
                type="checkbox"
                checked={lang.write || false}
                onChange={(e) =>
                  handleLanguageChange(idx, "write", e.target.checked)
                }
              />
              <span>Write</span>
            </label>
            <label className="inline-flex items-center space-x-1">
              <input
                type="checkbox"
                checked={lang.speak || false}
                onChange={(e) =>
                  handleLanguageChange(idx, "speak", e.target.checked)
                }
              />
              <span>Speak</span>
            </label>
            <button
              type="button"
              onClick={() => removeLanguage(idx)}
              className="text-red-600 font-semibold hover:underline ml-auto md:ml-0"
              aria-label={`Remove language ${lang.language || idx + 1}`}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addLanguage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Language
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Photo Upload */}
  <div>
    <label htmlFor="photo" className="block text-sm font-medium mb-2">
      Photo (Max 2MB)
    </label>
    <input
      id="photo"
      type="file"
      name="photo"
      accept="image/*"
      onChange={handleChange}
      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                 file:rounded file:border-0 file:text-sm file:font-semibold
                 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
    />
    {form.photo && (
      <img
        src={URL.createObjectURL(form.photo)}
        alt="Preview"
        className="mt-2 max-w-xs max-h-48 rounded border border-gray-300"
      />
    )}
  </div>

  {/* Resume Upload */}
  <div>
    <label htmlFor="resume" className="block text-sm font-medium mb-2">
      Resume (Max 2MB)
    </label>
    <input
      id="resume"
      type="file"
      name="resume"
      accept=".pdf,.doc,.docx"
      onChange={handleChange}
      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                 file:rounded file:border-0 file:text-sm file:font-semibold
                 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
    />
    {form.resume && (
      <p className="mt-2 text-sm text-gray-700 font-medium">
        {form.resume.name}
      </p>
    )}
  </div>
</div>

      <div className="mt-10">
        <button
          type="submit"
          className="bg-blue-800 text-white px-8 py-3 rounded font-semibold hover:bg-blue-900"
        >
          Save and Continue
        </button>
      </div>
    </form>
  );
}