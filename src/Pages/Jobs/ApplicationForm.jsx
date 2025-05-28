// src/pages/ApplicationForm.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import PersonalDetails from '../../forms/PersonalDetails'
import EducationDetails from '../../forms/EducationDetails';
import ResearchContribution from '../../forms/ResearchContribution';
import OtherDetails from '../../forms/OtherDetails';
import WorkExperience from '../../forms/WorkExperience';
import Declaration from '../../forms/Declaration';

const mockJobs = [
  { _id: 'job1', jobCategory: 'Teaching' },
  { _id: 'job2', jobCategory: 'Non-Teaching' },
];

export default function ApplicationForm() {
  const { id } = useParams();
  const storageKey = `applicationFormData_${id}`;
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [jobCategory, setJobCategory] = useState('Teaching');
  const sectionRefs = useRef([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed);
      setJobCategory(parsed?.personalDetails?.jobCategory || getJobType(id));
    } else {
      setJobCategory(getJobType(id));
    }
    AOS.init({ duration: 700, once: true });
  }, [id]);

  const getJobType = (jobId) => {
    const job = mockJobs.find((j) => j._id === jobId);
    return job?.jobCategory || 'Teaching';
  };

  const scrollToSection = (index) => {
    if (sectionRefs.current[index]) {
      sectionRefs.current[index].scrollIntoView({ behavior: 'smooth' });
    }
  };

  const updateSection = (sectionKey, data) => {
    const updated = { ...formData, [sectionKey]: data };
    if (sectionKey === 'personalDetails' && data?.jobCategory) {
      setJobCategory(data.jobCategory);
    }
    setFormData(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    scrollToSection(nextStep);
  };

  const steps = ['Personal', 'Education'];
  if (jobCategory === 'Teaching') {
    steps.push('Research', 'Other', 'Experience');
  } else {
    steps.push('Experience', 'Other'); // Add 'Other' for non-teaching
  }
  steps.push('Declaration');

  const renderSection = (stepIndex, title, Component, dataKey) => {
    if (currentStep >= stepIndex) {
      return (
        <section
          ref={(el) => (sectionRefs.current[stepIndex] = el)}
          className="bg-white shadow-md rounded-xl p-6 mb-8 border"
          data-aos="fade-up"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">
            {stepIndex}. {title}
          </h2>
          <Component
            data={formData[dataKey] || {}}
            updateFormData={(data) => updateSection(dataKey, data)}
            jobCategory={['personalDetails', 'workExperience', 'educationDetails'].includes(dataKey) ? jobCategory : undefined}
          />
        </section>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-gray-800 relative">
      {/* Progress Bar */}
      <div className="sticky top-0 z-30 bg-white shadow mb-8 p-4 rounded-b-xl">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-blue-900">Application Progress</h1>
          <div className="flex space-x-2 flex-wrap">
            {steps.map((step, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  idx + 1 <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {idx + 1}. {step}
              </span>
            ))}
          </div>
        </div>
      </div>

      {renderSection(1, 'Personal Details', PersonalDetails, 'personalDetails')}
      {renderSection(2, 'Educational Details', (props) => (
        <EducationDetails {...props} jobCategory={jobCategory} />
      ), 'educationDetails')}
      {jobCategory === 'Teaching' && renderSection(3, 'Research Contribution', ResearchContribution, 'researchContribution')}
      {renderSection(jobCategory === 'Teaching' ? 4 : 3, 'Other Information', OtherDetails, 'otherDetails')}
      {renderSection(jobCategory === 'Teaching' ? 5 : 4, 'Work Experience', WorkExperience, 'workExperience')}
      {renderSection(jobCategory === 'Teaching' ? 6 : 5, 'Declaration & Upload Resume', Declaration, 'declaration')}
    </div>
  );
}




