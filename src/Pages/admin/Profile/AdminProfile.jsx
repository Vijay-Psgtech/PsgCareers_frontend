import React, { useState, useEffect } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import axiosInstance from '../../../utils/axiosInstance';
import { useAuth } from '../../../Context/AuthContext';
import { toast } from 'react-toastify';

const AdminProfile = () => {
    const {auth} = useAuth();
    const userId = auth?.userId;
    const [activeTab, setActiveTab] = useState('profile');
    const [preview, setPreview] = useState(null);
    
    const [form, setForm] = useState({
      institution: '',
      email: '',
      mobile: '',
      about: '',
      photo: null,
    });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5174";

  const fetchProfile = async() => {
    const res = await axiosInstance.get(`api/user/${userId}`);
    setForm((prev) => ({ ...prev, ...res.data }));
  }

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files?.[0]) {
      const file = files[0];
      if (file.size > 2 * 1024 * 1024)
        return toast.error("File must be under 2MB.");
      if (!["image/jpeg", "image/png"].includes(file.type))
        return toast.error("Only JPG and PNG formats allowed.");
      setPreview(URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, photo: file }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async() => {
    try{
      const formData = new FormData();
      formData.append("institution", form.institution);
      formData.append("mobile", form.mobile);
      formData.append("about", form.about);

      if (form.photo instanceof File) {
        formData.append("photo", form.photo);
      }

      console.log('Updating Profile:', formData);


      await axiosInstance.put(`/api/user/update/${userId}`, formData);
      toast.success("Profile updated successfully.");
      setPreview(null);
      fetchProfile();
    } catch(err) {
      console.log('Error',err);
      toast.error("Failed to update profile.");
    }
  };

  const handlePassword = async() => {
    try{
      const res = await axiosInstance.post('/api/user/passwordUpdate',{email:form.email});
      toast.success(res.data.message);
    }catch(err) {
      const errorMsg = err.response?.data?.message || 'Password Changes failed..';
      toast.error(errorMsg);
    }
  }

  const resolvedPhoto =
    preview ||
    (form.photo instanceof File
      ? URL.createObjectURL(form.photo)
      : form.photo?.startsWith("http")
      ? form.photo
      : `${BASE_URL}${form.photo}`) ||
    "/default-avatar.png";

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto mt-8">
      {/* Tabs */}
      <div className="flex border-b mb-6">
        {['profile', 'password'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`mr-6 pb-2 font-medium ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col md:flex-row gap-8 mb-6 items-start">
            {/* Profile Image */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-300 shadow-md">
              <img
                src={resolvedPhoto}
                alt="Institution Logo"
                className="w-full h-full object-cover"
              />
              <label
                htmlFor="photo-upload"
                className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow cursor-pointer"
              >
                <FiEdit2 size={16} />
                <input
                  type="file"
                  id="photo-upload"
                  name="photo"
                  className="hidden"
                  accept="image/*"
                  onChange={handleChange}
                />
              </label>
              
            </div>

            {/* Input Fields */}
            <div className="flex-1 space-y-5 max-w-xl">
              <div>
                <label className="block text-sm font-semibold mb-1">Institution Name</label>
                <input
                  type="text"
                  name="institution"
                  value={form.institution || ''}
                  disabled
                  className="w-full border border-gray-200 bg-gray-100 text-gray-600 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Email / User Name</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  disabled
                  className="w-full border border-gray-200 bg-gray-100 text-gray-600 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Primary Contact No.</label>
                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">About</label>
                <textarea
                  name="about"
                  value={form.about}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="text-right">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Update Profile
            </button>
          </div>
        </form>
      )}

      {activeTab === 'password' && (
        <div className="max-w-md space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">User ID / Email</label>
            <input
              type="email"
              value={form.email}
              disabled
              className="w-full border border-gray-200 bg-gray-100 text-gray-600 rounded px-3 py-2"
            />
          </div>

          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition" onClick={handlePassword}>
            Send Verification Code
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
