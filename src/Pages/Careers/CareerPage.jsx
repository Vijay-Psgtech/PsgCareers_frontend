import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from "../../Context/AuthContext";
import Header from "../../Components/common/MainHeader";
import Footer from "../../Components/Footer"; 
import { FaChalkboardTeacher, FaUserTie, FaChevronDown, FaChevronUp } from "react-icons/fa";

const Fonts = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Lora&family=Playfair+Display:wght@700&display=swap');
    `}
  </style>
);

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

function Carousel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-white shadow-lg rounded-3xl p-6 sm:p-10 w-full max-w-3xl mx-auto">
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

function CareerPage() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState({ institution: '', jobCategory: '' });
  const [page, setPage] = useState(1);
  const jobsPerPage = 4;
  const {auth} = useAuth();

  const fetchActiveJobs = async () => {
    try {
      let url = `/api/jobPost/getJobs?status=Active`;
      const res = await axiosInstance.get(url);
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  useEffect(() => {
    fetchActiveJobs();
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      (filter.institution === '' || job.institution === filter.institution) &&
      (filter.jobCategory === '' || job.jobCategory === filter.jobCategory)
  );

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

  const [openSections, setOpenSections] = useState({});
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && auth?.jobCategory) {
      setOpenSections({
        Teaching: auth.jobCategory === 'Teaching',
        'Non Teaching': auth.jobCategory === 'Non Teaching'
      });
      setInitialized(true);
    }
  }, [auth?.jobCategory, initialized]);

  const toggleSection = (category) => {
    setOpenSections(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getCategoryIcon = (category) => {
    return category === "Teaching" ? <FaChalkboardTeacher className="text-indigo-700 mr-2" />
          : <FaUserTie className="text-indigo-700 mr-2" />;
  };

  const renderJobSection = (category) => {
    const isOpen = openSections[category];

    const { pagedJobs, totalPages } = paginateJobs(category);
    return (
      <section className="mb-20">
        {/* Toggle Header */}
        <div onClick={() => toggleSection(category)} className="flex items-center justify-between cursor-pointer mb-4">
          <h2 className="flex items-center text-2xl font-semibold text-indigo-900">
            {getCategoryIcon(category)}
            {category} Jobs
          </h2>
           <span className="text-indigo-700 text-xl">
              {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
        </div>
        
         {/* Collapsible Content */}
        {isOpen && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {pagedJobs.map((job) => (
                <motion.div
                  key={job._id}
                  className="bg-white p-6 rounded-2xl shadow-md border border-indigo-100 hover:shadow-lg transition"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-xl sm:text-2xl font-semibold text-indigo-900 font-playfair mb-2">{job.jobTitle}</h3>
                  <p className="text-indigo-700 mb-1">{job.institution}</p>
                  <p className="text-gray-700 line-clamp-4 mb-4">{`${job.location} | ${job.jobType}`}</p>
                  {auth.jobCategory === category && (
                    <Link
                      to={`/job/${job.jobId}`}
                      className="inline-block mt-3 bg-indigo-600 text-white px-4 py-1.5 text-sm rounded-md hover:bg-indigo-700 transition"
                    >
                      More Details
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => handlePageChange(category, 'prev')}
                  disabled={page === 1}
                  className="px-4 py-2 rounded bg-indigo-700 text-white hover:bg-indigo-600 disabled:bg-indigo-300"
                >
                  Prev
                </button>
                <span className="text-indigo-900">Page {page} of {totalPages}</span>
                <button
                  onClick={() => handlePageChange(category, 'next')}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded bg-indigo-700 text-white hover:bg-indigo-600 disabled:bg-indigo-300"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    );
  };

  return (
    <>
      <Fonts />
      <div id="header-placeholder" /> {/* Placeholder for fixed header */}
      <Header />

      {/* Spacer so content begins below fixed header */}
      <div className="h-20" />

      <header className="relative h-[450px] md:h-[550px] w-full overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover object-center brightness-75"
          autoPlay
          loop
          muted
          playsInline
          src="/background.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent flex flex-col justify-center items-center px-6 text-center text-white">
          <motion.h1
            className="text-4xl md:text-6xl font-playfair font-extrabold mb-4 drop-shadow-lg"
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          >
            Join PSG Institutions
          </motion.h1>
          <motion.p
            className="max-w-3xl text-lg sm:text-xl md:text-2xl font-lora font-light drop-shadow-md"
            initial={{ y: 70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1.4, ease: "easeOut" }}
          >
            Discover rewarding careers and grow with a community dedicated to excellence and innovation.
          </motion.p>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-10 bg-white rounded-t-3xl -mt-36 relative z-20 shadow-xl">
        <section className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-12">
          <select
            value={filter.institution}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, institution: e.target.value }))
            }
            className="px-5 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-lora text-base sm:text-lg"
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
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, jobCategory: e.target.value }))
            }
            className="px-5 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-lora text-base sm:text-lg"
          >
            <option value="">All Categories</option>
            {[...new Set(jobs.map((j) => j.jobCategory))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </section>

        {renderJobSection("Teaching")}
        {renderJobSection("Non Teaching")}

        <Carousel />
      </main>
      <Footer />
    </>
  );
}

export default CareerPage;
