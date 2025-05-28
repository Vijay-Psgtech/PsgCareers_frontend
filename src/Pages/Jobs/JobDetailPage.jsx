// src/pages/JobDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/jobs/${id}`);
      setJob(data);
    };
    fetchJob();
  }, [id]);

  if (!job) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
      <p><strong>Institution:</strong> {job.institution}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Experience:</strong> {job.experience.min} - {job.experience.max} yrs</p>
      <p><strong>Openings:</strong> {job.numberOfOpenings}</p>
      <p><strong>Description:</strong></p>
      <div className="whitespace-pre-line">{job.jobDescription}</div>
      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => navigate(`/apply/${id}`)}
      >
        Apply Now
      </button>
    </div>
  );
}
