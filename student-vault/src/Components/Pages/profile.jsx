import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import isAuthenticated from "../Utils/isAuthen";
import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    academicYear: "",
    collegeName: "",
    courseName: "",
    profilePicture: "",
  }); // Set default values to avoid errors

  useEffect(() => {
    if (!isAuthenticated()) {
      console.log("Authentication failed");
      navigate("/login"); // Redirect to login if not authenticated
    } else {
      console.log("Authentication successful");
      // Fetch user profile info from localStorage
      const user = JSON.parse(localStorage.getItem("user")); // Parse the stored user info
      if (user) {
        setProfile(user);
      }
    }
  }, [navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated profile:", profile);
    alert("Profile updated successfully!");
    // Backend integration can be added here
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        {/* Profile Picture */}
        <div className="profile-photo">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="profile-photo-img"
            />
          ) : (
            <div className="profile-photo-placeholder">P</div>
          )}
          <input
            type="text"
            name="profilePicture"
            value={profile.profilePicture}
            onChange={handleChange}
            placeholder="Profile Picture URL"
            className="profile-input"
          />
        </div>

        {/* Name */}
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="profile-input"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="profile-input"
        />

        {/* Phone */}
        <input
          type="text"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          className="profile-input"
        />

        {/* Address */}
        <textarea
          name="address"
          value={profile.address}
          onChange={handleChange}
          placeholder="Address"
          required
          className="profile-input"
        />

        {/* Academic Year */}
        <input
          type="text"
          name="academicYear"
          value={profile.academicYear}
          onChange={handleChange}
          placeholder="Academic Year"
          required
          className="profile-input"
        />

        {/* College Name */}
        <input
          type="text"
          name="collegeName"
          value={profile.collegeName}
          onChange={handleChange}
          placeholder="College Name"
          required
          className="profile-input"
        />

        {/* Course Name */}
        <input
          type="text"
          name="courseName"
          value={profile.courseName}
          onChange={handleChange}
          placeholder="Course Name"
          required
          className="profile-input"
        />

        {/* Submit Button */}
        <button type="submit" className="profile-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
