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

        <Route path="/careers" element={<CareerPage/>}/>
        <Route path="/job/:id" element={<JobDescription />} />
        <Route path="/application-form/:id" element={<ApplicationForm />} />

         <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="my-account" element={<MyAccount />} />
            <Route path="profile" element={<ViewAndUpdateProfile />} />
         </Route>

          {/* Nested Profile Routes with :id */}
          <Route path="profile/personal-details/:id" element={<PersonalDetails />} />
          <Route path="profile/educational-details/:id" element={<EducationDetails />} />
          <Route path="profile/research-contribution/:id" element={<ResearchContribution />} />
          <Route path="profile/work-experience/:id" element={<WorkExperience />} />
          <Route path="profile/other-details/:id" element={<OtherDetails />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App