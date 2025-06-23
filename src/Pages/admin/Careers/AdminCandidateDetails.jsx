import React, { useEffect, useState } from 'react';
import { useParams,useLocation } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import CandidateProfileTabs from '../../../Components/Cards/candidateProfileTab';
import { FaFilePdf  } from "react-icons/fa";
import { exportCandidateDetailsToPDF } from '../../../Components/ExportPdf';


export default function CandidateDetails() {
  const { userId, jobId } = useParams();
  const location = useLocation();
  const jobCategory = location.state?.jobCategory;
  const [personal, setPersonal] = useState({});
  const [education, setEducation] = useState({});
  const [work, setWork] = useState({});
  const [research, setResearch] = useState({});
  const [otherData, setOtherData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllDetails = async () => {
      try {
        const [personalRes, eduRes, workRes, otherRes] = await Promise.all([
          axiosInstance.get(`/api/personalDetails/${userId}`),
          axiosInstance.get('/api/education/get', { params: { userId } }),
          axiosInstance.get('/api/workExperience/get', { params: { userId } }),
          axiosInstance.get(`/api/otherDetails/${userId}`)
        ]);

        setPersonal(personalRes.data || {});
        setEducation(eduRes.data || {});
        setWork(workRes.data || {});
        setOtherData(otherRes.data || {});

        if(jobCategory === 'Teaching') {
         const researchRes = await axiosInstance.get(`/api/research/${userId}`);
         setResearch(researchRes.data || {});
        }
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
      
      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-bold  mb-4">Candidate Details</h1>
        <div className='flex-end'>
          <button 
            onClick={()=>exportCandidateDetailsToPDF(personal, education, work, research, otherData, jobCategory )} 
            className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-700 transition"
          >
            <FaFilePdf className='text-md'/>Export PDF
          </button>
        </div>
      </div>
        

      <CandidateProfileTabs
        personal={personal}
        education={education}
        experience={work}
        research={research}
        otherDetails={otherData}
        jobCategory={jobCategory}
      />
    </div>
  );
}
