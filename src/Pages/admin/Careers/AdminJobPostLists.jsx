import React,{useState,useEffect} from 'react'
import axiosInstance from '../../../utils/axiosInstance'
import DataTable from '../../../Components/Datatable'
import { Container,Typography,MenuItem,Select} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../../Context/AuthContext'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver'
import { FiDownload } from "react-icons/fi";
import { formatDate } from '../../../utils/dateFormat'



const AdminJobPostLists = () => {
    const [jobs,setJobs] = useState('');
    const [showModal,setShowModal] = useState(false);
    const [selectedJobId,setSelectedJobId] = useState(null);
    const navigate = useNavigate();
    const { auth } = useAuth();
    const columns = [
        {field: "jobId", headerName: "Id"},
        {field:"jobTitle",headerName:"Title"},
        {field:"jobCategory",headerName:"Category"},
        {field:"institution",headerName:"Institution"},
        {field:"location",headerName:"Location"},
        {field:"status",headerName:"Status",type:"status"}
    ]
    const fetchJobs = async() =>{
        try{
            const res = await axiosInstance.get('/api/jobPost/getJobs');
            setJobs(res.data);
        }catch(err){
                console.error("Failed to fetch jobs", err);
        }
    }
    const handleToggleStatus = async (jobId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'closed' : 'active';
        try {
            await axiosInstance.put(`/api/jobPost/${jobId}/status`, { status: newStatus });
            await fetchJobs(); 
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };
    const JobPostEdit = (job) =>{
        navigate(`/admin/job-edit/${job.jobId}`);
    }
    const copyJob = async(jobId) =>{
        try{
            const res =await axiosInstance.post(`/api/jobPost/copy/${jobId}`);
            const newJob = res.data; 
            toast.success("Job copied successfully");
            navigate(`/admin/job-edit/${newJob.jobId}`);
        }catch(err){
            toast.error("Failed to make a copy");
        }
    }
    const handleDelete = (id) => {
        setSelectedJobId(id);
        setShowModal(true);
    }
    const JobPostDelete = async() =>{
        try{
            const res = await axiosInstance.delete(`/api/jobPost/${selectedJobId}`);
            toast.success(res.data.message);
            setShowModal(false);
            fetchJobs();
        } catch(err) {
            toast.error("Error deleting job");
        }
    }
    useEffect(()=>{
        fetchJobs();
    },[]);

    const exportJobPostToExcel = (jobLists) => {
        const exportData = jobLists.map((job,idx)=>({
            'S.No': idx+1,
            "JobId": job.jobId,
            "Title": job.jobTitle || '',
            "Category": job.jobCategory,
            "Institution": job.institution || '',
            "Status": job.status || '',
            "Posted on": formatDate(job.createdAt) || '',
            "Posted By": job.createdBy!==undefined ? job.createdBy.first_name : 'SuperAdmin'
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportData);

        const range = XLSX.utils.decode_range(worksheet["!ref"]);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })];
            if (cell) {
            cell.s = { font: { bold: true } };
            }
        }
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array"});
        const blob = new Blob([excelBuffer], { type: "appliacation/octet-stream"});
        saveAs(blob, `Job_lists.xlsx`);
    }
    return auth.role !=='superadmin' ? (  <h2 className="p-4 font-bold text-lg">Admin Job List - Restricted Access</h2> ) : (
        <div className='p-6 sm:p-6'>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4'>
                <h1 className="text-2xl sm:text-3xl font-bold">Job Lists </h1>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 px-12">
                    <button
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        onClick={() => exportJobPostToExcel(jobs)}
                    >
                        <FiDownload className="text-md" />
                            <span className="sm:inline">Export</span>
                    </button>
                    <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={()=>navigate('/admin/create-jobs')}
                    >
                        Add job posting
                    </button>
                </div>
                
            </div>
            <Container maxWidth={false} 
                disableGutters 
                sx={{ 
                    maxWidth: "1500px", 
                    margin: "0 auto", 
                    overflowX: "auto"
                }}>
                <Typography variant="h5" gutterBottom></Typography>
                <DataTable columns={columns} rows={jobs} onEdit={JobPostEdit} onDelete={handleDelete} onStatusChange={handleToggleStatus} onCopy={copyJob}/>
            </Container>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-[300px">
                        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-4">Are you sure you want to delete this job</p>
                        <div className="flex justify-end gap-3">
                            <button className="px-4 py-1 bg-gray-200 rounded" onClick={()=>setShowModal(false)}>
                                Cancel
                            </button>
                            <button className="px-4 py-1 bg-red-600 text-white rounded" onClick={JobPostDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        
    )
}

export default AdminJobPostLists