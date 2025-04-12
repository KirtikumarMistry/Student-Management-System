import React, { useState, useEffect } from "react";
import './AdminDashboard.css';
import CreateUser from "./createUser";

function Admin() {

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <CreateUser />
    </div>
  );
}

export default Admin;
