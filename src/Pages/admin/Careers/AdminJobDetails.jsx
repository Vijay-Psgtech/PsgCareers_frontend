import React,{useState} from 'react'
import { useEffect } from 'react';
import { useParams,useLocation,useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import { FaFilePdf, FaSearch  } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver'
import { toast } from "react-toastify";
import { formatDate } from '../../../utils/dateFormat';
import Select from "react-select";
import { useAuth } from "../../../Context/AuthContext";



const AdminJobDetails = () => {
    const {jobId} = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const location = useLocation(); 
    const jobTitle = location.state?.jobTitle;
    const jobCategory = location.state?.jobCategory;
    const [selectedStage, setSelectedStage] = useState(null);
    const [selectedApplicantStatus, setSelectedApplicantStatus] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm,setSearchTerm] = useState(''); 
    const {auth} = useAuth();
    const [remarksMap, setRemarksMap] = useState({});


    const applicantStatusOptions = ["New", "Viewed"].map((app)=>({
        label: app,
        value: app
    }));

    const stageOptions= ["Applied", "Profile Screening", "Lvl 1 Screening", 
        "Lvl 2 Screening", "Interview", "Selected", "Not Selected"
    ].map((stage)=>({
        label: stage,
        value: stage
    }));
    const filteredOptions = stageOptions.filter(option => option.value !== "All");


    const filteredCandidates = applicants.filter(app => {
        const stageMatch = !selectedStage || app.stage === selectedStage.value;
        const status = app.status;
        const statusMatch = !selectedApplicantStatus ||
            (selectedApplicantStatus.value === 'New'
            ? status === 'Submitted'
            : status === 'Viewed');

        const search = searchTerm.toLowerCase();
        const nameMatch = app.personalDetails?.fullName?.toLowerCase().includes(search);
        const mobileMatch = app.personalDetails?.mobile?.includes(search);

        return stageMatch && statusMatch && (nameMatch || mobileMatch);
    });

    const fetchApplicants = async() => {
        try {
            const res = await axiosInstance.get(`/api/applications/candidates/${jobId}`,{
                params: { page, limit: 20 }
            });
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

    const handleRemarksChange = (userId, value) => {
        setRemarksMap((prev) => ({ ...prev, [userId]: value }));
    };

    const updateRemarks = async (userId, remark) => {
        try {
            await axiosInstance.put('/api/applications/updateRemarks', {
                userId,
                jobId, 
                remark
            });
            toast.success("Remarks updated");
        } catch (err) {
            toast.error("Failed to update remarks");
        }
    };
    
    useEffect(()=>{
        fetchApplicants();
    },[page, jobId])


    // Stage process
    function StageProgress({ currentStage, rejectedAtStage }) {
        const isRejected = currentStage === 'Not Selected';
    
        const rejectionIndex = stageOptions.findIndex(opt => opt.value === rejectedAtStage);
        const currentStageIndex = stageOptions.findIndex(opt => opt.value === currentStage);

        const stagesToShow = isRejected
            ? stageOptions.slice(0, rejectionIndex + 1)
            : stageOptions;

        return (
            <div className="relative w-full flex items-center mt-4 gap-2">
                {stagesToShow.map((stageObj, idx) => {
                    const stage = stageObj.value;
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

    // Excel export 
    const exportToExcel = (applicantsData) => {
        const FiltteredApplicantsData = !selectedStage
            ? applicantsData
            : applicantsData.filter(c => c.stage === selectedStage.value);

        const maxOrgs = 5;

        const headers = [
            "S. No", "Position Name", "Name of the candidate", "Contact Number", "Mail Id",
            "10th - School Name, Board, Mark",
            "12th - School Name, Board, Mark",
            "UG - Degree, College Name, Marks / CGPA",
            "PG - Degree, College Name, Marks / CGPA",
            "Additional Qualification - B.Ed / M.Ed",
            "Additional Certifications / Extra Curricular / CoCurricular Activities",
        ];

        for (let i = 1; i <= maxOrgs; i++) {
            headers.push(`Org ${i} - Institution`);
            headers.push(`Org ${i} - Designation`);
            headers.push(`Org ${i} - From`);
            headers.push(`Org ${i} - To`);
            headers.push(`Org ${i} - Experience (yrs)`);
        }

        headers.push("Current Location", "Notice Period", "Last Drawn Salary", "Overall Experience (yrs)");

        const exportData = FiltteredApplicantsData.map((app, index) => {
            const personal = app.personalDetails || {};
            const education = app.educationDetails?.[0]?.educationList || [];
            const workTeaching = app.workExperienceDetails?.[0]?.teaching || [];
            const workIndustry = app.workExperienceDetails?.[0]?.industry || [];
            const achievements = app.educationDetails?.[0]?.achievements || '';
            const other = app.otherDetails?.[0] || {};

            const edu10 = education.find(e => e.qualification === "10th") || {};
            const edu12 = education.find(e => e.qualification === "12th") || {};
            const ug = education.find(e => e.qualification === "UG") || {};
            const pg = education.find(e => e.qualification === "PG") || {};
            const additional = education.find(e => ["B.Ed", "M.Ed"].includes(e.degree)) || {};

            const workEntries = [...workTeaching, ...workIndustry].slice(0, maxOrgs);

            const calculateExperience = (from, to) => {
                const start = new Date(from);
                const end = new Date(to);
                const diff = end - start;
                const years = diff / (1000 * 60 * 60 * 24 * 365.25);
                return years > 0 ? years.toFixed(1) : '';
            };

            const row = {
                "S. No": index + 1,
                "Position Name": jobTitle || '',
                "Name of the candidate": personal.fullName || '',
                "Contact Number": personal.mobile || '',
                "Mail Id": personal.email || '',
                "10th - School Name, Board, Mark": `${edu10.school || ''}, ${edu10.specialization || ''}, ${edu10.percentage || ''}`,
                "12th - School Name, Board, Mark": `${edu12.school || ''}, ${edu12.specialization || ''}, ${edu12.percentage || ''}`,
                "UG - Degree, College Name, Marks / CGPA": `${ug.degree || ''} - ${ug.specialization || ''}, ${ug.university || ''}, ${ug.percentage || ''}`,
                "PG - Degree, College Name, Marks / CGPA": `${pg.degree || ''} - ${pg.specialization || ''}, ${pg.university || ''}, ${pg.percentage || ''}`,
                "Additional Qualification - B.Ed / M.Ed": `${additional.degree || ''}`,
                "Additional Certifications / Extra Curricular / CoCurricular Activities": achievements,
            };

            // Add empty or filled work entries
            for (let i = 0; i < maxOrgs; i++) {
                const work = workEntries[i] || {};
                row[`Org ${i + 1} - Institution`] = work.institution || '';
                row[`Org ${i + 1} - Designation`] = work.designation || '';
                row[`Org ${i + 1} - From`] = formatDate(work.from) || '';
                row[`Org ${i + 1} - To`] = formatDate(work.to) || '';
                row[`Org ${i + 1} - Experience (yrs)`] = work.from && work.to ? calculateExperience(work.from, work.to) : '';
            }

            const totalExperience = workEntries.reduce((sum, work) => {
                const exp = calculateExperience(work.from, work.to);
                return sum + (parseFloat(exp) || 0);
            }, 0);

            row["Current Location"] = personal.communicationCity || '';
            row["Notice Period"] = other.joiningTime || '';
            row["Last Drawn Salary"] = other.lastPay || '';
            row["Overall Experience (yrs)"] = totalExperience.toFixed(1);

            return row;
        });


        const worksheet = XLSX.utils.json_to_sheet(exportData, { header: headers });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Applicants');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
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
                    <Select 
                        name="applicantStatus"
                        options={applicantStatusOptions}
                        value={selectedApplicantStatus}
                        onChange={setSelectedApplicantStatus}
                        placeholder="All Applicants"
                        className="min-h-[40px]  rounded-lg" 
                        isClearable
                    />
                    <Select 
                        name="applicantSatge"
                        options={stageOptions}
                        value={selectedStage}
                        onChange={setSelectedStage}
                        placeholder="All Stages"
                        className="min-h-[40px]  rounded-lg" 
                        isClearable
                    />
                    <div>
                        <div className='relative max-w-sm'>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg shadow-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e)=>setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                        </div>
                    </div>
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
                    <tr className="border-b bg-blue-500 text-white font-semibold py-2 px-4 rounded text-md">
                        <th className="text-left p-2 ">Candidate Name</th>
                        <th className="text-left p-2 ">Mail</th>
                        <th className="text-left p-2 ">Mobile</th>
                        <th className="text-left p-2">Stage</th>
                        <th className="text-left p-2">Resume/Links</th>
                        <th className="text-left p-2">Applied At</th>
                        <th className="text-left p-2">Remarks</th>
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
                            {auth.role === 'superadmin' && (
                                <Select
                                    className="text-md w-[200px]" // Adjust width as needed
                                    options={filteredOptions}
                                    value={filteredOptions.find(option => option.value === app.stage) || null}
                                    onChange={(selectedOption) => updateCandidateStage(app.userId, selectedOption?.value)}
                                    placeholder="Select Stage"
                                />
                            )}
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
                        <td className="p-2">
                            {auth.role === 'admin' ? (
                                <div className="flex flex-col gap-1">
                                    <textarea
                                        value={remarksMap[app.userId] ?? app.remarks ?? ''}
                                        onChange={(e) => handleRemarksChange(app.userId, e.target.value)}
                                        rows={2}
                                        placeholder="Enter remarks..."
                                        className="w-full border rounded p-1 text-sm resize-none"
                                    />
                                    <button
                                        onClick={() => updateRemarks(app.userId, remarksMap[app.userId] ?? '')}
                                        className="self-start px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                                        disabled={
                                        !remarksMap[app.userId] ||
                                        remarksMap[app.userId] === app.remarks
                                        }
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-700">
                                    {app.remarks || '—'}
                                </div>
                            )}
                        </td>
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