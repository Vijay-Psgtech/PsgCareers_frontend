import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Briefcase, Building, MapPin, Clock, ShieldCheck,
  BadgeCheck, Calendar, UserCheck
} from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

// eslint-disable-next-line no-unused-vars
function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start space-x-3 text-gray-700 dark:text-gray-300">
      <Icon className="w-5 h-5 mt-1 text-purple-600 dark:text-purple-400" />
      <p>
        <span className="font-medium text-gray-800 dark:text-gray-200">{label}:</span> {value || '—'}
      </p>
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

  const fetchJobByID = async () => {
    try {
      const res = await axiosInstance.get(`/api/jobPost/getJobs/${id}`);
      setJob(res.data);
    } catch (err) {
      console.error("Failed to fetch job", err);
    }
  };

  useEffect(() => {
    fetchJobByID();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const badgeColor =
    job?.jobCategory === 'Teaching'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';

  const formattedDate = job?.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <>
      {/* ✅ Dynamic SEO Tags */}
      <Helmet>
        <title>{job ? `${job.jobTitle} – ${job.institution} | PSG Careers` : 'Job Details | PSG Careers'}</title>
        <meta
          name="description"
          content={
            job
              ? `Explore the ${job.jobTitle} position at ${job.institution}, located in ${job.location}.`
              : 'View detailed job information on PSG Careers Portal.'
          }
        />
        <meta property="og:title" content={job ? `${job.jobTitle} | PSG Careers` : 'Job Opening'} />
        <meta property="og:description" content={job?.jobDescription?.slice(0, 160) || 'Job details and apply link.'} />
        <meta property="og:image" content="/Logo2.png" />
        <meta property="og:url" content={`https://careers.psginstitutions.in/job/${id}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <div className="bg-purple-700 text-white py-12 px-6 shadow-md">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">{job?.jobTitle || 'Loading...'}</h1>
            <p className="text-lg font-medium">{job?.institution}</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-3 gap-10">
          {/* Main Description */}
          <div className="md:col-span-2 space-y-10">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Job Summary</h2>
              <p
                className="text-gray-700 dark:text-white leading-relaxed whitespace-pre-line prose max-w-none
                  [&_strong]:font-semibold
                  [&_p]:mb-1
                  [&_li[data-list='bullet']]:list-disc
                  [&_li[data-list='bullet']]:ml-6
                  [&_li[data-list='ordered']]:list-decimal
                  [&_li[data-list='ordered']]:ml-6
                  [&_li]:mb-1
                  [&_u]:underline 
                  dark:[&_span]:!text-gray-200
                  dark:[&_strong]:!text-white
                  dark:[&_p]:!text-gray-300"
                dangerouslySetInnerHTML={{ __html: job?.jobDescription || 'No description available.' }}
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
          <aside className="bg-white dark:bg-gray-900 shadow rounded-2xl p-8 border space-y-5 h-fit">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-700 dark:text-white">Job Details</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}>
                {job?.jobCategory}
              </span>
            </div>

            <DetailItem icon={Briefcase} label="Job ID" value={job?.jobId} />
            <DetailItem icon={Building} label="Department" value={job?.department} />
            <DetailItem icon={BadgeCheck} label="Location" value={job?.location} />
            <DetailItem icon={Clock} label="Work Type" value={job?.jobType} />
            <DetailItem icon={ShieldCheck} label="Designation" value={job?.designation} />
            <DetailItem icon={UserCheck} label="Experience" value={`${job?.experienceMin} - ${job?.experienceMax} years`} />
            <DetailItem icon={Calendar} label="Posted On" value={formattedDate} />
            <DetailItem icon={MapPin} label="Posted By" value={job?.createdBy?.first_name || 'Admin'} />
          </aside>
        </div>
      </div>
    </>
  );
}