// MyAccount.jsx

import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../Context/AuthContext";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../Components/ui/tabs";
import { Input } from "../../Components/ui/input";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function MyAccount() {
  const { auth } = useAuth();
  const userId = auth?.userId;
  const navigate = useNavigate();

  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    location: "",
    mobile: "",
    applicantId: "",
    photo: "",
  });
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [loginHistory, setLoginHistory] = useState([]);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [passwordChangeCount, setPasswordChangeCount] = useState(null);
  const [preview, setPreview] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5174";

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/api/user/${userId}`);
      setProfile((prev) => ({ ...prev, ...res.data }));
      setPasswordChangeCount(res.data.passwordChangeCount || 0);
    } catch {
      toast.error("Error fetching user profile");
    }
  }, [userId]);

  const fetchApplications = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/api/user/application/count/${userId}`);
      setApplicationsCount(res.data.count || 0);
    } catch {
      toast.error("Error fetching application count");
    }
  }, [userId]);

  const fetchLoginHistory = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/api/user/login-history/${userId}`);
      const sorted = (res.data.history || []).sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setLoginHistory(sorted);
    } catch (err) {
      console.error("Error fetching login history:", err);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchApplications();
      fetchLoginHistory();
    }
  }, [userId, fetchProfile, fetchApplications, fetchLoginHistory]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files?.[0]) {
      const file = files[0];
      if (file.size > 10 * 1024 * 1024)
        return toast.error("File must be under 10MB.");
      if (!["image/jpeg", "image/png"].includes(file.type))
        return toast.error("Only JPG and PNG formats allowed.");
      setPreview(URL.createObjectURL(file));
      setProfile((prev) => ({ ...prev, photo: file }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("first_name", profile.first_name);
      formData.append("last_name", profile.last_name);
      formData.append("location", profile.location);
      formData.append("mobile", profile.mobile);
      if (profile.photo instanceof File) {
        formData.append("photo", profile.photo);
      }

      await axiosInstance.put(`/api/user/update/${userId}`, formData);
      toast.success("Profile updated successfully.");
      setPreview(null);
      fetchProfile();
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  const handlePasswordChange = async () => {
    try {
      const res = await axiosInstance.put(`/api/user/password/${userId}`, {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });

      toast.success(res.data.message);
      setPasswordChangeCount(res.data.changeCount);
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    }
  };

  const resolvedPhoto =
    preview ||
    (profile.photo instanceof File
      ? URL.createObjectURL(profile.photo)
      : profile.photo?.startsWith("http")
      ? profile.photo
      : `${BASE_URL}${profile.photo}`) ||
    "/default-avatar.png";

  const extractDevice = (ua) => ua?.split("(")?.[1]?.split(")")?.[0] || "Unknown Device";
  const extractBrowser = (ua) => ua?.split(" ")?.[0] || "Unknown Browser";

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex gap-4 justify-center border-b border-blue-300 pb-2 mb-6">
          <TabsTrigger value="profile">👤 Profile</TabsTrigger>
          <TabsTrigger value="password">🔒 Password</TabsTrigger>
          <TabsTrigger value="login">📜 Login History ({loginHistory.length})</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <AnimatePresence mode="wait" initial={false}>
          {tab === "profile" && (
            <TabsContent value="profile" asChild>
              <motion.div
                key="tab-profile"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-black shadow-2xl rounded-2xl p-10 space-y-6"
              >
                <div className="flex items-center gap-10">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-300 shadow-md">
                    <img src={resolvedPhoto} alt="Profile" className="w-full h-full object-cover" />
                    <label className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow cursor-pointer">
                      ✏️
                      <input type="file" name="photo" onChange={handleInputChange} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 font-semibold">
                      Last Login:{" "}
                      {loginHistory?.[0]?.timestamp
                        ? dayjs(loginHistory[0].timestamp).format("MMM DD YYYY, hh:mm A")
                        : "—"}
                    </p>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      Jobs Applied:
                      <span
                        onClick={() => navigate("/dashboard")}
                        className="inline-block bg-blue-600 text-white px-2 py-1 rounded-full cursor-pointer hover:bg-blue-700 ml-3.5"
                      >
                        {applicationsCount}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <LabelWithEdit label="First Name" field="first_name" value={profile.first_name} onChange={handleInputChange} />
                  <LabelWithEdit label="Last Name" field="last_name" value={profile.last_name} onChange={handleInputChange} />
                  <LabelWithEdit label="Location" field="location" value={profile.location} onChange={handleInputChange} />
                  <LabelWithEdit
                    label="Mobile"
                    field="mobile"
                    value={profile.mobile}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        mobile: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                  />
                  <ReadOnlyField label="Email" value={profile.email} />
                  <ReadOnlyField
                    label="Applicant ID"
                    value={profile.applicantId || `PSG${userId?.slice?.(-4)}`}
                  />
                </div>

                <div className="text-right">
                  <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </TabsContent>
          )}

          {/* Password Tab */}
          {tab === "password" && (
            <TabsContent value="password" asChild>
              <motion.div
                key="tab-password"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-black shadow-2xl rounded-2xl p-10"
              >
                <LabelWithEdit
                  label="Current Password"
                  type="password"
                  field="oldPassword"
                  value={passwords.oldPassword}
                  onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                />
                <LabelWithEdit
                  label="New Password"
                  type="password"
                  field="newPassword"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                />
                <div className="text-right mt-4">
                  <button
                    onClick={handlePasswordChange}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
                  >
                    Update Password
                  </button>
                  {passwordChangeCount !== null && (
                    <p className="text-sm text-gray-600 mt-2">
                      🔐 Password has been changed <strong>{passwordChangeCount}</strong> times.
                    </p>
                  )}
                </div>
              </motion.div>
            </TabsContent>
          )}

          {/* Login History Tab */}
          {tab === "login" && (
            <TabsContent value="login" asChild>
              <motion.div
                key="tab-login"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-black shadow-2xl rounded-2xl p-10"
              >
                <h3 className="text-lg font-semibold mb-4">
                  Login History ({loginHistory.length})
                </h3>
                {loginHistory.length === 0 ? (
                  <p className="text-gray-500">No login records found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                      <thead>
                        <tr className="text-gray-700 dark:text-gray-300 border-b">
                          <th className="px-4 py-2">Date & Time</th>
                          <th className="px-4 py-2">Device Info</th>
                          <th className="px-4 py-2">Browser</th>
                          <th className="px-4 py-2">IP Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loginHistory.map((entry, i) => (
                          <tr key={i} className="border-t dark:border-gray-700">
                            <td className="px-4 py-2">{dayjs(entry.timestamp).format("MMM DD YYYY, hh:mm A")}</td>
                            <td className="px-4 py-2">{extractDevice(entry.userAgent)}</td>
                            <td className="px-4 py-2">{extractBrowser(entry.userAgent)}</td>
                            <td className="px-4 py-2">{entry.ip || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
}

// 🔹 Reusable Input Fields
function LabelWithEdit({ label, field, value = "", type = "text", onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <Input
        type={type}
        name={field}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
      />
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <Input value={value} readOnly className="bg-gray-100 mt-1 dark:bg-gray-800" />
    </div>
  );
}

