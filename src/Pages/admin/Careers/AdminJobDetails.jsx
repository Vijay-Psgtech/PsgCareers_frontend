import React,{useState} from 'react'
import { useEffect } from 'react';
import { useParams,useLocation,useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import { FaFilePdf  } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver'
import { toast } from "react-toastify";
import { formatDate } from '../../../utils/dateFormat';



const AdminJobDetails = () => {
    const {jobId} = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const location = useLocation();
    const jobTitle = location.state?.jobTitle;
    const jobCategory = location.state?.jobCategory;
    const [selectedStage, setSelectedStage] = useState("All Stages");
    const [selectedApplicantStatus, setSelectedApplicantStatus] = useState("All Applicants");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const applicantStatusOptions = ["New", "Viewed"];
    const stageOptions= ["Applied", "Profile Screening", "Lvl 1 Screening", "Lvl 2 Screening", "Interview", "Selected", "Not Selected"];


    const filteredCandidates = applicants.filter((app)=>{
        const stageMatch = selectedStage === "All Stages" ? app.stage : app.stage === selectedStage;
        const appStatusmatch = selectedApplicantStatus === "All Applicants" ? app.status : (selectedApplicantStatus === 'New' ? app.status == "Submitted" : app.status == "Viewed" ) 
        return stageMatch && appStatusmatch
    })

    const fetchApplicants = async() => {
        try {
            const res = await axiosInstance.get(`/api/applications/candidates/${jobId}`,{
                params: { page, limit: 10 }
            });
            console.log('Candidate-Details',res.data);
            setApplicants(res.data.data);
            setTotalPages(res.data.totalPages);
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
            toast.success('Candidate Stage updated');
            fetchApplicants();
        } catch (err) {
            toast.error("Failed to update stage");
        }
    };
    
    useEffect(()=>{
        fetchApplicants();
    },[page, jobId])


    function StageProgress({ currentStage, rejectedAtStage }) {
        const isRejected = currentStage === 'Not Selected';
        const rejectionIndex = stageOptions.indexOf(rejectedAtStage);
        const currentStageIndex = stageOptions.indexOf(currentStage);

        // Decide stages to show
        const stagesToShow = isRejected
            ? stageOptions.slice(0, rejectionIndex + 1)
            : stageOptions;

        return (
            <div className="relative w-full flex items-center mt-4 gap-2">
                {stagesToShow.map((stage, idx) => {
                    const isCurrent = stage === currentStage;
                    const isSelected = currentStage === 'Selected';
                    const isRejectionPoint = isRejected && stage === rejectedAtStage;

                    return (
                        <div key={idx} className="flex flex-col items-center relative group">
                            <div
                                className={`w-5 h-5 rounded-full text-xs flex items-center justify-center
                                ${isRejectionPoint ? 'bg-red-500 text-white'
                                    : isSelected && isCurrent ? 'bg-green-500 text-white'
                                    : currentStageIndex >= idx ? 'bg-blue-500 text-white'
                                    : 'bg-gray-300 text-gray-600'}`}
                                title={stage}
                            >
                                {idx + 1}
                            </div>

                            {/* Connector */}
                            {idx !== stagesToShow.length - 1 && (
                                <div className="absolute left-full top-1/2 w-10 h-1 bg-gray-300 -translate-y-1/2 z-0">
                                    <div
                                        className={`w-6 h-1 ${
                                            currentStageIndex > idx ? 'bg-blue-500'
                                            : 'bg-gray-300'
                                        }`}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }



const exportToExcel = (applicantsData) => {
  const FiltteredApplicantsData = selectedStage === "All Stages"
    ? applicantsData
    : applicantsData.filter(c => c.stage === selectedStage);

    const exportData = FiltteredApplicantsData.map((app, index) => {
        const personal = app.personalDetails || {};
        const education = app.educationDetails?.[0]?.educationList || [];
        const work = app.workExperienceDetails?.[0]?.industry?.[0] || {};
        const achievements = app.educationDetails?.[0]?.achievements || '';
        const other = app.otherDetails?.[0] || {};

        const edu10 = education.find(e => e.qualification === "10th") || {};
        const edu12 = education.find(e => e.qualification === "12th") || {};
        const ug = education.find(e => e.qualification === "UG") || {};
        const pg = education.find(e => e.qualification === "PG") || {};
        const additional = education.find(e => ["B.Ed", "M.Ed"].includes(e.degree)) || {};

        return {
        "S. No": index + 1,
        "Position Name": jobTitle || '',
        "Name of the candidate": personal.fullName || '',
        "Contact Number": personal.mobile || '',
        "Mail Id": personal.email || '',
        "10th - School Name, Board, Mark": `${edu10.school || ''}, ${edu10.specialization || ''}, ${edu10.percentage || ''}`,
        "12th - School Name, Board, Mark": `${edu12.school || ''}, ${edu12.specialization || ''}, ${edu12.percentage || ''}`,
        "UG - Degree, College Name, Marks / CGPA": `${ug.degree || ''}, ${ug.university || ''}, ${ug.percentage || ''}`,
        "PG - Degree, College Name, Marks / CGPA": `${pg.degree || ''}, ${pg.university || ''}, ${pg.percentage || ''}`,
        "Additional Qualification - B.Ed / M.Ed": `${additional.degree || ''}`,
        "Additional Certifications / Extra Curricular / CoCurricular Activities": achievements,
        "Current Location": personal.communicationCity || '',
        "Orga Name & Designation": `${work.institution || ''}, ${work.designation || ''}`,
        "From": formatDate(work.from) || '',
        "To": formatDate(work.to) || '',
        "Years of experience": work.experience || '',
        "Notice period": other.joiningTime || '',
        "Last Drawn Salary": other.lastPay || work.lastSalary || '',
        };
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Bold header row
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })];
        if (cell && cell.s === undefined) {
        cell.s = {};
        }
        if (cell) {
        cell.s = {
            font: { bold: true }
        };
        }
    }

    // Add styles with workbook and export as .xlsx
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'applicants');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(blob, `${jobTitle}_page_${page}_candidates_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };




    const candidateDetails = (userId) => {
        navigate(`/admin/candidateDetails/${userId}/${jobId}`,{state:{jobCategory}});
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
                        onClick={() => exportToExcel(filteredCandidates)} 
                    >
                        <FiDownload className="text-xl" />
                        Export
                    </button>
                </div>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b bg-blue-500 text-white font-semibold py-2 px-4 rounded text-lg">
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
                            <StageProgress currentStage={app.stage} rejectedAtStage={app.rejectedAtStage} />
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
            <div className="flex justify-center items-center mt-6 gap-2">
                <button 
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className={`px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Prev
                </button>

                <span>Page {page} of {totalPages}</span>

                <button 
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                     className={`px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Next
                </button>
            </div>

        </div>
    )
}

export default AdminJobDetails