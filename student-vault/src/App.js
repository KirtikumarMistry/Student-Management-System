import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/navbar"; // Import the Navbar
import { GraduationCap, AlertCircle } from "lucide-react";
import './App.css';

const Login = lazy(() => import("./Components/Auth/login"));
const Signup = lazy(() => import("./Components/Auth/signup"));
const ResetPassword = lazy(() => import("./Components/Auth/resetpassword"));
const Admin = lazy(() => import("./Components/Admin/AdminDashboard"));
const FirstTimeLogin = lazy(() => import("./Components/Auth/FirstTimeLogin"));
const Profile = lazy(() => import("./Components/Pages/profile"));
const Home = lazy(() => import("./Components/Pages/home"));
const AssignmentTeacher = lazy(() => import("./Components/Pages/assignmentTeacher"));
const AssignmentStudent = lazy(() => import("./Components/Pages/assignmentStudent"));

// Loading component
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-content">
      <GraduationCap size={48} className="loading-icon" />
      <h2 className="loading-text">Loading Bright Mind</h2>
      <div className="loading-spinner"></div>
    </div>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <div className="error-content">
            <AlertCircle size={64} className="error-icon" />
            <h2 className="error-title">Something went wrong</h2>
            <p className="error-message">We're sorry, but there was an error loading this page.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppLayout = ({ children }) => {
  const location = useLocation();

  // Paths where the Navbar should NOT be displayed
  const hideNavbarPaths = ['/login', '/signup', '/signup/teacher', '/reset-password'];

  return (
    <div className="app-container">
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup/teacher" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/completeprofile" element={<FirstTimeLogin />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/student/assignment" element={<AssignmentStudent />} />
              <Route path="/teacher/assignment" element={<AssignmentTeacher />} />
            </Routes>
          </AppLayout>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
