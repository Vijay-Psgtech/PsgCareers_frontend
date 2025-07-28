import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import AdminDashboardLayout from "./Components/AdminDashboardLayout";
import PrivateRoute from "./Components/PrivateRoute";

// Lazy loaded components (as shown above)
const Login = lazy(() => import("./Routes/Routes").then(m => ({ default: m.Login })));
const Register = lazy(() => import("./Routes/Routes").then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import("./Routes/Routes").then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import("./Routes/Routes").then(m => ({ default: m.ResetPassword })));
const PasswordSet = lazy(() => import("./Routes/Routes").then(m => ({ default: m.PasswordSet })));
const CareerPage = lazy(() => import("./Routes/Routes").then(m => ({ default: m.CareerPage })));
const ApplicationForm = lazy(() => import("./Routes/Routes").then(m => ({ default: m.ApplicationForm })));
const JobDescription = lazy(() => import("./Routes/Routes").then(m => ({ default: m.JobDescription })));
const JobsLists = lazy(() => import("./Routes/Routes").then(m => ({ default: m.JobsLists })));
const AdminDashboard = lazy(() => import("./Routes/Routes").then(m => ({ default: m.AdminDashboard })));
const AdminJobPost = lazy(() => import("./Routes/Routes").then(m => ({ default: m.AdminJobPost })));

const VerifyEmailPage = lazy(() => import("./Pages/verifyEmailPage"));
const AdminJobDetails = lazy(() => import("./Pages/admin/Careers/AdminJobDetails"));
const AdminCandidateDetails = lazy(() => import("./Pages/admin/Careers/AdminCandidateDetails"));
const AdminProfile = lazy(() => import("./Pages/admin/Profile/AdminProfile"));
const AdminCreateForm = lazy(() => import("./Pages/admin/Profile/AdminCreateForm"));
const AdminList = lazy(() => import("./Pages/admin/Profile/AdminList"));

const MainLayout = lazy(() => import("./Components/Layout/MainLayout"));
const UserDashboard = lazy(() => import("./Components/Users/Dashboard"));
const MyAccount = lazy(() => import("./Components/Users/MyAccount"));
const ViewAndUpdateProfile = lazy(() => import("./Components/Users/ViewAndUpdateProfile"));
const LandingPage = lazy(() => import("./Pages/LandingPage"));

const PersonalDetails = lazy(() => import("./forms/PersonalDetails"));
const EducationDetails = lazy(() => import("./forms/EducationDetails"));
const ResearchContribution = lazy(() => import("./forms/ResearchContribution"));
const WorkExperience = lazy(() => import("./forms/WorkExperience"));
const OtherDetails = lazy(() => import("./forms/OtherDetails"));
const Declaration = lazy(() => import("./forms/Declaration"));

const AppliedCandidates = lazy(() => import("./Pages/admin/Reports/AppliedCandidates"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
        <Routes>
          <Route path="" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:token" element={<VerifyEmailPage />} />
          <Route path="/set-password/:id" element={<PasswordSet />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/admin/dashboard" element={
            <PrivateRoute>
              <AdminDashboardLayout>
                <AdminDashboard />
              </AdminDashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/admin/create-jobs" element={
            <PrivateRoute>
              <AdminDashboardLayout>
                <AdminJobPost />
              </AdminDashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/admin/jobs-list" element={
            <PrivateRoute>
              <AdminDashboardLayout>
                <JobsLists />
              </AdminDashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/admin/job-edit/:jobId" element={
            <PrivateRoute>
              <AdminDashboardLayout>
                <AdminJobPost />
              </AdminDashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/admin/jobDetails/:jobId" element={
            <PrivateRoute>
              <AdminDashboardLayout>
                <AdminJobDetails />
              </AdminDashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/admin/candidateDetails/:userId/:jobId" element={
            <PrivateRoute>
              <AdminDashboardLayout>
                <AdminCandidateDetails />
              </AdminDashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/admin/Profile" element={
            <PrivateRoute>
              <AdminDashboardLayout>
                <AdminProfile />
              </AdminDashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/admin-management/create" element={
            <PrivateRoute>
              <AdminDashboardLayout>
                <AdminCreateForm />
              </AdminDashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/admin/userLists" element={
            <PrivateRoute>
              <AdminDashboardLayout>
                <AdminList />
              </AdminDashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/admin/applied-candidates" element={
            <PrivateRoute>
              <AdminDashboardLayout>
                <AppliedCandidates />
              </AdminDashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/careers" element={<CareerPage />} />
          <Route path="/job/:id" element={<JobDescription />} />
          <Route path="/application-form/:jobId" element={<ApplicationForm />} />
          
          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="my-account" element={<MyAccount />} />
            <Route path="account" element={<MyAccount />} />
            <Route path="profile" element={<ViewAndUpdateProfile />} />
          </Route>

          <Route path="/profile/personal-details/:userId/:applicationId" element={<PersonalDetails />} />
          <Route path="/profile/educational-details/:userId/:applicationId" element={<EducationDetails />} />
          <Route path="/profile/research-contribution/:userId/:applicationId" element={<ResearchContribution />} />
          <Route path="/profile/work-experience/:userId/:applicationId" element={<WorkExperience />} />
          <Route path="/profile/other-details/:userId/:applicationId" element={<OtherDetails />} />
          <Route path="/profile/declaration/:userId/:applicationId" element={<Declaration />} />
          <Route path="/application/:jobId/declaration" element={<Declaration />} />
        </Routes>
      </Suspense>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
