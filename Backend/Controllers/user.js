// controllers/authController.js
const User = require('../Models/User');
const Student = require('../Models/Student');
const Teacher = require('../Models/Teacher');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require("fs");
const dotenv = require("dotenv");

// Generate temporary password
const generateTempPassword = () => {
  return crypto.randomBytes(4).toString('hex');
};

// Create new user account (admin function)
const createUserAccount = async (req, res) => {
  const { firstName, lastName, email, department, role, semester, position} = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "Email already registered.",
      });
    }
  } catch(err) {
    return res.status(500).json({
      success: false,
      message: "Error in checking existing user",
    });
  }

  const departmentwords = department.trim().split(/\s+/);
  const departmentCode = departmentwords[0].charAt(0).toUpperCase() + departmentwords[1].charAt(0).toUpperCase();

  const currentYear = new Date().getFullYear();
  const yearcode = currentYear.toString().slice(-2);

  // Generate username and temporary password
  let username;
  const tempPassword = generateTempPassword();

  // Read the existing env file
  const envConfig = dotenv.parse(fs.readFileSync(".env"));

  if (role === "teacher") {
    // Generate the username
    username = `T_${departmentCode}${yearcode}_${process.env.TEACHER_IDS}`;

    // Modify a variable
    envConfig.TEACHER_IDS = Number(process.env.TEACHER_IDS)+1;

    // Write back to the .env file
    fs.writeFileSync(".env", Object.entries(envConfig).map(([key, value]) => `${key}=${value}`).join("\n"));
  } 
  else if (role === "student") {
    // Generate the username
    username = `S_${departmentCode}${yearcode}_${process.env.STUDENT_IDS}`;

    // Modify a variable
    envConfig.STUDENT_IDS = Number(process.env.STUDENT_IDS)+1;

    // Write back to the .env file
    fs.writeFileSync(".env", Object.entries(envConfig).map(([key, value]) => `${key}=${value}`).join("\n"));
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid role. Role must be 'teacher' or 'student'.",
    });
  }

  try {
    // Create base user with minimal information and temp password
    const newUser = await User.create({ 
      firstName,
      lastName, 
      username, 
      email, 
      password: tempPassword, 
      role,
      profileComplete: false, // Flag to indicate profile needs completion
    });

    // Create role-specific record with additional details
    if (role === "student") {
      await Student.create({
        user: newUser._id,
        username: username,
        program :  department || "Computer Engineering",
        batch : currentYear,
        admissionDate: new Date(),
        currentSemester: semester
      });
    } else if (role === "teacher") {
      await Teacher.create({
        user: newUser._id,
        username: username,
        department : department || "Computer Engineering",
        position : position || "Professor",
        dateOfJoining: new Date()
      });
    }

    // Send email with credentials
    let mailData = {
      email: email,
      subject: "Account Created",
      message: `Your account has been created.\nUsername: ${username}\nTemporary Password: ${tempPassword}\n\nPlease log in and complete your profile.`,
    };
    await newUser.sendMail(mailData);

    res.status(200).json({
      success: true,
      message: "User account created successfully. Credentials sent via email.",
      username: username
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Server error during account creation.",
      error: error.message
    });
  }
};

// User completes their profile after initial login
const completeProfile = async (req, res) => {
  const { 
    phoneNumber, 
    address, 
    dateOfBirth, 
    gender, 
    newPassword
  } = req.body;

  const token = req.header('Authorization')?.split(' ')[1]; // Bearer <token>
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
  const userId = decoded.id || null; // From auth middleware

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update base user information
    user.phoneNumber = phoneNumber;
    user.address = address;
    
    if (newPassword) {
      user.password = newPassword; // Will be hashed via model middleware
    }
    
    user.profileComplete = true;
    await user.save();

    // Update role-specific information
    if (user.role === "student") {
      const student = await Student.findOne({ user: userId });
      if (student) {
        student.dateOfBirth = dateOfBirth;
        student.gender = gender;
        await student.save();
      }
    } else if (user.role === "teacher") {
      const teacher = await Teacher.findOne({ user: userId });
      if (teacher) {
        teacher.dateOfBirth = dateOfBirth;
        teacher.gender = gender;
        await teacher.save();
      }
    }

    console.log("completed the profile");

    // Send confirmation email
    let mailData = {
      email: user.email,
      subject: "Profile Completed",
      message: `Your profile has been successfully completed. You now have full access to the system.`,
    };
    await user.sendMail(mailData);

    res.status(200).json({
      success: true,
      message: "Profile completed successfully"
    });
  } catch (error) {
    console.error("Error completing profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while completing profile",
      error: error.message
    });
  }
};

// Login function 
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Check password (using either method name)
    const isPasswordValid = await (user.comparePassword ? 
      user.comparePassword(password) : user.isPasswordValid(password));
      
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate JWT token
    const token = user.getJwtToken ? 
      user.getJwtToken() : 
      jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: `${process.env.JWT_EXPIRE_TIME}` });

    // Determine route based on profile completion
    let route = "home";
    if (!user.profileComplete) {
      route = "profile";
    }

    // Send login email
    let mailData = {
      email: email,
      subject: "Login Status",
      message: `You Logged In successfully.`,
    };
    await user.sendMail(mailData);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      route,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role,
        profileComplete: user.profileComplete
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message
    });
  }
};

// Get all users (admin function)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
      error: error.message
    });
  }
};

// Update user status (admin function)
const updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Update status
    await user.updateStatus(status);
    res.status(200).json({
      success: true,
      message: `User ${status ? "activated" : "deactivated"} successfully.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating user status",
      error: error.message
    });
  }
};

const resetPassword = async (req, res) => {
  const { email, resetPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Set new password (will be hashed on save)
    user.password = resetPassword;
    await user.save();

    // Email confirmation
    const mailData = {
      email: email,
      subject: "Password Reset Successful",
      message: "Your password has been reset successfully.",
    };
    await user.sendMail(mailData);

    res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while resetting password",
      error: error.message,
    });
  }
};


module.exports = {
  createUserAccount,
  completeProfile,
  login,
  getUsers,
  updateUserStatus,
  resetPassword
};