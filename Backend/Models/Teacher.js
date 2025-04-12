// models/Teacher.js
const mongoose = require('mongoose');
const User = require('./User');

const teacherSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  username: { type: String, required: true, unique: true },
  department: { type: String },
  specialization: { type: String },
  position: { 
    type: String, 
    enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Instructor', 'Teaching Assistant', 'Visiting Faculty'], 
    required: true 
  },
  qualifications: [{ 
    degree: { type: String },
    institution: { type: String },
    year: { type: Number }
  }],
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  dateOfJoining: { type: Date, default: Date.now },
  coursesTeaching: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  availability: [{
    day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    startTime: { type: String },
    endTime: { type: String }
  }],
  salary: {
    amount: { type: Number },
    lastIncrement: { type: Date }
  },
  status: { type: String, enum: ['active', 'onLeave', 'terminated'], default: 'active' }
});

module.exports = mongoose.model('Teacher', teacherSchema);