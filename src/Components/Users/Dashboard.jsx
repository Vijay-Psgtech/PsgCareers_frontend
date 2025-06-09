import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../Context/AuthContext";
import { motion } from "framer-motion";

const applicationStages = [
  { label: "Applied", key: "appliedDate" },
  { label: "Application Sent", key: "sentDate" },
  { label: "Awaiting Recruiter Action", key: "awaitingDate" },
  { label: "Status Delivered", key: "deliveredDate" },
];

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

  const getCompletedCount = (timeline) => {
    let count = 0;
    applicationStages.forEach((stage, idx) => {
      if (timeline[stage.key]) count = idx + 1;
    });
    return count;
  };

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
            const timeline = app.timeline || {};
            const completedCount = getCompletedCount(timeline);
            const progressPercent = Math.round(
              (completedCount / applicationStages.length) * 100
            );
            const currentStage =
              applicationStages[
                Math.min(completedCount, applicationStages.length - 1)
              ].label;

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
                  <p className="text-sm text-gray-600 mt-1">
                    Current Stage: <strong>{currentStage}</strong>
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-5">
                  <div className="relative flex justify-between items-center">
                    {applicationStages.map((stage, idx) => {
                      const isCompleted = idx < completedCount;
                      const isCurrent = idx === completedCount;
                      const dateLabel = timeline[stage.key];

                      const circleBorder = isCompleted
                        ? "border-blue-600"
                        : isCurrent
                        ? "border-yellow-500"
                        : "border-gray-300";
                      const circleBg = isCompleted
                        ? "bg-blue-600"
                        : isCurrent
                        ? "bg-white"
                        : "bg-gray-200";
                      const iconColor = isCompleted
                        ? "text-white"
                        : isCurrent
                        ? "text-yellow-500"
                        : "text-gray-500";

                      return (
                        <div key={stage.key} className="flex flex-col items-center w-1/4 relative">
                          {idx > 0 && (
                            <div
                              className={`absolute top-5 -left-1/2 w-full h-1 ${
                                isCompleted ? "bg-blue-500" : "bg-gray-300"
                              }`}
                            />
                          )}
                          <div
                            className={`w-10 h-10 rounded-full border-2 ${circleBorder} ${circleBg} flex items-center justify-center`}
                          >
                            {isCompleted ? (
                              <svg
                                className="h-5 w-5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414L9 14.414l-3.707-3.707a1 1 0 011.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 ${iconColor}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 8v4l3 3"
                                />
                              </svg>
                            )}
                          </div>
                          <p className="mt-2 text-sm font-medium text-gray-700">{stage.label}</p>
                          {dateLabel && (
                            <p className="text-xs text-gray-500">{dateLabel}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-blue-50 px-6 py-3 text-sm text-gray-600 flex justify-between items-center">
                  <span>
                    Last Updated: {new Date(app.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="italic">Progress: {progressPercent}%</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}