// LandingPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import Footer from "../Components/Footer";
import image1 from "../assets/images/image_1.webp"
import { useAuth } from "../Context/AuthContext";
import { FaEye,FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

const carouselImages = ["/About2.jpg", "/About3.jpg", "/bridge.jpg"];

const categories = [
  { title: "Leadership", route: "/login", image: "/About2.jpg" },
  { title: "Faculty Recruitment", route: "/login", image: "/About3.jpg" },
  { title: "Project Recruitment", route: "/login", image: "/bridge.jpg" },
  { title: "Post-Doctoral Fellowship", route: "/login", image: "/About3.jpg" },
  { title: "Staff Recruitment", route: "/login", image: "/bridge.jpg" },
  { title: "Teaching Positions", route: "/login", image: "/About2.jpg" },
];

const staticTestimonials = [
  {
    name: "Prof. Meenakshi Sundaram",
    role: "Dean, Academic Affairs",
    message: "A career at PSG is not just a job—it's a mission to shape the future.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Dr. Shruti Nair",
    role: "Assistant Professor",
    message: "Supportive community, modern facilities, and a purpose‑driven vision.",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
];

const PAGE_SIZE = 5;

export default function LandingPage() {
  const [idx, setIdx] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [filterCat, setFilterCat] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const jobsRef = useRef();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form,setForm] = useState({email:"",password:""});
  const [showPassword,setShowPassword] = useState(false);

  const resetFields = () =>{
    setForm({email:"", password:""});
  }

  const handleChange = e =>{
    setForm({...form,[e.target.name]:e.target.value});
  }

  const handleSubmit = async(e) =>{
      e.preventDefault();
      try{
          const res = await axiosInstance.post('/api/auth/login',form);
          if(res.data.token){
              login(res.data.token,res.data.role,res.data.name,res.data.userId,res.data.jobCategory);
              if(res.data.role ==='user'){
                  navigate('/dashboard');
              }else{
                  navigate('/admin/dashboard');
              }
          } else {
              toast.error(res.data.message || 'Login failed');
          }
      
      }catch(err){
          const errorMsg = err.response?.data?.message || 'Login failed. Please try again.';
          toast.error(errorMsg);
      }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axiosInstance
      .get("/api/jobPost/getJobs?status=Active")
      .then((res) => setJobs(res.data))
      .catch(console.error);
  }, []);

  const filtered = jobs.filter((j) => {
    const titleMatch = j.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = j.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const catMatch = filterCat === "All" || j.jobCategory === filterCat;
    return catMatch && (titleMatch || descMatch);
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleViewDetails = (jobId) => {
    navigate(`/job/${jobId}`, { state: { fromLanding: true } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-blue-900 font-sans">
      {/* Hero Section */}
      <section className="relative h-[65vh] w-full overflow-hidden">
        <AnimatePresence>
          <motion.img
            key={carouselImages[idx]}
            src={carouselImages[idx]}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white px-2 z-20">
          <motion.img
            src="/Logo2.png"
            alt="Logo"
            className="h-46 sm:h-40 mb-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          />
          <motion.h1
            className="text-4xl sm:text-5xl font-bold font-serif mb-2 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent">
              Build Your Future with Us
            </span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl max-w-3xl text-white/90 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Explore exciting opportunities in a vibrant academic and research environment.
          </motion.p>
        </div>
      </section>

      {/*About & login section*/}
      <section className="py-10 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[550px]">

          {/* Left Illustration + Welcome Text */}
          <div className="w-full lg:w-3/4 flex flex-col justify-center px-6 py-10 bg-white mb-12">
            <img
              src={image1} 
              alt="PSG Illustration"
              className="w-full h-full bg-contain mb-6"
            />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
              PSG & Son's Charities
            </h2>
            <p className="text-lg text-gray-700 font-semibold leading-relaxed mb-4">
              Let there be Charity. So that others can share my family's prosperity
            </p>
            <p className="text-md text-gray-700 ">Shri P S Govindaswamy Naidu - Founder</p>
          </div>

          {/* Right Login Form */}
          <div className="w-full lg:w-1/4 border-t lg:border-t-0 lg:border-l border-gray-200 px-6 py-10 bg-white flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-1">PSG Careers</h2>
            <p className="text-sm text-gray-600 mb-6">Start your career on the right path</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full mt-1 px-4 py-2 bg-gray-100 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full mt-1 px-4 py-2 bg-gray-100 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
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
                <a href="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</a>
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
                  className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>

              <p className="text-sm text-center text-gray-600 mt-2">
                No account? <a href="/register" className="text-blue-600 font-medium hover:underline">Create One</a>
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <main className="flex-grow bg-white">
        <section ref={jobsRef} className="py-12 max-w-7xl mx-auto px-6">
           <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search job titles or keywords..."
            className="w-80 mb-10 p-3 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <h2 className="text-3xl font-serif text-blue-900 mb-6">Open Positions</h2>
          <div className="space-y-6">
            {paginated.map((job) => (
              <motion.div
                key={job._id}
                className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-md transition"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold text-blue-800">{job.jobTitle}</h3>
                <p className="text-blue-600">{job.location} | {job.jobType}</p>
                <div className="mt-2 flex gap-4">
                  <button
                    onClick={() => handleViewDetails(job.jobId)}
                    className="text-blue-700 hover:underline"
                  >
                    View Details
                  </button>
                  <Link
                    to="/login"
                    className="text-white bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
                  >
                    Apply
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-blue-700 text-white rounded disabled:bg-gray-300"
            >
              Prev
            </button>
            <span className="text-blue-900 font-medium">
              Page {page} of {Math.ceil(filtered.length / PAGE_SIZE)}
            </span>
            <button
              disabled={page * PAGE_SIZE >= filtered.length}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-blue-700 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-semibold text-center mb-8">What Our People Say</h2>
          {staticTestimonials.length > 0 && (
            <motion.div
              className="bg-blue-50 p-8 rounded-xl shadow-inner text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <img
                src={staticTestimonials[idx % staticTestimonials.length].image}
                alt="Testimonial"
                className="inline-block w-24 h-24 rounded-full border-4 border-blue-700 mb-4"
              />
              <p className="italic text-lg text-blue-900">
                “{staticTestimonials[idx % staticTestimonials.length].message}”
              </p>
              <h4 className="text-blue-700 font-semibold mt-2">
                {staticTestimonials[idx % staticTestimonials.length].name}
              </h4>
              <p className="text-blue-500">
                {staticTestimonials[idx % staticTestimonials.length].role}
              </p>
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}



 