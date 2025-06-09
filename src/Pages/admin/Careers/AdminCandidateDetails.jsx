import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import CandidateProfileTabs from '../../../Components/Cards/candidateProfileTab';

export default function CandidateDetails() {
  const { userId, jobId } = useParams();

  const [personal, setPersonal] = useState({});
  const [education, setEducation] = useState({});
  const [work, setWork] = useState({});
  const [research, setResearch] = useState({});
  const [otherData, setOtherData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllDetails = async () => {
      try {
        const [personalRes, eduRes, workRes, researchRes, otherRes] = await Promise.all([
          axiosInstance.get(`/api/personalDetails/${userId}`),
          axiosInstance.get('/api/education/get', { params: { userId } }),
          axiosInstance.get('/api/workExperience/get', { params: { userId } }),
          axiosInstance.get(`/api/research/${userId}`),
          axiosInstance.get(`/api/otherDetails/${userId}`)
        ]);

        setPersonal(personalRes.data || {});
        setEducation(eduRes.data || {});
        setWork(workRes.data || {});
        setResearch(researchRes.data || {});
        setOtherData(otherRes.data || {});
    
        // Update stage to "Viewed"
        await axiosInstance.put('/api/applications/updateStatus', {
          userId,
          jobId,
          status: 'Viewed',
        });

      } catch (err) {
        console.error('Error fetching candidate details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [userId, jobId]);

  if (loading) return <p className="text-center">Loading...</p>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold  mb-4">Candidate Details</h1>

            <CandidateProfileTabs
                personal={personal}
                education={education}
                experience={work}
                research={research}
                otherDetails={otherData}
            />
        </div>
  );
}
