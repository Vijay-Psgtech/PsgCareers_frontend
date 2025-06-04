import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../Context/AuthContext';

export default function Declaration({ formData = {} }) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { auth } = useAuth();
  const userId = auth?.userId;
  const { jobId } = useParams(); // e.g., route = /application/:jobId

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreed) {
      alert('❗ Please confirm the declaration before submitting.');
      return;
    }

    if (!userId || !jobId) {
      alert('❌ Missing User ID or Job ID. Please log in again.');
      console.error('Missing userId or jobId:', { userId, jobId });
      return;
    }

    // Add the declaration agreement into formData before sending
    const submissionData = {
      ...formData,
      declaration: { agreed: true },
    };

    try {
      setLoading(true);

      const res = await axiosInstance.post(
        `api/applications/submit/${userId}/${jobId}`,
        submissionData
      );

      if (res.data.success) {
        alert(`✅ Application submitted! Your Application ID is ${res.data.applicationId}`);
        setSubmitted(true);
        navigate('/dashboard');
      } else {
        alert('❌ Submission failed: ' + res.data.message);
      }
    } catch (error) {
      console.error('❌ Error submitting application:', error);
      alert('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6"
    >
      <h3 className="text-xl font-semibold text-gray-800">Declaration</h3>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          className="w-5 h-5 mt-1"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          disabled={submitted}
        />
        <span className="text-gray-700 leading-snug">
          I hereby declare that the information provided is true to the best of my knowledge and belief. I understand that any misrepresentation may result in disqualification.
        </span>
      </label>

      <div className="text-right">
        <button
          type="submit"
          disabled={!agreed || loading || submitted}
          className={`px-6 py-2 rounded text-white shadow ${
            submitted ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Submitting...' : submitted ? 'Submitted' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
}
