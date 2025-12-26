import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import VerifyOTP from './components/auth/VerifyOTP';
import ResetPassword from './components/auth/ResetPassword';
import Home from './pages/Home';

import AdminDashboard from './components/admin/AdminDashboard';
import AlumniDashboard from './components/alumni/AlumniDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import ManageUsers from './components/admin/ManageUsers';
import AlumniProfile from './components/alumni/AlumniProfile';
import AlumniList from './components/student/AlumniList';
import PostJob from './components/alumni/PostJob';
import MyJobs from './components/alumni/MyJobs';
import Jobs from './components/student/Jobs';
import CreateEvents from './components/alumni/CreateEvents';
import MyEvents from './components/alumni/MyEvents';
import MyConnections from './components/alumni/MyConnections';
import Events from './components/student/Events';
import StudentProfile from './components/student/StudentProfile';
import Mentorship from './components/student/Mentorship';
import ResumeResources from './components/student/ResumeResources';
import Notifications from './components/student/Notifications';
import SavedItems from './components/student/SavedItems';


function App() {
  return (
    <Router>
      <Navbar />

      <div style={{ marginTop: '70px', minHeight: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reset-password-new" element={<ResetPassword />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/alumni"
              element={
                <ProtectedRoute roles={['alumni']}>
                  <AlumniDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student"
              element={
                <ProtectedRoute roles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/profile"
              element={
                <ProtectedRoute roles={['student']}>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/mentorship"
              element={
                <ProtectedRoute roles={['student']}>
                  <Mentorship />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/resources"
              element={
                <ProtectedRoute roles={['student']}>
                  <ResumeResources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/notifications"
              element={
                <ProtectedRoute roles={['student']}>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/saved"
              element={
                <ProtectedRoute roles={['student']}>
                  <SavedItems />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={['admin']}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />        
            <Route
              path="/alumni/profile"
              element={
                <ProtectedRoute roles={['alumni']}>
                  <AlumniProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/alumni"
              element={
                <ProtectedRoute roles={['student']}>
                  <AlumniList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/jobs"
              element={
                <ProtectedRoute roles={['alumni']}>
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/my-jobs"
              element={
                <ProtectedRoute roles={['alumni']}>
                  <MyJobs />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/jobs"
              element={
                <ProtectedRoute roles={['student']}>
                  <Jobs />
                </ProtectedRoute>
              }
            />

            <Route
              path="/alumni/events"
              element={
                <ProtectedRoute roles={['alumni']}>
                  <CreateEvents />
                </ProtectedRoute>
              }
            />

            <Route
              path="/alumni/my-events"
              element={
                <ProtectedRoute roles={['admin', 'alumni']}>
                  <MyEvents />
                </ProtectedRoute>
              }
            />

            <Route
              path="/alumni/connections"
              element={
                <ProtectedRoute roles={['alumni']}>
                  <MyConnections />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/events"
              element={
                <ProtectedRoute roles={['student', 'alumni', 'admin']}>
                  <Events />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
