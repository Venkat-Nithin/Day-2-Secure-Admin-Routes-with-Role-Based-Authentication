import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [content, setContent] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user has admin privileges
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/"; // Redirect to home page if no token
        return;
      }

      try {
        // Fetch user information (role) along with the dashboard data
        const response = await axios.get("http://localhost:5000/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If the user has admin privileges, allow access to the dashboard
        if (response.data.role === 'admin') {
          setIsAdmin(true);
          setContent(response.data.content); // Set the actual confidential content
        } else {
          setIsAdmin(false);
          setErrorMessage("You do not have admin access. This page is confidential.");
        }
      } catch (error) {
        setErrorMessage("Access denied or token expired.");
        window.location.href = "/"; // Redirect to home page if token expired or invalid
      }
    };
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = "/";
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* If the user is not an admin, show a confidential message */}
      {!isAdmin ? (
        <div>
          <p>{errorMessage}</p>
        </div>
      ) : (
        <div>
          <p>{content}</p>
        </div>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
export default Admin;