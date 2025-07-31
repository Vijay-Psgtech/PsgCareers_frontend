import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import Footer from "../Components/Footer";
import LandingHeader from "../Components/LandingHeader";
import image1 from "../assets/images/image_1.webp";
import { useAuth } from "../Context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const carouselImages = ["/About2.jpg", "/About3.jpg"];
const PAGE_SIZE = 6;

export default function LandingPage() {
  const [idx, setIdx] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [filterCat, setFilterCat] = useState("Categories");
  const [filterInst, setFilterInst] = useState("Institutions");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupForm, setPopupForm] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    resume: null,
  });
  const jobsRef = useRef();
  const navigate = useNavigate();

  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axiosInstance
      .get("/api/jobPost/getJobs?status=Active")
      .then((res) => {
        console.log("Jobs fetched:", res.data); // Optional debug log
        setJobs(res.data);
      })
      .catch(console.error);
  }, []);

  const institutions = [
    "Institutions",
    ...Array.from(
      new Set(jobs.filter((j) => j.institution).map((j) => j.institution))
    ),
  ];
  const categories = ["Categories", "Teaching", "Non Teaching"];

  const filtered = jobs.filter((j) => {
    const titleMatch = j.jobTitle
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const descMatch = j.description
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const catMatch = filterCat === "Categories" || j.jobCategory === filterCat;
    const instMatch =
      filterInst === "Institutions" || j.institution === filterInst;
    return catMatch && instMatch && (titleMatch || descMatch);
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleViewDetails = (jobId) => {
    navigate(`/job/${jobId}`, { state: { fromLanding: true } });
  };

  const resetFields = () => {
    setForm({ email: "", password: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/api/auth/login", form);
      if (res.data.token) {
        login(
          res.data.token,
          res.data.role,
          res.data.name,
          res.data.userId,
          res.data.jobCategory
        );
        navigate(res.data.role === "user" ? "/dashboard" : "/admin/dashboard");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    const trackLandingVisit = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const visitorId = result.visitorId;

        await axiosInstance.post('/api/visitors/landing-visit', {
          fingerprint: visitorId
        });
      } catch (err) {
        console.error('Error tracking landing visit:', err);
      }
    };

    trackLandingVisit();
  }, []);

  const handlePopupChange = (e) => {
    const { name, value } = e.target;
    setPopupForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPopupForm((prev) => ({ ...prev, resume: file }));
    }
  };

  const handleResumeDelete = () => {
    setPopupForm((prev) => ({ ...prev, resume: null }));
  };

  const handlePopupSubmit = async (e) => {
    e.preventDefault();

    if (
      !popupForm.name ||
      !popupForm.email ||
      !popupForm.phone ||
      !popupForm.education
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", popupForm.name);
    formData.append("email", popupForm.email);
    formData.append("phone", popupForm.phone);
    formData.append("education", popupForm.education);
    if (popupForm.resume) {
      formData.append("resume", popupForm.resume);
    }

    try {
      await axiosInstance.post("/api/applications/save-draft", formData);
      toast.success("Draft saved successfully!");
      setShowPopup(false);
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft.");
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-white text-blue-900 font-sans">
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative h-[95vh] w-full overflow-hidden">
        <AnimatePresence>
          <motion.img
            key={carouselImages[idx]}
            src={carouselImages[idx]}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            loading="lazy"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white px-4 z-20 text-center">
          <motion.img
            src="/Logo2.png"
            alt="Logo"
            className="h-36 sm:h-40 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            loading="lazy"
          />
          <motion.h1
            className="text-4xl sm:text-5xl font-extrabold font-serif mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
             PSG Careers
            </span>
          </motion.h1>
          <motion.h1
            className="text-2xl sm:text-4xl font-bold font-serif mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent">
              Build Your Future with Us
            </span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl max-w-3xl text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            Explore exciting opportunities in a vibrant academic and research
            environment.
          </motion.p>
        </div>
        {showPopup && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white/90 border border-blue-200 p-6 rounded-2xl w-full max-w-lg shadow-2xl">
              <h3 className="text-2xl font-semibold text-blue-800 mb-6 text-center">
                Easy Apply Form
              </h3>
              <form onSubmit={handlePopupSubmit} className="space-y-4">
                <input
                  name="name"
                  value={popupForm.name}
                  onChange={handlePopupChange}
                  placeholder="Name"
                  className="w-full border border-amber-200 px-2 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="email"
                  value={popupForm.email}
                  onChange={handlePopupChange}
                  placeholder="Email"
                  className="w-full border border-amber-200 px-2 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="phone"
                  value={popupForm.phone}
                  onChange={handlePopupChange}
                  placeholder="Mobile Number"
                  className="w-full border border-amber-200 px-2 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="education"
                  value={popupForm.education}
                  onChange={handlePopupChange}
                  placeholder="Highest Qualification"
                  className="w-full border border-amber-200 px-2 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Resume
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  {popupForm.resume && (
                    <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                      <span className="text-sm text-gray-700 truncate w-4/5">
                        {popupForm.resume.name}
                      </span>
                      <button
                        type="button"
                        onClick={handleResumeDelete}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ✕
                      </button>

                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                      />
                      {popupForm.resume && (
                        <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                          <span className="text-sm text-gray-700 truncate w-4/5">
                            {popupForm.resume.name}
                          </span>
                          <button
                            type="button"
                            onClick={handleResumeDelete}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* About & Login Section */}
      <section className="py-10 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg flex flex-col lg:flex-row h-auto lg:h-[600px]">
          <div className="w-full lg:w-3/4 flex flex-col justify-center px-6 py-10 bg-white">
            <img
              src={image1}
              alt="PSG Illustration"
              className="w-full h-full bg-contain mb-6"
              loading="lazy"
            />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
              PSG & Son's Charities
            </h2>
            <p className="text-lg text-gray-700 font-semibold leading-relaxed mb-4">
              Let there be Charity. So that others can share my family's
              prosperity
            </p>
            <p className="text-md text-gray-700 mb-6">
              — Shri P S Govindaswamy Naidu, Founder
            </p>
            <a
              href="https://www.psgsonscharities.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-fit px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700"
            >
              Know More →
            </a>
          </div>

          <div className="w-full lg:w-1/4 border-t lg:border-t-0 lg:border-l border-gray-200 px-6 py-10 bg-white flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-1">
              Login / Register
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full mt-1 px-4 py-2 bg-gray-100 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full mt-1 px-4 py-2 bg-gray-100 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-600"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>

              <div className="flex justify-end text-sm">
                <a
                  href="/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={resetFields}
                  className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>

              <p className="text-sm text-center text-gray-600 mt-2">
                No account?{" "}
                <a
                  href="/register"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Create One
                </a>
              </p>
            </form>
            {/* Easy Apply Without Registration */}
            <div className="mt-10 p-6 bg-blue-100 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Don’t want to register?
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Share your basic details and resume – we’ll reach out if there's a suitable match!
              </p>
              <button
                onClick={() => setShowPopup(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Submit Without Registering
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="py-10 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search job titles or keywords..."
              className="flex-1 px-4 py-2 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-1/2">
              <select
                value={filterInst}
                onChange={(e) => setFilterInst(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
              >
                {institutions.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <main className="flex-col bg-white">
        <section ref={jobsRef} className="py-12 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-serif text-blue-900 mb-6">
            Open Positions
          </h2>
          {paginated.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {paginated.map((job) => (
                <motion.div
                  key={job._id}
                  className="bg-white border border-blue-100 p-8 rounded-xl shadow hover:shadow-md transition"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-lg font-semibold text-indigo-900 mb-1">
                    {job.jobTitle}
                  </h3>
                  <p className="text-sm text-indigo-600 mb-1">
                    {job.instituteName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {job.location} | {job.jobType}
                  </p>
                  {job.institution && (
                    <p className="text-shadow-xs antialiased text-indigo-900 mt-3 font-mono font-light">
                      {job.institution}
                    </p>
                  )}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleViewDetails(job.jobId || job._id)}
                      className="text-white bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700 text-sm"
                    >
                      More Details
                    </button>
                    <Link
                      to="/login"
                      className="text-white bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 text-sm"
                    >
                      Apply
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              No active job listings found.
            </p>
          )}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => {
                if (page > 1) {
                  setPage(page - 1);
                  jobsRef.current?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              disabled={page === 1}
              className="px-3 py-1 rounded text-blue-700 hover:bg-blue-100 disabled:text-gray-400"
            >
              ←
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setPage(pageNum);
                    jobsRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`px-4 py-2 rounded ${
                    page === pageNum
                      ? "bg-blue-700 text-white"
                      : "text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => {
                if (page < totalPages) {
                  setPage(page + 1);
                  jobsRef.current?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              disabled={page === totalPages}
              className="px-2 py-2 rounded text-cyan-900 hover:bg-blue-100 disabled:text-gray-400"
            >
              →
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}