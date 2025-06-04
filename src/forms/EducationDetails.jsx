// src/forms/EducationDetails.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../Context/AuthContext";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function EducationDetails({ updateFormData, jobCategory }) {
  const { auth } = useAuth();
  const userId = auth.userId;
  const { jobId } = useParams();

  const [educationList, setEducationList] = useState([
    {
      qualification: "",
      degree: "",
      specialization: "",
      percentage: "",
      year: "",
      school: "",
      university: "",
      mode: "",
      type: "",
      arrears: "",
    },
  ]);
  const [eligibilityTest, setEligibilityTest] = useState([]);
  const [extraCurricular, setExtraCurricular] = useState([]);
  const [achievements, setAchievements] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const res = await axiosInstance.get(`/api/education/get`, {
          params: { userId},
        });
        const data = res.data;
        if (data) {
          if (data.educationList?.length) setEducationList(data.educationList);
          if (data.eligibilityTest) setEligibilityTest(data.eligibilityTest);
          if (data.extraCurricular) setExtraCurricular(data.extraCurricular);
          if (data.achievements) setAchievements(data.achievements);
        }
      } catch (err) {
        console.error("Error loading education data:", err);
      }
    };

    if (userId) fetchEducationData();
  }, [userId, jobId]);

  const handleChange = (index, field, value) => {
    const updated = [...educationList];
    updated[index][field] = value;
    setEducationList(updated);
  };

  const handleCheckboxGroup = (setter, value) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const addRow = () => {
    setEducationList((prev) => [
      ...prev,
      {
        qualification: "",
        degree: "",
        specialization: "",
        percentage: "",
        year: "",
        school: "",
        university: "",
        mode: "",
        type: "",
        arrears: "",
      },
    ]);
  };

  const removeRow = (index) => {
    setEducationList((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = educationList.map((edu) => {
      const entryErrors = {};
      const requiredFields = [
        "qualification",
        "degree",
        "specialization",
        "percentage",
        "year",
        "school",
        "university",
        "mode",
        "type",
      ];
      requiredFields.forEach((field) => {
        if (!edu[field]) entryErrors[field] = "This field is required.";
      });
      if (edu.percentage && (isNaN(edu.percentage) || edu.percentage < 0 || edu.percentage > 100)) {
        entryErrors.percentage = "Percentage must be between 0 and 100.";
      }
      if (edu.arrears && (isNaN(edu.arrears) || edu.arrears < 0)) {
        entryErrors.arrears = "Arrears must be a positive number.";
      }
      return entryErrors;
    });
    setErrors(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    if (!validate()) return;

    const formData = {
      userId,
      educationList,
      eligibilityTest: jobCategory === "Teaching" ? eligibilityTest : [],
      extraCurricular: jobCategory === "Teaching" ? extraCurricular : [],
      achievements,
    };

    try {
      const res = await axiosInstance.post("/api/education/save", formData);
      if (res.status === 200 || res.status === 201) {
        updateFormData && updateFormData(formData);
        toast.success('Educational Details updated Successfully');
      } else {
        toast.error("Failed to save. Please try again.");
      }
    } catch (err) {
      console.error("Error saving education data:", err);
      toast.error("Failed to save. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {jobCategory === "Teaching" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold">Eligibility Test Passed</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["NET", "SET", "SLET"].map((test) => (
                <label key={test} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={eligibilityTest.includes(test)}
                    onChange={() => handleCheckboxGroup(setEligibilityTest, test)}
                  />
                  {test}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold">Extra Curricular Activities</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["NSS", "NCC", "NAAC", "IQAC", "ISO"].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={extraCurricular.includes(item)}
                    onChange={() => handleCheckboxGroup(setExtraCurricular, item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {educationList.map((edu, index) => (
        <div
          key={index}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 border-b pb-6 relative"
        >
          {[
            ["qualification", "Qualification", "select", ["10th", "12th", "UG", "PG", "Ph.D", "Certificate Course"]],
            ["degree", "Degree"],
            ["specialization", "Specialization"],
            ["percentage", "Percentage"],
            ["year", "Year of Passing"],
            ["school", "Institution / School"],
            ["university", "Board / University"],
            ["mode", "Mode", "select", ["Regular", "Correspondence"]],
            ["type", "Type", "select", ["Part Time", "Full Time"]],
            ["arrears", "No. of Arrears"]
          ].map(([field, label, type = "input", options]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              {type === "select" ? (
                <select
                  value={edu[field]}
                  onChange={(e) => handleChange(index, field, e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">-- Select --</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field === "percentage" || field === "arrears" ? "number" : "text"}
                  value={edu[field]}
                  onChange={(e) => handleChange(index, field, e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              )}
              {errors[index]?.[field] && (
                <p className="text-sm text-red-600">{errors[index][field]}</p>
              )}
            </div>
          ))}
          <div className="col-span-full text-right mt-4">
            <button type="button" onClick={() => removeRow(index)} className="text-red-600 text-sm">Remove</button>
          </div>
        </div>
      ))}

      <button type="button" onClick={addRow} className="text-blue-600 font-semibold text-sm hover:underline">
        + Add More
      </button>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Academic Achievements / Awards</label>
        <textarea
          value={achievements}
          onChange={(e) => setAchievements(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Write here..."
        />
      </div>

      <div className="text-right">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow">
          Save & Continue
        </button>
      </div>
    </form>
  );
}