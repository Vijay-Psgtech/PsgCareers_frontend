import React, { useEffect, useState } from 'react';
import { useParams,useLocation,useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import CandidateProfileTabs from '../../../Components/Cards/candidateProfileTab';
import { FaArrowLeft, FaFilePdf  } from "react-icons/fa";
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllDetails = async () => {
      try {
        const [personalRes, eduRes, workRes, otherRes] = await Promise.allSettled([
          axiosInstance.get(`/api/personalDetails/${userId}`),
          axiosInstance.get('/api/education/get', { params: { userId } }),
          axiosInstance.get('/api/workExperience/get', { params: { userId } }),
          axiosInstance.get(`/api/otherDetails/${userId}`)
        ]);

        setPersonal(personalRes.status === 'fulfilled' ? personalRes.value.data : {});
        setEducation(eduRes.status === 'fulfilled' ? eduRes.value.data : []);
        setWork(workRes.status === 'fulfilled' ? workRes.value.data : []);
        setOtherData(otherRes.status === 'fulfilled' ? otherRes.value.data : {});

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
      
       <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-lg bg-white shadow-sm mb-6 border border-gray-200">
          {/* Left: Go Back and Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm sm:text-base bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md shadow transition"
            >
              <FaArrowLeft />
              <span>Go Back</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Candidate Details</h1>
          </div>

          {/* Right: Export PDF Button */}
          <button 
            onClick={() => exportCandidateDetailsToPDF(personal, education, work, research, otherData, jobCategory)} 
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition"
          >
            <FaFilePdf className="text-md" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
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
