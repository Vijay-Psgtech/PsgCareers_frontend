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
  // Get userId (applicant) and jobId from URL params
  const { jobId } = useParams();
  const {auth} = useAuth();
  const userId = auth.userId;

  // Key for localStorage persistence
  const storageKey = `applicationFormData_${userId}_${jobId}`;

  // Local state for all form data sections
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [jobCategory, setJobCategory] = useState('Teaching'); // default, can be overwritten by saved data
  const sectionRefs = useRef([]);

    const fetchJobsByID = async() =>{
      try{
          const res = await axiosInstance.get(`/api/jobPost/getJobs/${jobId}`);
          console.log('Jobs-data',res.data);
          const job = res.data;
          setJobCategory(job.jobCategory)
      }catch(err){
          console.error("Failed to fetch jobs", err);
      }
    }

  // On mount, load saved form data from localStorage if exists
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

  // Scroll to a specific section by index
  const scrollToSection = (index) => {
    if (sectionRefs.current[index]) {
      sectionRefs.current[index].scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Update data for a specific section, save to localStorage and update jobCategory if applicable
  const updateSection = (sectionKey, data) => {
    const updated = { ...formData, [sectionKey]: data };
    setFormData(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Update jobCategory if changed in personalDetails
    if (sectionKey === 'personalDetails' && data?.jobCategory) {
      setJobCategory(data.jobCategory);
    }

    // Move to next step and scroll to it
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    scrollToSection(nextStep);
  };

  // Define the step titles and order based on jobCategory
  const steps = ['Personal Details', 'Educational Details'];
  const teachingFlow = ['Research Contribution', 'Work Experience', 'Other Information','Declaration & Upload Resume'];
  const nonTeachingFlow = ['Work Experience','Other Information', 'Declaration & Upload Resume'];
  const fullSteps = steps.concat(jobCategory === 'Teaching' ? teachingFlow : nonTeachingFlow);

  // Helper to render each section with correct props
  const renderSection = (stepIndex, title, Component, dataKey) => {
    if (currentStep >= stepIndex) {
      return (
        <section
          key={stepIndex}
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
    <div className="max-w-6xl mx-auto px-4 py-8 text-gray-800 relative">
      {/* Progress Bar */}
      <div className="sticky top-0 z-30 bg-white shadow mb-8 p-4 rounded-b-xl">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-blue-900">Application Progress</h1>
          <div className="flex space-x-2 flex-wrap">
            {fullSteps.map((step, idx) => (
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

      {/* Render sections based on steps */}
      {renderSection(1, 'Personal Details', PersonalDetails, 'personalDetails')}
      {renderSection(2, 'Educational Details', EducationDetails, 'educationDetails')}

      {jobCategory === 'Teaching' &&
        renderSection(3, 'Research Contribution', ResearchContribution, 'researchContribution')}

      {renderSection(jobCategory === 'Teaching' ? 4 : 3, 'Work Experience', WorkExperience, 'workExperience')}
      {renderSection(jobCategory === 'Teaching' ? 5 : 4, 'Other Information', OtherDetails, 'otherDetails')}
      
      {renderSection(jobCategory === 'Teaching' ? 6 : 5, 'Declaration & Upload Resume', Declaration, 'declaration')}
    </div>
  );
}