import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from "../../Context/AuthContext";
import Header from "../../Components/common/MainHeader";
import { WarehouseRounded } from "@mui/icons-material";
import Footer from "../../Components/Footer"; // Add this at the top

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
      let jobCategory = auth?.jobCategory;
      if (!jobCategory || jobCategory === 'undefined') {
        jobCategory = '';
      }

      let url = `/api/jobPost/getJobs?status=Active`;
      if (jobCategory) {
        url += `&jobCategory=${jobCategory}`;
      }
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

  const renderJobSection = (category) => {
    const { pagedJobs, totalPages } = paginateJobs(category);
    return (
      <section className="mb-20">
        <h2 className="text-4xl font-playfair text-indigo-900 mb-8 border-b-2 border-indigo-700 inline-block pb-1">
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
              <p className="text-gray-700 line-clamp-4 mb-4">{`${job.location} | ${job.jobType}`}</p>
              <Link
                to={`/job/${job.jobId}`}
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
              className="px-6 py-3 rounded-full bg-indigo-900 text-white font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 transition"
            >
              Prev
            </button>
            <span className="text-indigo-900 font-medium">Page {page} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(category, 'next')}
              disabled={page === totalPages}
              className="px-6 py-3 rounded-full bg-indigo-900 text-white font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 transition"
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
      <div id="header-placeholder" /> {/* Placeholder for fixed header */}
      <Header />

      {/* Spacer so content begins below fixed header */}
      <div className="h-20" />

      <header className="relative h-[450px] md:h-[550px] w-full overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover brightness-75"
          autoPlay
          loop
          muted
          playsInline
          src="/background.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent flex flex-col justify-center items-center px-6 text-center text-white">
          <motion.h1
            className="text-5xl md:text-7xl font-playfair font-extrabold mb-4 drop-shadow-lg"
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          >
            Join PSG Institutions
          </motion.h1>
          <motion.p
            className="max-w-3xl text-xl md:text-2xl font-lora font-light drop-shadow-md"
            initial={{ y: 70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1.4, ease: "easeOut" }}
          >
            Discover rewarding careers and grow with a community dedicated to
            excellence and innovation.
          </motion.p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-7 sm:px-12 py-13 bg-white rounded-t-3xl -mt-36 relative z-20 shadow-xl">
        <section className="flex flex-wrap justify-center gap-6 mb-16">
          <select
            value={filter.institution}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, institution: e.target.value }))
            }
            className="px-5 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-lora text-lg"
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
            className="px-5 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-lora text-lg"
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
