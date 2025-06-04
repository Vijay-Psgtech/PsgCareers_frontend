import React, {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../../utils/axiosInstance'
import {CircularProgressbar,buildStyles} from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { FaSearch } from 'react-icons/fa';
import { useAuth } from "../../../Context/AuthContext";
import Select from "react-select"

const AdminDashboard = () => {
    const [jobs,setJobs] = useState([]);
    const navigate = useNavigate();
    const [selectedJob,setSelectedJob] = useState(null);
    const [isDrawerOpen,setIsDrawerOpen] = useState(false);
    const [statusType,setStatusType] = useState('active');
    const [searchTerm,setSearchTerm] = useState(''); 
    const [institutionOptions,setInstitutionOptions] = useState([]);
    const [selectedInstitutions, setSelectedInstitutions] = useState(null);
    const [selectedCategory,setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    const [page,setPage] = useState(1);
    const jobsPerPage = 9;
    const {auth} = useAuth();

    const jobCategoryOptions = ["Teaching", "Non Teaching"].map((jobCat)=>({
      label : jobCat,
      value : jobCat
    }));

    const fetchJobs = async() =>{
      try{
        const res = await axiosInstance.get('/api/jobPost/JobsWithCount',{
          headers:{
            Authorization: `Bearer ${auth.token}`,
          }
        });
        console.log('Jobs-data',res.data);
        setJobs(res.data);
        setLoading(false);

      }catch(err){
        console.error("Failed to fetch jobs", err);
      }
    }

    const fetchInstitutions = async() => {
      try{
        const res = await axiosInstance.get('/api/dropDown/getInstitutions');
        const formattedOptions = res.data.map((inst)=>({
          label: inst.name,
          value: inst.name
        }));
        setInstitutionOptions(formattedOptions);
      } catch(err) {
        console.error("failed to fetch institutions",err);
      }
    }

    useEffect(()=>{
      fetchJobs();
      fetchInstitutions();
    },[]);

    const filteredJobs = jobs.filter((job)=>{
      const jobStatus = job.status === statusType;
      const jobSearch = job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const institutionMatch = !selectedInstitutions || job.institution === selectedInstitutions.value;
      const categoryMatch = !selectedCategory || job.jobCategory === selectedCategory.value;
      return jobStatus && jobSearch && institutionMatch && categoryMatch;
    });

    const paginatedJobs = filteredJobs.slice((page - 1) * jobsPerPage, page * jobsPerPage);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    const handleDetailsClick = (job) =>{
      console.log('jobCreated',job.createdBy)
      setSelectedJob(job);
      setIsDrawerOpen(true);
    };

    const closeDrawer = () =>{
      setIsDrawerOpen(false);
      setSelectedJob(null);
    };

    const handlejobAppliedDetails = (jobId,jobTitle,candidateCount) => {
      if(candidateCount!==0) navigate(`/admin/jobDetails/${jobId}`,{state:{jobTitle}});
    };

    useEffect(()=>{
      setPage(1);
    },[searchTerm,selectedInstitutions,selectedCategory,statusType])
 
    if (loading) return <p className="text-center">Loading...</p>;
    
    return (
      <div className="p-6">
        <div className="flex flex-wrap gap-4 justify-between mb-6">
          <div className='inline-flex gap-6 flex-col md:flex-row'>
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
          
          
          {auth.role === 'superadmin' && (
            <button onClick={()=>navigate('/admin/careers')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Add Job Posting
            </button>
          )}
        </div>

        <div className="flex flex-wrap  gap-4 justify-between mb-4">
          <div className="inline-flex gap-6 flex-col md:flex-row">
              {auth.role === 'superadmin' && (
              <Select
                name="institution"
                options={institutionOptions}
                value={selectedInstitutions}
                onChange={setSelectedInstitutions}
                placeholder="All Institutions"
                className="min-h-[40px] rounded"
                isClearable
              />
            )}
            <Select 
              name="jobCategory"
              options={jobCategoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="All Categories"
              className="min-h-[40px]  rounded" 
              isClearable
            />
          </div>
          <div>
             <div className='relative max-w-sm'>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e)=>setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
          </div>
          </div>
         
        </div>

        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginatedJobs.map((job, idx) => (
            <div key={idx} className="relative rounded-xl p-4 shadow-2xl bg-white">

              <div className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {job.newCandidateCount} 
              </div>

              <div className="text-sm text-gray-500 mb-2">
                {job.institution} - {job.jobCategory}
              </div>
              <h3 className="font-semibold text-lg truncate">{job.jobTitle}</h3>

              <div className="w-30 h-35 mx-auto my-4 cursor-pointer transition-transform duration-300 hover:scale-105" onClick={()=>handlejobAppliedDetails(job.jobId,job.jobTitle,job.candidateCount)}>
                <CircularProgressbar
                 value={job.candidateCount}
                 maxValue={50}
                 text={`${job.candidateCount}`}
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
                    <div><strong>Posted By:</strong> 
                       { selectedJob.createdBy !== undefined ? selectedJob.createdBy : 'Admin' }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          
        )}
      </div>
    )
}

export default AdminDashboard