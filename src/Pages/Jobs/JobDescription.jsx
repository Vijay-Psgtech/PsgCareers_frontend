import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Briefcase, Building, MapPin, Clock, ShieldCheck,
  BadgeCheck, Calendar, UserCheck
} from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 break-words">
      <Icon className="mt-1 shrink-0 text-purple-600 dark:text-purple-400" />
      <div className="flex flex-col min-w-0">
        <span className="font-medium">{label}:</span>
        <span className="whitespace-pre-wrap break-words">{value}</span>
      </div>
    </div>
  );
}

export default function JobDescription() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromLanding = location.state?.fromLanding === true;

  const handleApplyClick = () => {
    if (!auth?.userId) {
      toast.error("Please log in to apply for this job.");
      navigate("/login");
    } else if (fromLanding) {
      toast.warn("You must visit the Careers page to apply.");
    } else {
      navigate(`/application-form/${job.jobId}`);
    }
  };

  const fetchJobsByID = async () => {
    try {
      const res = await axiosInstance.get(`/api/jobPost/getJobs/${id}`);
      setJob(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  useEffect(() => {
    fetchJobsByID();
  }, [id]);

  if (!job) {
    return (
      <div className="p-10 text-center text-gray-600 dark:text-gray-300 text-lg">
        Loading job details...
      </div>
    );
  }

  const badgeColor =
    job.jobCategory === 'Teaching'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="bg-purple-700 text-white py-12 px-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">{job.jobTitle}</h1>
          <p className="text-lg font-medium">{job.institution}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-3 gap-10">
        {/* Main Job Description */}
        <div className="md:col-span-2 space-y-10">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Job Description
            </h2>
            <p
              className="text-gray-700 dark:text-white leading-relaxed whitespace-pre-line prose max-w-none
              [&_strong]:font-semibold
              [&_p]:mb-1
              [&_li[data-list='bullet']]:list-disc
              [&_li[data-list='bullet']]:ml-6
              [&_li[data-list='ordered']]:list-decimal
              [&_li[data-list='ordered']]:ml-6
              [&_li]:mb-1
              [&_u]:underline"
              dangerouslySetInnerHTML={{ __html: job.jobDescription }}
            />
          </div>

          <div className="flex justify-between pt-6">
            <Link
              to={fromLanding ? "/" : "/careers"}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              ← Back to {fromLanding ? "Home" : "Careers"}
            </Link>
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition shadow"
              onClick={handleApplyClick}
            >
              Apply Now
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="bg-white dark:bg-gray-900 shadow rounded-2xl p-6 md:p-8 border space-y-5 max-h-[600px] overflow-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-700 dark:text-white">
              Job Details
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}>
              {job.jobCategory}
            </span>
          </div>

          <DetailItem icon={Briefcase} label="Job ID" value={job.jobId} />
          <DetailItem icon={Building} label="Department" value={job.department} />
          <DetailItem icon={BadgeCheck} label="Location" value={job.location} />
          <DetailItem icon={Clock} label="Work Type" value={job.jobType} />
          <DetailItem icon={ShieldCheck} label="Employment" value={job.designation} />
          <DetailItem
            icon={UserCheck}
            label="Experience"
            value={`${job.experienceMin} - ${job.experienceMax} years`}
          />
          <DetailItem
            icon={Calendar}
            label="Posted On"
            value={new Date(job.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          />
          <DetailItem
            icon={MapPin}
            label="Posted By"
            value={job.createdBy?.first_name || 'Admin'}
          />
        </aside>
      </div>
    </div>
  );
}
