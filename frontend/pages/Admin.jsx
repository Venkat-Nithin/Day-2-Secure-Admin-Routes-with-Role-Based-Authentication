import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Using useNavigate for routing

function Admin() {
  const [content, setContent] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user information (role) along with the dashboard data
        const response = await axios.get("http://localhost:5000/api/admin/dashboard", {
          withCredentials: true  // ✅ Send cookies along
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
        console.error("error:", error);
        setErrorMessage("Access denied or token expired.");
        window.location.href = "/";
      }
    };
    fetchDashboardData();
  }, []);

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
    </div>
  );
}

export default Admin;
