import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const applicationStages = [
  { label: "Applied", key: "appliedDate" },
  { label: "Application Sent", key: "sentDate" },
  { label: "Awaiting Recruiter Action", key: "awaitingDate" },
  { label: "Status Delivered", key: "deliveredDate" },
];

export default function Dashboard() {
  const [applicationStatus, setApplicationStatus] = useState({
    id: "PSG-2025-00123",
    jobTitle: "Web Developer",
    category: "Non Teaching",
    department: "Central IT - PSG Institutions",
    viewSimilarUrl: "#",
    status: "Selected", // Change to 'Not Selected' to test other branch
    updatedAt: "23 May ’25",
    timeline: {
      appliedDate: "21 May ’25",
      sentDate: "21 May ’25",
      awaitingDate: "22 May ’25",
      deliveredDate: "23 May ’25",
    },
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (applicationStatus.status === "Selected") {
      setTimeout(() => setShowModal(true), 500);
    }
  }, [applicationStatus.status]);

  const getStageStatus = (key) => {
    if (applicationStatus.timeline[key]) return "completed";
    const keys = Object.keys(applicationStatus.timeline);
    const index = keys.indexOf(key);
    const previousKey = keys[index - 1];
    return applicationStatus.timeline[previousKey] ? "current" : "upcoming";
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-800">
      <h1 className="text-4xl font-bold mb-10 text-blue-900">
        Application Dashboard
      </h1>

      <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-3xl shadow-lg p-6 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {applicationStatus.jobTitle}
              <span className="text-base font-normal text-gray-500">
                {" "}
                - {applicationStatus.category}
              </span>
            </h2>
            <p className="text-gray-600 mt-1">{applicationStatus.department}</p>
          </div>
          <a
            href={applicationStatus.viewSimilarUrl}
            className="text-blue-600 text-sm font-medium hover:underline mt-3 md:mt-0"
          >
            View similar jobs
          </a>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-8">
          Application Status
        </h3>

        <div className="flex justify-between items-center relative">
          {applicationStages.map((stage, index) => {
            const status = getStageStatus(stage.key);
            const isLast = index === applicationStages.length - 1;
            const isDelivered =
              stage.key === "deliveredDate" &&
              applicationStatus.timeline.deliveredDate;

            return (
              <div
                key={stage.label}
                className="flex-1 relative flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 z-10 border-2 
                    ${
                      status === "completed"
                        ? "bg-green-600 text-white border-green-600"
                        : status === "current"
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-200 text-gray-500 border-gray-300"
                    }`}
                >
                  {isDelivered && applicationStatus.status === "Selected" ? (
                    <motion.div
                      className="w-3 h-3 rounded-full bg-green-500 animate-ping absolute"
                      style={{ zIndex: -1 }}
                    />
                  ) : isDelivered &&
                    applicationStatus.status === "Not Selected" ? (
                    <motion.div
                      className="w-3 h-3 rounded-full bg-red-500 animate-ping absolute"
                      style={{ zIndex: -1 }}
                    />
                  ) : null}

                  {status === "completed" ? (
                    <CheckCircle size={18} />
                  ) : (
                    <Clock size={18} />
                  )}
                </motion.div>

                <p className="text-sm font-medium text-gray-700">
                  {stage.label}
                  {applicationStatus.timeline[stage.key] && (
                    <span className="block text-xs text-gray-500 mt-1">
                      {applicationStatus.timeline[stage.key]}
                    </span>
                  )}
                </p>

                {!isLast && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-1 -z-10
                    ${
                      getStageStatus(applicationStages[index + 1].key) !==
                      "upcoming"
                        ? "bg-green-400"
                        : "bg-gray-200"
                    }`}
                    style={{ transform: "translateX(50%)" }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Metadata */}
        <div className="mt-10 text-sm text-gray-700 space-y-2 border-t pt-6">
          <p>
            <strong>Application ID:</strong> {applicationStatus.id}
          </p>
          <p>
            <strong>Status:</strong> {applicationStatus.status}
          </p>
          <p>
            <strong>Last Updated:</strong> {applicationStatus.updatedAt}
          </p>
        </div>

        {/* Not Selected Message */}
        {applicationStatus.status === "Not Selected" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-red-100 text-red-700 px-4 py-3 rounded-xl font-medium text-center"
          >
            We regret to inform you that your profile was not selected.
          </motion.div>
        )}
      </div>

      {/* Modal for Selection */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Congratulations!
              </h2>
              <p className="text-gray-700">
                You have been <strong>selected</strong> for the next phase of
                recruitment.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-6 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}