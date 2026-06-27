import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import AppliedJobs from "./pages/AppliedJobs";
import RecruiterJobs from "./pages/RecruiterJobs";
import PostJob from "./pages/PostJob";
import Companies from "./pages/Companies";
import Applicants from "./pages/Applicants";
import Profile from "./pages/Profile";
import {
  ProtectedRoute,
  StudentRoute,
  RecruiterRoute,
  AuthRoute
} from "./components/shared/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />

        {/* Auth Routes - redirect if already logged in */}
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />

        {/* Student Only Routes */}
        <Route path="/applied-jobs" element={<StudentRoute><AppliedJobs /></StudentRoute>} />
        <Route path="/profile" element={<StudentRoute><Profile /></StudentRoute>} />

        {/* Recruiter Only Routes */}
        <Route path="/recruiter/jobs" element={<RecruiterRoute><RecruiterJobs /></RecruiterRoute>} />
        <Route path="/recruiter/post-job" element={<RecruiterRoute><PostJob /></RecruiterRoute>} />
        <Route path="/recruiter/companies" element={<RecruiterRoute><Companies /></RecruiterRoute>} />
        <Route path="/recruiter/applicants/:id" element={<RecruiterRoute><Applicants /></RecruiterRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;