// controllers/studentController.js
const Assignment = require("../Models/Assignment");
const path = require('path');
const fs = require('fs');

// Fetch assignments for a student
const getAssignments = async (req, res) => {
  const studentId = req.params.student_id;
  console.log(studentId);

  try {
    const assignments = await Assignment.find({ allocatedStudents: studentId })
      .populate("teacherId", "name") // Populate teacher details
      .exec();

    res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assignments." });
  }
};

const downloadAssignments = async (req, res) => {
  const fileName = req.params.fileName;
  console.log(fileName);
  const filePath = path.join(__dirname, '../uploads/assignments', fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found.' });
  }

  console.log(`Downloading file: ${fileName}`);
  return res.download(filePath, fileName, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).json({ error: 'Failed to download file.' });
    }
  });
};


module.exports={getAssignments, downloadAssignments};