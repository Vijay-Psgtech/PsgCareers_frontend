import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../Context/AuthContext";
import { motion } from "framer-motion";


const StageBar = ({ currentStage }) => {
  const stageSteps = [
    "Applied",
    "Profile Screening",
    "Lvl 1 Screening",
    "Lvl 2 Screening",
    "Interview",
    "Selected",
    "Not Selected"
  ];

  const currentIndex = stageSteps.indexOf(currentStage);
  const progressPercent = ((currentIndex + 1) / stageSteps.length) * 100;

  // Color logic
  const getColor = () => {
    if (currentStage === "Selected") return "bg-green-500";
    if (currentStage === "Not Selected") return "bg-red-500";
    return "bg-blue-500";
  };

  const getTextColor = () => {
    if (currentStage === "Selected") return "text-green-600";
    if (currentStage === "Not Selected") return "text-red-600";
    return "text-blue-600";
  };

  return (
    <div className="w-full px-2">
      <div className="text-sm font-medium mb-2">
        Current Stage: <span className={getTextColor()}>{currentStage}</span>
      </div>

      <div className="relative w-full flex items-center gap-2">
        {/* Step Dots with Tooltip */}
        {stageSteps.map((stage, index) => (
          <div key={stage} className="flex flex-col items-center relative group">
            <div
              className={`w-6 h-6 rounded-full text-xs flex items-center justify-center ${
                index <= currentIndex ? getColor() : "bg-gray-300"
              } text-white transition-all duration-300`}
            >
              {index + 1}
            </div>
            <div className="absolute top-8 w-max text-sm text-gray-900 whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
              {stage}
            </div>
            {/* Connecting line */}
            {index < stageSteps.length - 1 && (
              <div className="absolute left-full top-1/2 w-10 h-1 bg-gray-300 -translate-y-1/2 z-0">
                {index < currentIndex && (
                  <div className={`h-full ${getColor()} transition-all duration-300`} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full mt-4 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
};





export default function UserDashboard() {
  const { auth } = useAuth();
  const userId = auth?.userId;
  const userName = auth?.name || "User";

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      if (!userId) return;
      try {
        const res = await axiosInstance.get(`/api/applications/status/${userId}`);
        if (res.data.success) {
          setApplications(res.data.applications);
        }
      } catch (err) {
        console.error("Failed to load applications:", err);
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, [userId]);



  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span className="ml-2 text-gray-600 font-medium">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-center text-blue-600 mb-6">
          Hello, {userName}
        </h1>
        <p className="text-center text-gray-700 mb-10 text-md">
          {applications.length > 0
            ? `You have applied for ${applications.length} ${applications.length === 1 ? "job" : "jobs"}.`
            : "No applications submitted yet."}
        </p>

        <div className="space-y-8">
          {applications.map((app, index) => {


            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4 text-white">
                  <h2 className="text-2xl font-bold">{app.jobTitle}</h2>
                  <p className="text-sm mt-1">
                    <strong>Job ID:</strong> {app.jobId} |{" "}
                    <strong>Department:</strong> {app.department}
                  </p>
                </div>

                {/* Stage Info */}
                <div className="px-6 py-4 border-b border-blue-100">
                  <p className="text-lg font-semibold text-gray-800">
                    Status for <span className="text-blue-600">{app.jobTitle}</span>
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-5">
                  <StageBar currentStage={app.stage} />
                </div>

                {/* Footer */}
                <div className="bg-blue-50 px-6 py-3 text-sm text-gray-600 flex justify-between items-center">
                  <span>
                    Last Updated: {new Date(app.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}