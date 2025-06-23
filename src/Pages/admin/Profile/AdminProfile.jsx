import React, { useState, useEffect } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import axiosInstance from '../../../utils/axiosInstance';
import { useAuth } from '../../../Context/AuthContext';
import { toast } from 'react-toastify';

const AdminProfile = () => {
    const {auth} = useAuth();
    const userId = auth?.userId;
    const [activeTab, setActiveTab] = useState('profile');
    const [editMode, setEditMode] = useState(false);
    const [preview, setPreview] = useState(null);
    
    const [form, setForm] = useState({
      first_name: '',
      last_name: '',
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
      setEditMode(false);
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
    <div className="max-w-5xl mx-auto mt-10 bg-white rounded-lg shadow p-6">
      {/* Tabs */}
      <div className="border-b flex gap-4 mb-6">
        <button
          className={`pb-2 px-4 font-medium ${activeTab === 'profile' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`pb-2 px-4 font-medium ${activeTab === 'password' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('password')}
        >
          Password
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-6">
            {/* Profile Image */}
            <div className="flex justify-between items-center">
              <div className="relative flex items-center gap-4">
                <img
                  src={resolvedPhoto}
                  alt="Logo"
                  className="w-28 h-28 rounded-full border object-cover"
                />
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-2 right-2 bg-slate-200 p-1 rounded-full shadow cursor-pointer"
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
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full mt-1 p-2 border rounded  ${!editMode && 'border-gray-200 bg-gray-100'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full mt-1 p-2 border rounded  ${!editMode && 'border-gray-200 bg-gray-100'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Institution Name</label>
                <input
                  type="text"
                  name="institution"
                  value={form.institution || ''}
                  disabled
                  className="w-full border border-gray-200 bg-gray-100 text-gray-600 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email / User Name</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  disabled
                  className="w-full border border-gray-200 bg-gray-100 text-gray-600 rounded px-3 py-2"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Primary Contact No.</label>
                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full mt-1 p-2 border rounded  ${!editMode && 'border-gray-200 bg-gray-100'}`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">About</label>
                <textarea
                  name="about"
                  value={form.about}
                  onChange={handleChange}
                  disabled={!editMode}
                  rows={3}
                  className={`w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 ${!editMode && 'border-gray-200 bg-gray-100 '}`}
                />
              </div>
            </div>
          </div>

          {/* Button */}
          {editMode && (
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              >
                Update Profile
              </button>
            </div>
          )}
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
            Send Reset Link
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
