import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom';
import "./assignmentStudent.css";
import { Download, FileText } from "lucide-react";

const StudentAssignmentPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [user, setUser] = useState({
    email: "",
    _id: "",
    username: "",
  }); // Set default values to avoid errors
  
  useEffect(() => {
    // Fetch user profile info from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user")); // Parse the stored user info
    setUser(storedUser);

    const fetchAssignments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/assignment/view/${storedUser._id}`, {
          method: "GET",
          headers: {
          "Content-Type": "application/json",
          },
        });
        const responsedata = await response.json();

        const assignmentData=responsedata.data;
        const filePath = assignmentData[0].assignmentFile;
        const fileName = filePath.split("assignments/")[1];
        assignmentData[0].fileName=fileName;

        
        setAssignments(responsedata.data || []);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <div className="student-container">
      <h2>📚 My Assignments</h2>
      {assignments.length > 0 ? (
        <ul className="assignment-container">
          {assignments.map((assignment) => (
            <li key={assignment._id} className="assignment-list">
              <h3 className="text-xl font-semibold text-gray-900"><FileText /> {assignment.assignmentTitle}</h3>
              <p>Uploaded by: {assignment.teacherId.name}</p>
              <a
                href={`http://localhost:5000/api/assignment/download/${assignment.fileName}`}
                download
                className="mt-4 inline-flex items-center px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                <Download className="mr-2 w-5 h-5" /> Download Assignment
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No assignments assigned to you.</p>
      )}
    </div>
  );
};

export default StudentAssignmentPage;
