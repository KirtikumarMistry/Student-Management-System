// controllers/teacherController.js
const Assignment = require("../Models/Assignment");
const User = require("../Models/User"); // Import User model
const multer = require("multer");
const path = require("path");

const fs = require("fs"); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/assignments";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".pdf" && ext !== ".docx" && ext !== ".doc") {
      return cb(new Error("Only PDF and Word files are allowed!"), false);
    }
    cb(null, true);
  },
}).single("assignmentFile");

// Upload and allocate assignment
const uploadAndAllocate = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { teacherId, assignmentTitle, allocatedStudents } = req.body; // `allocatedStudents` will now contain usernames
    const assignmentFile = `/uploads/assignments/${req.file.filename}`;

    try {
      // Find students by usernames
      const usernames = JSON.parse(allocatedStudents);
      const students = await User.find({ username: { $in: usernames } }).select("_id");

      if (students.length === 0) {
        return res.status(404).json({ error: "No students found for the provided usernames." });
      }

      // Extract student IDs
      const studentIds = students.map((student) => student._id);

      // Save assignment with student IDs
      const newAssignment = new Assignment({
        teacherId,
        assignmentTitle,
        assignmentFile,
        allocatedStudents: studentIds,
      });

      await newAssignment.save();
      res.status(201).json({ message: "Assignment uploaded and allocated!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error, please try again later." });
    }
  });
};

module.exports=uploadAndAllocate;