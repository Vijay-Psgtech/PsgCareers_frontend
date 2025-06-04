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

import MainLayout from "./Components/Layout/MainLayout";
import UserDashboard from "./Components/Users/Dashboard";
import MyAccount from "./Components/Users/MyAccount";
import ViewAndUpdateProfile from "./Components/Users/ViewAndUpdateProfile";

import PersonalDetails from "./forms/PersonalDetails";
import EducationDetails from "./forms/EducationDetails";
import ResearchContribution from "./forms/ResearchContribution";
import WorkExperience from "./forms/WorkExperience";
import OtherDetails from "./forms/OtherDetails";
import AdminJobDetails from "./Pages/admin/Careers/AdminJobDetails";
import AdminCandidateDetails from "./Pages/admin/Careers/AdminCandidateDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Login/>}/>
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

        <Route path="/admin/careers" element={
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

        <Route path="/careers" element={<CareerPage/>}/>
        <Route path="/job/:id" element={<JobDescription />} />
        <Route path="/application-form/:jobId" element={<ApplicationForm />} />

         <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="my-account" element={<MyAccount />} />
            <Route path="profile" element={<ViewAndUpdateProfile />} />
         </Route>

          {/* Application Form Sections (kebab-case paths) */}
          <Route
            path="personal-details/:userId/:jobId"
            element={<PersonalDetails />}
          />
          <Route path="educationDetails/:userId/:jobId" element={<EducationDetails />} />
          <Route
            path="research-contribution/:userId/:jobId"
            element={<ResearchContribution />}
          />
          <Route
            path="work-experience/:userId/:jobId"
            element={<WorkExperience />}
          />
          <Route
            path="other-details/:userId/:jobId"
            element={<OtherDetails />}
          />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App