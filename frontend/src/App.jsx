import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home'; // Updated Home Page import
import Admin from '../pages/Admin'; // Updated Admin Page import
import PrivateRoute from '../components/PrivateRoute'; // Import the PrivateRoute component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Use PrivateRoute to protect the /admin route */}
        <Route path="/admin" element={<PrivateRoute element={<Admin />} />} />
      </Routes>
    </Router>
  );
}

export default App;
