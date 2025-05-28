
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
// import axios from 'axios';
// import axiosInstance from '../../utils/axiosInstance';

const mockJobs = [
  {
    id: 'job1',
    title: 'Assistant Professor - Computer Science',
    institution: 'PSG College of Technology',
    jobCategory: 'Teaching',
    description:
      'We seek an Assistant Professor in Computer Science with a passion for teaching and research. Responsibilities include lecturing, guiding students, and research publication.',
    responsibilities: [
      'Deliver lectures and seminars to undergraduate and postgraduate students.',
      'Guide students in research projects and internships.',
      'Publish research papers in reputed journals.',
    ],
    department: 'Computer Science',
    location: 'Coimbatore',
    workType: 'Full-Time',
    employmentType: 'Permanent',
    experience: '2+ years',
    qualification: 'Ph.D. in Computer Science or related field',
    postedOn: '2025-05-15',
    postedBy: 'HR Department',
  },
  {
        id: 'job2',
        title: 'Lab Technician',
        institution: 'PSG Institute of Medical Sciences',
        jobCategory: 'Non-Teaching',
        description:
          'We seek an Assistant Professor in Computer Science with a passion for teaching and research. Responsibilities include lecturing, guiding students, and research publication.',
    responsibilities: [
      'Deliver lectures and seminars to undergraduate and postgraduate students.',
      'Guide students in research projects and internships.',
      'Publish research papers in reputed journals.',
    ],
    department: 'Computer Science',
    location: 'Coimbatore',
    workType: 'Full-Time',
    employmentType: 'Permanent',
    experience: '2+ years',
    qualification: 'Ph.D. in Computer Science or related field',
    postedOn: '2025-05-15',
    postedBy: 'HR Department',
      },
];

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

  // const fetchJobsByID = async() =>{
  //   try{
  //       const res = await axiosInstance.get(`/api/jobPost/getJobs/${id}`);
  //       console.log('Jobs-data',res.data);
  //       setJob(res.data);
  //   }catch(err){
  //       console.error("Failed to fetch jobs", err);
  //   }
  // }

  useEffect(() => {
    const foundJob = mockJobs.find((j) => j.id === id);
    //fetchJobsByID();
    setJob(foundJob);
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
          <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
          <p className="text-lg font-medium">{job.institution}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-3 gap-10">
        {/* Left: Description */}
        <div className="md:col-span-2 space-y-10">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8">
             <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Job Summary</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{job.description}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              {Array.isArray(job.responsibilities) &&
                job.responsibilities.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>

          <div className="flex justify-between pt-6">
            <Link to="/careers" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              ← Back to Careers
            </Link>
            <Link
              to={`/application-form/${job.id}`}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition shadow"
            >
              Apply Now
            </Link>
          </div>
        </div>

        {/* Right: Details */}
        <aside className="bg-white dark:bg-gray-900 shadow rounded-2xl p-8 border space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-700 dark:text-white">Job Details</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}>{job.jobCategory}</span>
          </div>

          <DetailItem icon={Briefcase} label="Job ID" value={job.id} />
          <DetailItem icon={Building} label="Department" value={job.department} />
          <DetailItem icon={BadgeCheck} label="Location" value={job.location} />
          <DetailItem icon={Clock} label="Work Type" value={job.workType} />
          <DetailItem icon={ShieldCheck} label="Employment" value={job.employmentType} />
          <DetailItem icon={UserCheck} label="Experience" value={job.experience} />
          <DetailItem icon={BookOpen} label="Qualification" value={job.qualification} />
          <DetailItem icon={Calendar} label="Posted On" value={job.postedOn} />
          <DetailItem icon={MapPin} label="Posted By" value={job.postedBy} />

        </aside>
      </div>
    </div>
  );
}
