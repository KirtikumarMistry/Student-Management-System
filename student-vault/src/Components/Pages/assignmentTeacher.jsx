import React, { useState, useEffect } from "react";
import { File, Upload, Users, FileText } from "lucide-react"; // Import Lucide icons
import "./assignmentTeacher.css";

const TeacherAssignmentPage = () => {
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [allocatedStudents, setAllocatedStudents] = useState("");
  const [user, setUser] = useState({ name: "", email: "", _id: "", username: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleAssignmentUpload = async (e) => {
    e.preventDefault();
    if (!assignmentFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("teacherId", user._id);
    formData.append("assignmentTitle", assignmentTitle);
    formData.append("allocatedStudents", JSON.stringify(allocatedStudents.split(",")));
    formData.append("assignmentFile", assignmentFile);

    try {
      const response = await fetch(`http://localhost:5000/api/assignment/upload/${user._id}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload assignment.");
      }

      alert("Assignment uploaded successfully!");
      setAssignmentTitle("");
      setAssignmentFile(null);
      setAllocatedStudents("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="teacher-container">
      <h2 className="form-title"><FileText size={24} /> Upload & Allocate Assignment</h2>
      <form className="teacher-form" onSubmit={handleAssignmentUpload}>
        <div className="input-group">
          <FileText className="icon" />
          <input
            type="text"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
            placeholder="Assignment Title"
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <File className="icon" />
          <input
            type="file"
            onChange={(e) => setAssignmentFile(e.target.files[0])}
            required
            className="file-input"
          />
        </div>
        <div className="input-group">
          <Users className="icon" />
          <textarea
            value={allocatedStudents}
            onChange={(e) => setAllocatedStudents(e.target.value)}
            placeholder="Enter Student Usernames (comma-separated)"
            required
            className="textarea-field"
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">
          <Upload size={18} /> Upload Assignment
        </button>
      </form>
    </div>
  );
};

export default TeacherAssignmentPage;
