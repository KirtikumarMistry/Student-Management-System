import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import isAuthenticated from "./Utils/isAuthen";
import { UserPen, LogOut, Home, BookOpen, GraduationCap, Menu, X } from "lucide-react";
import "./navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState({
    email: "",
    _id: "",
    username: "",
    role: ""
  });

  const getActiveClass = (path) => (location.pathname === path ? "active" : "");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    } else {
      const user = JSON.parse(localStorage.getItem("user"));
      setUser(user);
    }
  }, [navigate]);

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleAssignmentRedirect = () => {
    if (user.role === "student") {
      navigate("/student/assignment");
    } else if (user.role === "teacher") {
      navigate("/teacher/assignment");
    } else {
      navigate("/login");
    }
    setMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => handleNavigation("/home")}>
        <GraduationCap size={28} className="logo-icon" />
        <span>Bright Mind</span>
      </div>
      
      <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </div>
      
      <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <li className={getActiveClass("/home")} onClick={() => handleNavigation("/home")}>
          <Home size={20} className="nav-icon" />
          <span>Home</span>
        </li>
        <li className={getActiveClass("/profile")} onClick={() => handleNavigation("/profile")}>
          <UserPen size={20} className="nav-icon" />
          <span>Profile</span>
        </li>
        <li 
          className={getActiveClass("/student/assignment") || getActiveClass("/teacher/assignment")} 
          onClick={handleAssignmentRedirect}
        >
          <BookOpen size={20} className="nav-icon" />
          <span>Assignment</span>
        </li>
        <button className="sign-out-btn" onClick={handleSignOut}>
          <LogOut size={20} className="nav-icon" />
          <span className="sign-out-text">Sign Out</span>
        </button>
      </ul>
    </nav>
  );
};

export default Navbar;
