import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircle,
  GraduationCap,
  FlaskConical,
  Briefcase,
  MoreHorizontal,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../Context/AuthContext";

const ViewAndUpdateProfile = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const userId = auth?.userId;
  const jobCategory = auth?.jobCategory;

  const [applicationId, setApplicationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sectionData = [
    {
      title: "Personal Information",
      route: "personal-details",
      icon: <UserCircle className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: "Educational Details",
      route: "educational-details",
      icon: <GraduationCap className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: "Research Contribution",
      route: "research-contribution",
      icon: <FlaskConical className="h-6 w-6 text-indigo-600" />,
      forTeachingOnly: true,
    },
    {
      title: "Work Experience",
      route: "work-experience",
      icon: <Briefcase className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: "Others",
      route: "other-details",
      icon: <MoreHorizontal className="h-6 w-6 text-indigo-600" />,
    },
  ];

  useEffect(() => {
    const fetchLatestSubmittedApplication = async () => {
      if (!userId) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get(`/api/applications/getByUserId/${userId}`);
        const submittedApp = res.data;

        if (submittedApp?.isSubmitted) {
          setApplicationId(submittedApp.applicationId);
        } else {
          setError("No submitted application found to view or edit.");
        }
      } catch (err) {
        console.error("Error fetching submitted application:", err);
        setError("Failed to fetch application data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestSubmittedApplication();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading profile…</div>;
  }

  if (error || !applicationId) {
    return <div className="text-center py-10 text-red-500">{error || "No submitted application found."}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
        Manage Your Profile
      </h1>

      <div className="grid gap-5 sm:grid-cols-1">
        {sectionData
          .filter((section) => !section.forTeachingOnly || jobCategory === "Teaching")
          .map((section, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                {section.icon}
                <span className="text-base sm:text-lg font-medium text-gray-800">
                  {section.title}
                </span>
              </div>
              <button
                onClick={() =>
                  navigate(`/profile/${section.route}/${userId}/${applicationId}`)
                }
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition self-start sm:self-auto"
              >
                Edit Details
              </button>
            </div>
          ))}
      </div>

      <p className="text-sm mt-8 text-gray-500 text-center">
        <strong>Note:</strong> Click "Edit Details" to view and update each
        section of your submitted application.
      </p>
    </div>
  );
};

export default ViewAndUpdateProfile;