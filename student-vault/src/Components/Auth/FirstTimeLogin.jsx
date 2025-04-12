import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap, User, Phone, MapPin, Calendar, CheckCircle } from 'lucide-react';
import './FirstTimeLogin.css';

const FirstTimeLogin = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    dateOfBirth: '',
    gender: '',
    newPassword: '',
    confirmPassword: '',
    termsAccepted: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      termsAccepted: checked
    }));
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    // Validate terms acceptance
    if (!formData.termsAccepted) {
      setError('You must accept the terms and conditions');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/completeprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update user in localStorage
        const updatedUser = { ...user, profileComplete: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        console.log("copleted the profile");
        
        // Redirect based on role
        if (user.role === 'student') {
          navigate('/home');
        } else if (user.role === 'teacher') {
          navigate('/teacher-dashboard');
        } else {
          navigate('/home');
        }
      } else {
        setError(data.message || 'Failed to complete profile');
      }
    } catch (err) {
      setError('An error occurred while completing your profile');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="first-time-container">
      <div className="first-time-background">
        <div className="first-time-background-shape"></div>
        <div className="first-time-background-shape"></div>
      </div>
      
      <div className="first-time-card">
        <div className="first-time-header">
          <div className="first-time-logo">
            <GraduationCap size={32} />
            <h1>Student Vault</h1>
          </div>
          <h2>Complete Your Profile</h2>
          <p className="sub-text">Welcome, {user.firstName}! Please complete your profile to continue</p>
        </div>

        {error && (
          <div className="error-message">
            <div className="error-icon">!</div>
            {error}
          </div>
        )}

        <form className="first-time-form" onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="phoneNumber">Phone Number</label>
            <div className="input-wrapper">
              <Phone className="input-icon" size={20} />
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div className="input-container">
            <label htmlFor="address.street">Street Address</label>
            <div className="input-wrapper">
              <MapPin className="input-icon" size={20} />
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Enter your street address"
                required
              />
            </div>
          </div>

          <div className="address-row">
            <div className="input-container">
              <label htmlFor="address.city">City</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={20} />
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="address.state">State</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={20} />
                <input
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="State"
                  required
                />
              </div>
            </div>
          </div>

          <div className="address-row">
            <div className="input-container">
              <label htmlFor="address.zipCode">ZIP Code</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={20} />
                <input
                  type="text"
                  id="address.zipCode"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  placeholder="ZIP Code"
                  required
                />
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="address.country">Country</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={20} />
                <input
                  type="text"
                  id="address.country"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  placeholder="Country"
                  required
                />
              </div>
            </div>
          </div>

          <div className="input-row">
            <div className="input-container">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <div className="input-wrapper">
                <Calendar className="input-icon" size={20} />
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="gender">Gender</label>
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          <div className="input-container">
            <label htmlFor="newPassword">New Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                required
              />
              <div className="password-toggle" onClick={() => togglePasswordVisibility('password')}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          <div className="input-container">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                required
              />
              <div className="password-toggle" onClick={() => togglePasswordVisibility('confirmPassword')}>
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          <div className="terms-container">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleCheckboxChange}
              required
            />
            <label htmlFor="termsAccepted">
              I accept the <span className="terms-link">Terms and Conditions</span>
            </label>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <>
                Complete Profile
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FirstTimeLogin; 