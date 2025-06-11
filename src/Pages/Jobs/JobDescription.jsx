
import React, { useEffect, useState } from 'react';
import { useParams, Link,useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building,
  MapPin,
  Clock,
  ShieldCheck,
  BadgeCheck,
  BookOpen,
  Calendar,
  UserCheck
} from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify'; 

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start space-x-3 text-gray-700 dark:text-gray-300">
      <Icon className="w-5 h-5 mt-1 text-purple-600 dark:text-purple-400" />
      <p>
        <span className="font-medium text-gray-800 dark:text-gray-200">{label}:</span> {value}
      </p>
    </div>
  );
}

export default function JobDescription() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleApplyClick = () =>{
    if(!auth?.userId){
      toast.error("Please log in to apply for this job.");
      navigate("/login");
    } else {
      navigate(`/application-form/${job.jobId}`);
    }
  }

  const fetchJobsByID = async() =>{
    try{
        const res = await axiosInstance.get(`/api/jobPost/getJobs/${id}`);
        console.log('Jobs-data',res.data);
        setJob(res.data);
    }catch(err){
        console.error("Failed to fetch jobs", err);
    }
  }

  useEffect(() => {
    fetchJobsByID();
  }, [id]);

  if (!job) {
    return <div className="p-10 text-center text-gray-600 dark:text-gray-300 text-lg">Loading job details...</div>;
  }

  const badgeColor =
    job.jobCategory === 'Teaching'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="bg-purple-700 text-white py-12 px-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">{job.jobTitle}</h1>
          <p className="text-lg font-medium">{job.institution}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-3 gap-10">
        {/* Left: Description */}
        <div className="md:col-span-2 space-y-10">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8">
             <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Job Description</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{__html: job.jobDescription}}/>
          </div>

          <div className="flex justify-between pt-6">
            <Link to="/careers" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              ← Back to Careers
            </Link>
            <button 
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition shadow"
              onClick={handleApplyClick}
            >
              Apply Now
            </button>
          </div>
        </div>

        {/* Right: Details */}
        <aside className="bg-white dark:bg-gray-900 shadow rounded-2xl p-8 border space-y-5 h-[500px]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-700 dark:text-white">Job Details</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}>{job.jobCategory}</span>
          </div>

          <DetailItem icon={Briefcase} label="Job ID" value={job.jobId} />
          <DetailItem icon={Building} label="Department" value={job.department} />
          <DetailItem icon={BadgeCheck} label="Location" value={job.location} />
          <DetailItem icon={Clock} label="Work Type" value={job.jobType} />
          <DetailItem icon={ShieldCheck} label="Employment" value={job.designation} />
          <DetailItem icon={UserCheck} label="Experience" value={`${job.experienceMin} - ${job.experienceMax} years`} />
          <DetailItem icon={Calendar} label="Posted On" value={new Date(job.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })} />
          <DetailItem icon={MapPin} label="Posted By" value={job.createdBy !== undefined ? job.createdBy.first_name : 'Admin'} />

        </aside>
      </div>
    </div>
  );
}
