import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };
  
  return (
    <div>
      <div className="home-container">
        <h1>Welcome to Our App</h1>
        <p>Your go-to platform for managing everything!</p>
        <div className="home-buttons">
          <button onClick={handleLoginRedirect}>Login</button>
          <button onClick={handleSignupRedirect}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
