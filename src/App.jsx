import React from "react"
import { BrowserRouter,Routes,Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { Login,Register,AdminJobPost,AdminDashboard,
  ForgotPassword,ResetPassword,PasswordSet,CareerPage,
  JobDescription,ApplicationForm,JobsLists
} from "./Routes/Routes";
import AdminDashboardLayout from "./Components/AdminDashboardLayout";
import VerifyEmailPage from "./Pages/verifyEmailPage";
import PrivateRoute from "./Components/PrivateRoute";
import AdminJobDetails from "./Pages/admin/Careers/AdminJobDetails";
import AdminCandidateDetails from "./Pages/admin/Careers/AdminCandidateDetails";
import AdminProfile from "./Pages/admin/Profile/AdminProfile";
import AdminCreateForm from "./Pages/admin/Profile/AdminCreateForm";
import AdminList from "./Pages/admin/Profile/AdminList";

import MainLayout from "./Components/Layout/MainLayout";
import UserDashboard from "./Components/Users/Dashboard";
import MyAccount from "./Components/Users/MyAccount";
import ViewAndUpdateProfile from "./Components/Users/ViewAndUpdateProfile";
import LandingPage from "./Pages/LandingPage";

import PersonalDetails from "./forms/PersonalDetails";
import EducationDetails from "./forms/EducationDetails";
import ResearchContribution from "./forms/ResearchContribution";
import WorkExperience from "./forms/WorkExperience";
import OtherDetails from "./forms/OtherDetails";
import Declaration from "./forms/Declaration";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<LandingPage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/verify/:token" element={<VerifyEmailPage />} />
        <Route path="/set-password/:id" element={<PasswordSet/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password/:token" element={<ResetPassword/>}/>
       
        <Route path="/admin/dashboard" element={
          <PrivateRoute>
            <AdminDashboardLayout>
              <AdminDashboard/>
            </AdminDashboardLayout>  
          </PrivateRoute>
        }/>

        <Route path="/admin/create-jobs" element={
          <PrivateRoute>
            <AdminDashboardLayout>
              <AdminJobPost/>
            </AdminDashboardLayout>  
          </PrivateRoute>  
        }/>

         <Route path="/admin/jobs-list" element={
          <PrivateRoute>
            <AdminDashboardLayout>
              <JobsLists/>
            </AdminDashboardLayout>
          </PrivateRoute>
        }/>

        <Route path="/admin/job-edit/:jobId" element={
          <PrivateRoute>
            <AdminDashboardLayout>
              <AdminJobPost/>
            </AdminDashboardLayout>
          </PrivateRoute>
        }/>

        <Route path="/admin/jobDetails/:jobId" element={
          <PrivateRoute>
            <AdminDashboardLayout>
              <AdminJobDetails/>
            </AdminDashboardLayout>
          </PrivateRoute>
        }/>

        <Route path="/admin/candidateDetails/:userId/:jobId" element={
          <PrivateRoute>
            <AdminDashboardLayout>
              <AdminCandidateDetails/>
            </AdminDashboardLayout>
          </PrivateRoute>
        }/>

        <Route path="/admin/Profile" element={
          <PrivateRoute>
            <AdminDashboardLayout>
              <AdminProfile />
            </AdminDashboardLayout>
          </PrivateRoute>
        }/>

        <Route path="/admin-management/create" element={
          <PrivateRoute>
            <AdminDashboardLayout>
              <AdminCreateForm />
            </AdminDashboardLayout>
          </PrivateRoute>
        }/>

         <Route path="/admin/userLists" element={
          <PrivateRoute>
            <AdminDashboardLayout>
              <AdminList />
            </AdminDashboardLayout>
          </PrivateRoute>
        }/>

        <Route path="/careers" element={<CareerPage/>}/>
        <Route path="/job/:id" element={<JobDescription />} />
        <Route path="/application-form/:jobId" element={<ApplicationForm />} />

         <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="my-account" element={<MyAccount />} />
            <Route path="account" element={<MyAccount />} />
            <Route path="profile" element={<ViewAndUpdateProfile />} />
         </Route>

          {/* Application Form Sections (Edit Mode with userId & applicationId) */}
          <Route path="/profile/personal-details/:userId/:applicationId" element={<PersonalDetails />} />
          <Route path="/profile/educational-details/:userId/:applicationId" element={<EducationDetails />} />
          <Route path="/profile/research-contribution/:userId/:applicationId" element={<ResearchContribution />} />
          <Route path="/profile/work-experience/:userId/:applicationId" element={<WorkExperience />} />
          <Route path="/profile/other-details/:userId/:applicationId" element={<OtherDetails />} />
          <Route path="/profile/declaration/:userId/:applicationId" element={<Declaration />} />

          {/* Submission Mode (Final Step) */}
          <Route path="/application/:jobId/declaration" element={<Declaration />}  />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App