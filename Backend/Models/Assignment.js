// models/Assignment.js
const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to Teacher
    required: true,
  },
  assignmentTitle: {
    type: String,
    required: true,
  },
  assignmentFile: {
    type: String, // URL or path of the uploaded file
    required: true,
  },
  allocatedStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to Student
    },
  ],
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

// Use existing model if already defined, or define it
const Assignment =
  mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
