import React,{useState,useEffect} from 'react'
// import axios from 'axios'
import axiosInstance from '../../../utils/axiosInstance'
import DataTable from '../../../Components/Datatable'
import { Container,Typography,MenuItem,Select} from '@mui/material'
import { useNavigate } from 'react-router-dom'



const AdminJobPostLists = () => {
    const [jobs,setJobs] = useState('');
    const navigate = useNavigate();
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
            await fetchJobs(); // ⬅ refresh list after update
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };
    const JobPostEdit = (job) =>{
        navigate(`/admin/job-edit/${job.jobId}`);
    }
    useEffect(()=>{
        fetchJobs();
    },[])
    return (
        <div className='p-6'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className="text-3xl font-bold mb-6">Job Lists </h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={()=>navigate('/admin/careers')}>Add job posting</button>
            </div>
             <Container maxWidth={false} 
                disableGutters 
                sx={{ 
                    maxWidth: "1500px", 
                    margin: "0 auto", 
                    overflowX: "auto"
                }}>
                <Typography variant="h5" gutterBottom></Typography>
                <DataTable columns={columns} rows={jobs} onEdit={JobPostEdit} onDelete={{}} onStatusChange={handleToggleStatus}/>
            </Container>
        </div>
    )
}

export default AdminJobPostLists