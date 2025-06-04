import React,{useState} from 'react'
import { useEffect } from 'react';
import { useParams,useLocation,useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import { FaFilePdf  } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver'



const AdminJobDetails = () => {
    const {jobId} = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const location = useLocation();
    const jobTitle = location.state?.jobTitle;
    const [selectedStage, setSelectedStage] = useState("All Stages");
    const [selectedApplicantStatus, setSelectedApplicantStatus] = useState("All Applicants");

    const applicantStatusOptions = ["New", "Viewed"];
    const stageOptions= ["Applied", "Profile Screening", "Lvl 1 Screening", "Lvl 2 Screening", "Interview", "Selected", "Not Selected"];


    const filteredCandidates = applicants.filter((app)=>{
        const stageMatch = selectedStage === "All Stages" ? app.stage : app.stage === selectedStage;
        const appStatusmatch = selectedApplicantStatus === "All Applicants" ? app.status : (selectedApplicantStatus === 'New' ? app.status == "Submitted" : app.status == "Viewed" ) 
        return stageMatch && appStatusmatch
    })

    const fetchApplicants = async() => {
        try {
            const res = await axiosInstance.get(`/api/applications/candidates/${jobId}`);
            console.log('Candidate-Details',res.data);
            setApplicants(res.data);
        } catch (err) {
            console.error("Failed to load applicants", err);
        }
    };

     const updateCandidateStage = async (userId, newStage) => {
        try {
            await axiosInstance.put("/api/applications/updateStage", {
                userId,
                jobId,
                stage: newStage
            });
            // Optionally: refresh list
            fetchApplicants();
        } catch (err) {
            toast.error("Failed to update stage");
        }
    };
    
    useEffect(()=>{
        fetchApplicants();
    },[jobId])


    function StageProgress({ currentStage }) {
        return (
            <div className="flex items-center justify-start mt-2 gap-2">
            {stageOptions.map((stage, idx) => {
                const isActive = stageOptions.indexOf(currentStage) >= idx;
                return (
                <React.Fragment key={idx}>
                    <div
                    className={`w-4 h-4 rounded-full text-xs flex items-center justify-center font-semibold 
                                ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}
                    title={stage}
                    >
                    {idx + 1}
                    </div>
                    {idx !== stageOptions.length - 1 && (
                    <div className={`w-6 h-1 ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    )}
                </React.Fragment>
                );
            })}
            </div>
        );
    }

    const exportToCSV = (applicantsData) => {
        const FiltteredApplicantsData = selectedStage === "All-stages" ? applicantsData : applicantsData.filter(c=>c.stage === selectedStage);

        const exportData = FiltteredApplicantsData.map(app=>({
            Name: app.personalDetails?.fullName || '',
            Email: app.personalDetails?.email || '',
            Mobile: app.personalDetails?.mobile || '',
            stage: app.stage || '',
            AppliedAt: new Date(app.createdAt).toLocaleDateString(),
            ResumeLink: `${import.meta.env.VITE_API_BASE_URL}/Uploads/${app.personalDetails?.resumeUrl || ''}`
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

        const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${jobTitle} candidates_${new Date().toISOString().slice(0, 10)}.csv`);
    }

   const candidateDetails = (userId) => {
        navigate(`/admin/candidateDetails/${userId}/${jobId}`);
   }


    return (
        <div className="p-6">
            {/* Tabs */}
            <h2 className="text-xl font-bold mb-4">
                Applicants for Job: {jobTitle} (ID: {jobId})
            </h2>

            {/* Filter Section */}
            <div className="flex justify-between items-center my-8">
                <div className="flex gap-4">
                    <select 
                        value = {selectedApplicantStatus}
                        onChange={(e)=> setSelectedApplicantStatus(e.target.value)}
                        className="border px-3 py-1 rounded text-md"
                    >
                        <option>All Applicants</option>
                        {applicantStatusOptions.map((appStatus)=>(
                            <option key={appStatus} value={appStatus}>{appStatus}</option>
                        ))}
                    </select>

                    <select 
                        value={selectedStage}
                        onChange={(e)=> setSelectedStage(e.target.value)}
                        className="border px-3 py-1 rounded "
                    >
                        <option>All Stages</option>
                        {stageOptions.map((stage)=>(
                            <option key={stage} value={stage}>{stage}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button
                        className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition"
                        onClick={() => exportToCSV(filteredCandidates)} 
                    >
                        <FiDownload className="text-lg" />
                        Export  CSV
                    </button>
                </div>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b bg-teal-500 text-white font-semibold py-2 px-4 rounded text-lg">
                        <th className="text-left p-2 ">Candidate Name</th>
                        <th className="text-left p-2 ">Mail</th>
                        <th className="text-left p-2 ">Mobile</th>
                        <th className="text-left p-2">Stage</th>
                        <th className="text-left p-2">Resume/Links</th>
                        <th className="text-left p-2">Applied At</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCandidates.map((app, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50 text-md">
                        <td className="p-2 text-blue-600 cursor-pointer hover:underline" onClick={()=>candidateDetails(app.userId)}>
                            {app.personalDetails?.fullName || "N/A"}
                        </td>
                        <td className="p-2 ">{app.personalDetails?.email || "N/A"}</td>
                        <td className="p-2 ">{app.personalDetails?.mobile || "N/A"}</td>
                        <td className="p-2">
                            <select
                                value={app.stage}
                                onChange={(e) => updateCandidateStage(app.userId, e.target.value)}
                                className="text-md border px-1 py-1 rounded"
                                >
                                {stageOptions.filter(stage => stage !== "All").map(stage => (
                                    <option key={stage} value={stage}>{stage}</option>
                                ))}
                            </select>
                            <StageProgress currentStage={app.stage} />
                        </td>
                        <td className="p-2">
                        {app.personalDetails?.resumeUrl ? (
                            <a 
                                href={`${import.meta.env.VITE_API_BASE_URL}/Uploads/${app.personalDetails.resumeUrl}`} 
                                download
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <FaFilePdf className="text-red-600 hover:scale-110 transition" size={30} />
                            </a>
                        ) : (
                            "N/A"
                        )}
                        </td>
                        <td className="p-2">{new Date(app.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}</td>
                    </tr>
                    ))}
                </tbody>
                </table>

        </div>
    )
}

export default AdminJobDetails