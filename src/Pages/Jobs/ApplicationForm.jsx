import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from '../../Context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';

import PersonalDetails from '../../forms/PersonalDetails';
import EducationDetails from '../../forms/EducationDetails';
import ResearchContribution from '../../forms/ResearchContribution';
import OtherDetails from '../../forms/OtherDetails';
import WorkExperience from '../../forms/WorkExperience';
import Declaration from '../../forms/Declaration';

export default function ApplicationForm() {
  const { jobId } = useParams();
  const { auth } = useAuth();
  const userId = auth.userId;

  const storageKey = `applicationFormData_${userId}_${jobId}`;
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [jobCategory, setJobCategory] = useState('Teaching');
  const sectionRefs = useRef([]);

  const fetchJobsByID = async () => {
    try {
      const res = await axiosInstance.get(`/api/jobPost/getJobs/${jobId}`);
      const job = res.data;
      setJobCategory(job.jobCategory);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed);
      setJobCategory(parsed?.personalDetails?.jobCategory || 'Teaching');
    }
    AOS.init({ duration: 700, once: true });
  }, [storageKey]);

  useEffect(() => {
    fetchJobsByID();
  }, [jobId]);

  const scrollToSection = (index) => {
    if (sectionRefs.current[index]) {
      sectionRefs.current[index].scrollIntoView({ behavior: 'smooth' });
    }
  };

  const updateSection = (sectionKey, data) => {
    const updated = { ...formData, [sectionKey]: data };
    setFormData(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    if (sectionKey === 'personalDetails' && data?.jobCategory) {
      setJobCategory(data.jobCategory);
    }

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    scrollToSection(nextStep);
  };

  const steps = ['Personal Details', 'Educational Details'];
  const teachingFlow = ['Research Contribution', 'Work Experience', 'Other Information', 'Declaration & Upload Resume'];
  const nonTeachingFlow = ['Work Experience', 'Other Information', 'Declaration & Upload Resume'];
  const fullSteps = steps.concat(jobCategory === 'Teaching' ? teachingFlow : nonTeachingFlow);

  const renderSection = (stepIndex, title, Component, dataKey) => {
    if (currentStep >= stepIndex) {
      return (
        <section
          key={stepIndex}
          ref={(el) => (sectionRefs.current[stepIndex] = el)}
          className="bg-white shadow-md rounded-xl p-4 sm:p-6 mb-8 border"
          data-aos="fade-up"
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">
            {stepIndex}. {title}
          </h2>
          <Component
            data={formData[dataKey] || {}}
            updateFormData={(data) => updateSection(dataKey, data)}
            jobCategory={jobCategory}
            userId={userId}
            jobId={jobId}
          />
        </section>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 text-gray-800">
      {/* Progress Bar */}
      <div className="sticky top-0 z-30 bg-white shadow mb-6 sm:mb-8 p-4 sm:rounded-b-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-900">Application Progress</h1>
          <div className="flex flex-wrap gap-2">
            {fullSteps.map((step, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                  idx + 1 <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {idx + 1}. {step}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Form Sections */}
      {renderSection(1, 'Personal Details', PersonalDetails, 'personalDetails')}
      {renderSection(2, 'Educational Details (10th & 12th Mandatory)', EducationDetails, 'educationDetails')}
      {jobCategory === 'Teaching' &&
        renderSection(3, 'Research Contribution', ResearchContribution, 'researchContribution')}
      {renderSection(jobCategory === 'Teaching' ? 4 : 3, 'Work Experience', WorkExperience, 'workExperience')}
      {renderSection(jobCategory === 'Teaching' ? 5 : 4, 'Other Information', OtherDetails, 'otherDetails')}
      {renderSection(jobCategory === 'Teaching' ? 6 : 5, 'Declaration & Upload Resume', Declaration, 'declaration')}
    </div>
  );
}