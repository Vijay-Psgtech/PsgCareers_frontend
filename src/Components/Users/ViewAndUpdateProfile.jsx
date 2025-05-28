import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircle,
  GraduationCap,
  FlaskConical,
  Briefcase,
  MoreHorizontal,
} from "lucide-react";

const userId = "12345";

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

const ViewAndUpdateProfile = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Manage Your Profile
      </h1>

      <div className="space-y-5">
        {sectionData.map((section, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-200"
          >
            <div className="flex items-center space-x-4">
              {section.icon}
              <span className="text-lg font-medium text-gray-800">
                {section.title}
              </span>
            </div>
            <button
              onClick={() => navigate(`/profile/${section.route}/${userId}`)}
              className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition"
            >
              Edit Details
            </button>
          </div>
        ))}
      </div>

      <p className="text-sm mt-8 text-gray-500 text-center">
        <strong>Note:</strong> Click "Edit Details" to view and update each
        section of your profile.
      </p>
    </div>
  );
};

export default ViewAndUpdateProfile;
