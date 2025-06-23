import React,{useState,useEffect} from 'react'
import axiosInstance from '../../../utils/axiosInstance'
import DataTable from '../../../Components/Datatable'
import { Container,Typography,MenuItem,Select} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../../Context/AuthContext'



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
    },[])
    return auth.role !=='superadmin' ? (  <h2 className="p-4 font-bold text-lg">Admin Job List - Restricted Access</h2> ) : (
        <div className='p-6'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className="text-3xl font-bold mb-6">Job Lists </h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={()=>navigate('/admin/create-jobs')}>Add job posting</button>
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