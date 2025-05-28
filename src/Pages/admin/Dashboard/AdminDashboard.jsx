import React, {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
// import axios from 'axios';
import axiosInstance from '../../../utils/axiosInstance'
import {CircularProgressbar,buildStyles} from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { FaSearch } from 'react-icons/fa';

const AdminDashboard = () => {
    const [jobs,setJobs] = useState([]);
    const navigate = useNavigate();
    const [selectedJob,setSelectedJob] = useState(null);
    const [isDrawerOpen,setIsDrawerOpen] = useState(false);
    const [statusType,setStatusType] = useState('active');
    const [searchTerm,setSearchTerm] = useState(''); 
    const [page,setPage] = useState(1);
    const jobsPerPage = 6;

    useEffect(()=>{
        const fetchJobs = async() =>{
            try{
                const res = await axiosInstance.get('/api/jobPost/getJobs');
                console.log('Jobs-data',res.data);
                setJobs(res.data);
            }catch(err){
                 console.error("Failed to fetch jobs", err);
            }
        }
        fetchJobs();
    },[]);

    const filteredJobs = jobs.filter((item)=>{
      const jobStatus = item.status === statusType;
      const jobSearch = item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
      return jobStatus && jobSearch;
    });

    const paginatedJobs = filteredJobs.slice((page - 1) * jobsPerPage, page * jobsPerPage);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    const handleDetailsClick = (job) =>{
      setSelectedJob(job);
      setIsDrawerOpen(true);
    };

    const closeDrawer = () =>{
      setIsDrawerOpen(false);
      setSelectedJob(null);
    };
 
    return (
      <div className="p-6">
        <div className='flex justify-end gap-4 mb-6'>
          <div className='relative max-w-sm'>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e)=>setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
          </div>
        </div>
        <div className="flex justify-between mb-4">
          <div className='inline-flex gap-4'>
            <button 
              onClick={()=>setStatusType('active')} 
              className={`${statusType === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black' } px-4 py-2 rounded`}
            >
              Active Jobs
            </button>
            <button 
              onClick={()=>setStatusType('closed')} 
              className={`${statusType === 'closed' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'} px-4 py-2 rounded`}
            >
              Closed Jobs
            </button>
          </div>
          
          
          <button onClick={()=>navigate('/admin/careers')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Job Posting
          </button>
        </div>

        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginatedJobs.map((job, idx) => (
            <div key={idx} className="relative rounded-lg p-4 shadow-lg bg-white ">

              <div className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {10} 
              </div>

              <div className="text-sm text-gray-500 mb-2">
                {job.institution} - {job.jobCategory}
              </div>
              <h3 className="font-semibold text-lg truncate">{job.jobTitle}</h3>

              <div className="w-30 h-35 mx-auto my-4">
                <CircularProgressbar
                 value={198}
                 maxValue={500}
                 text={'198'}
                 styles={buildStyles({
                  textColor: "#1D4ED8",
                  pathColor: "#3B82F6",
                  trailColor: "#E5E7EB",
                  textSize: "25px",
                })}
                />
                <div className="text-sm text-center mt-1 text-gray-500">Candidates</div>
              </div>

              <div className="text-gray-500 text-sm">
                <span>{job.location}</span> | <span>{job.jobType}</span>
              </div>

              <div className="flex justify-between items-center mt-4 text-sm">
                <span className="text-green-600">Published</span>
                <button className="text-blue-600 hover:underline" onClick={() => handleDetailsClick(job)}>Details</button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {/* Drawer */}
        {isDrawerOpen && selectedJob && (
            <div className="fixed inset-0 z-50 flex">
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={closeDrawer}>
                <div
                  className="relative ml-auto w-full max-w-xl bg-white shadow-lg h-full overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center px-4 py-3 border-b">
                    <h2 className="text-xl font-semibold">Job Details</h2>
                    <button onClick={closeDrawer} className="text-gray-500 text-xl">&times;</button>
                  </div>

                  <div className="p-4 space-y-4">
                    <div><strong>Job ID:</strong> {selectedJob.jobId}</div>
                    <div><strong>Job Title:</strong> {selectedJob.jobTitle}</div>
                    <div><strong>Institution:</strong> {selectedJob.institution}</div>
                    <div><strong>Location:</strong> {selectedJob.location}</div>
                    <div><strong>Category:</strong> {selectedJob.jobCategory}</div>
                    <div><strong>Job Type:</strong> {selectedJob.jobType}</div>
                    <div><strong>Job Description:</strong><div dangerouslySetInnerHTML={{ __html: selectedJob.jobDescription }}/></div>
                    <div>
                      <strong>Posted On:</strong>{" "}
                      {new Date(selectedJob.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </div>
                    <div><strong>Posted By:</strong>Vijay</div>
                  </div>
                </div>
              </div>
            </div>
          
        )}
      </div>
    )
}

export default AdminDashboard