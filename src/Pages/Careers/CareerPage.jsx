import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
// import axiosInstance from '../../utils/axiosInstance';

// Google Fonts - insert in index.html ideally, but for demo included here as component:
const Fonts = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Lora&family=Playfair+Display:wght@700&display=swap');
    `}
  </style>
);

// Sample Testimonials
const testimonials = [
  {
    name: "Dr. Anjali Menon",
    role: "Professor of Physics",
    message: "PSG is a nurturing environment that truly fosters research and innovation.",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    name: "Mr. Arjun Reddy",
    role: "Lab Technician",
    message: "Working here is like being part of a big, supportive family.",
    image: "https://randomuser.me/api/portraits/men/44.jpg"
  },
  {
    name: "Ms. Neha Sharma",
    role: "Administrative Staff",
    message: "The culture of excellence at PSG motivates me every day.",
    image: "https://randomuser.me/api/portraits/women/12.jpg"
  }
];

// Simple Carousel for testimonials
function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-white shadow-lg rounded-3xl p-10 max-w-3xl mx-auto">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <img
          src={testimonials[index].image}
          alt={testimonials[index].name}
          className="mx-auto w-20 h-20 rounded-full shadow-md mb-6 object-cover border-4 border-indigo-900"
        />
        <p className="text-lg italic text-gray-700 mb-4">“{testimonials[index].message}”</p>
        <p className="text-indigo-900 font-semibold text-xl">{testimonials[index].name}</p>
        <p className="text-sm text-indigo-700">{testimonials[index].role}</p>
      </motion.div>
      {/* Dots */}
      <div className="flex justify-center space-x-3 mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full ${i === index ? 'bg-indigo-900' : 'bg-indigo-300'}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Job Details component (simplified)
function JobDetails({ jobs }) {
  const { id } = useParams();
  const job = jobs.find((j) => j.id === id);

  if (!job) return <p className="text-center text-red-600 mt-10">Job not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white rounded-3xl shadow-lg mt-12">
      <h1 className="text-4xl font-playfair text-indigo-900 mb-4">{job.title}</h1>
      <p className="text-indigo-700 font-semibold mb-6">{job.institution} — {job.jobCategory}</p>
      <p className="text-gray-800 whitespace-pre-line">{job.description}</p>
      <Link
        to="/"
        className="inline-block mt-8 px-6 py-3 bg-indigo-900 text-white rounded-full shadow-md hover:bg-indigo-700 transition"
      >
        Back to Careers
      </Link>
    </div>
  );
}

export default function CareerPage() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState({ institution: '', jobCategory: '' });
  const [page, setPage] = useState(1);
  const jobsPerPage = 3;

  // const fetchActiveJobs = async() =>{
  //   try{
  //       const res = await axiosInstance.get('/api/jobPost/getJobs?status=Active');
  //       console.log('Jobs-data',res.data);
  //       setJobs(res.data);
  //   }catch(err){
  //       console.error("Failed to fetch jobs", err);
  //   }
  // }

  useEffect(() => {
    // Mock job data
    //fetchActiveJobs();
    setJobs([
      {
        id: 'job1',
        title: 'Assistant Professor - Computer Science',
        institution: 'PSG College of Technology',
        jobCategory: 'Teaching',
        description:
          'We seek an Assistant Professor in Computer Science with a passion for teaching and research. Responsibilities include lecturing, guiding students, and research publication.'
      },
      {
        id: 'job2',
        title: 'Lab Technician',
        institution: 'PSG Institute of Medical Sciences',
        jobCategory: 'Non-Teaching',
        description:
          'Looking for an experienced Lab Technician to maintain lab equipment and assist in practical sessions.'
      },
      {
        id: 'job3',
        title: 'Associate Professor - Physics',
        institution: 'PSG College of Arts & Science',
        jobCategory: 'Teaching',
        description:
          'Experienced Associate Professor for the Physics department to lead research projects and deliver advanced courses.'
      },
      {
        id: 'job4',
        title: 'Administrative Officer',
        institution: 'PSG College of Technology',
        jobCategory: 'Non-Teaching',
        description:
          'Responsible for managing administrative activities, coordinating with departments, and ensuring smooth operations.'
      },
      {
        id: 'job5',
        title: 'Professor - Mathematics',
        institution: 'PSG College of Arts & Science',
        jobCategory: 'Teaching',
        description:
          'Senior position requiring outstanding teaching skills and a strong research background in Mathematics.'
      },
      {
        id: 'job6',
        title: 'Library Assistant',
        institution: 'PSG Institute of Medical Sciences',
        jobCategory: 'Non-Teaching',
        description:
          'Assist in managing library resources, cataloging, and supporting students and staff.'
      }
    ]);
  }, []);

  // Filtered jobs by category and institution
  const filteredJobs = jobs.filter(
    (job) =>
      (filter.institution === '' || job.institution === filter.institution) &&
      (filter.jobCategory === '' || job.jobCategory === filter.jobCategory)
  );

  // Pagination for each category
  const paginateJobs = (category) => {
    const filtered = filteredJobs.filter((job) => job.jobCategory === category);
    const totalPages = Math.ceil(filtered.length / jobsPerPage);
    const start = (page - 1) * jobsPerPage;
    const pagedJobs = filtered.slice(start, start + jobsPerPage);
    return { pagedJobs, totalPages };
  };

  const handlePageChange = (category, direction) => {
    const { totalPages } = paginateJobs(category);
    setPage((prev) => {
      if (direction === 'next' && prev < totalPages) return prev + 1;
      if (direction === 'prev' && prev > 1) return prev - 1;
      return prev;
    });
  };

  const renderJobSection = (category) => {
    const { pagedJobs, totalPages } = paginateJobs(category);
    return (
      <section aria-labelledby={`${category.toLowerCase()}-jobs`} className="mb-20">
        <h2
          id={`${category.toLowerCase()}-jobs`}
          className="text-4xl font-playfair text-indigo-900 mb-8 border-b-2 border-indigo-700 inline-block pb-1"
        >
          {category} Jobs
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          {pagedJobs.map((job) => (
            <motion.div
              key={job._id}
              className="bg-white p-6 rounded-3xl shadow-lg border border-indigo-200 hover:shadow-xl transition cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-2xl font-semibold text-indigo-900 font-playfair mb-2">{job.jobTitle}</h3>
              <p className="text-indigo-700 font-medium mb-3">{job.institution}</p>
              <p className="text-gray-700 line-clamp-4 mb-4">{job.description}</p>
              <Link
                     to={`/job/${job.id}`}
                     className="inline-block bg-indigo-600 text-white px-4 py-1.5 text-sm rounded-md hover:bg-indigo-700 transition"
                   >
                     More Details
                  </Link>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-6">
            <button
              onClick={() => handlePageChange(category, 'prev')}
              disabled={page === 1}
              className={`px-6 py-3 rounded-full bg-indigo-900 text-white font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 transition`}
            >
              Prev
            </button>
            <span className="text-indigo-900 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(category, 'next')}
              disabled={page === totalPages}
              className={`px-6 py-3 rounded-full bg-indigo-900 text-white font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 transition`}
            >
              Next
            </button>
          </div>
        )}
      </section>
    );
  };

  return (
    <>
      <Fonts />
      {/* Video Banner */}
      <header className="relative h-[450px] md:h-[550px] w-full overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover brightness-75"
          autoPlay
          loop
          muted
          playsInline
          src="/background.mp4"
          aria-label="Background video showing nature forest scene"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent flex flex-col justify-center items-center px-6 text-center text-white">
          <motion.h1
            className="text-5xl md:text-7xl font-playfair font-extrabold mb-4 drop-shadow-lg"
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          >
            Join PSG Institutions
          </motion.h1>
          <motion.p
            className="max-w-3xl text-xl md:text-2xl font-lora font-light drop-shadow-md"
            initial={{ y: 70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1.4, ease: 'easeOut' }}
          >
            Discover rewarding careers and grow with a community dedicated to excellence and innovation.
          </motion.p>
          {/* <Link
            to="/"
            className="mt-10 inline-block px-12 py-4 bg-indigo-900 hover:bg-indigo-700 rounded-full font-playfair font-semibold text-xl shadow-lg transition"
          >
            Explore Openings
          </Link> */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-12 py-16 bg-gradient-to-b from-gray-50 to-white rounded-t-3xl -mt-36 relative z-20 shadow-xl">
        {/* Filters */}
        <section className="flex flex-wrap justify-center gap-6 mb-16">
          <select
            value={filter.institution}
            onChange={(e) => setFilter((prev) => ({ ...prev, institution: e.target.value }))}
            className="px-5 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-lora text-lg"
            aria-label="Filter by Institution"
          >
            <option value="">All Institutions</option>
            {[...new Set(jobs.map((j) => j.institution))].map((inst) => (
              <option key={inst} value={inst}>
                {inst}
              </option>
            ))}
          </select>

          <select
            value={filter.jobCategory}
            onChange={(e) => setFilter((prev) => ({ ...prev, jobCategory: e.target.value }))}
            className="px-5 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-lora text-lg"
            aria-label="Filter by Job Category"
          >
            <option value="">All Job Categories</option>
            {[...new Set(jobs.map((j) => j.jobCategory))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </section>

        {/* Job Sections */}
        {renderJobSection('Teaching')}
        {renderJobSection('Non-Teaching')}

        {/* Branding Section */}
        <section
          className="bg-indigo-50 rounded-3xl p-14 max-w-5xl mx-auto text-center mb-20 shadow-lg border border-indigo-200"
          aria-label="Why Join PSG Institutions"
        >
          <motion.h2
            className="text-4xl font-playfair text-indigo-900 mb-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Join PSG Institutions?
          </motion.h2>
          <motion.p
            className="max-w-3xl mx-auto text-lg font-lora text-indigo-800 leading-relaxed tracking-wide"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            PSG Institutions have a legacy of academic excellence and innovation in education spanning decades.
            We nurture talent, foster research and community development, and provide a dynamic, inclusive work environment.
            Join us to be part of a journey dedicated to shaping future leaders and changemakers.
          </motion.p>
        </section>

        {/* Testimonials Carousel */}
        <section aria-label="Testimonials" className="max-w-4xl mx-auto mb-24">
          <h2 className="text-3xl font-playfair text-center text-indigo-900 mb-12">Hear From Our Team</h2>
          <Carousel />
        </section>

        {/* Call to Action */}
        <section className="text-center mb-24">
          <motion.h2
            className="text-4xl font-playfair font-extrabold mb-6 text-indigo-900"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Ready to Make an Impact?
          </motion.h2>
          {/* <Link
            to="/"
            className="inline-block px-14 py-5 bg-indigo-900 text-white rounded-full font-playfair font-semibold shadow-lg hover:bg-indigo-700 transition"
          >
            Explore All Openings
          </Link> */}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-900 text-indigo-100 text-center py-8 px-6 rounded-t-3xl">
        <p className="max-w-4xl mx-auto text-sm font-lora tracking-wide">
          © 2025 PSG Institutions. Dedicated to Excellence in Education and Research.
        </p>
      </footer>
    </>
  );
}
