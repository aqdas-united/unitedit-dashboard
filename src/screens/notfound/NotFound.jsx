import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <button
        className="home-button"
        onClick={() => navigate(-1)} // Go back to previous page
      >
        Go Back to Previous Page
      </button>
    </div>
  );
};

export default NotFound;
