import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import baseUrl from "../config/config";
import "./viewproject.css";

const ViewProject = () => {
  const { id } = useParams(); 
  const location = useLocation();
  const project = location.state; 
 const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  useEffect(() => {
    if (project && project.images) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % project.images.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [project]);

  if (!project) {
    return <div className="text-center mt-5">❌ Project not found</div>;
  }

  return (
    <div className="view-project-container">

      {/* Image Slider */}
      <div className="image-slider">
        <img
          src={project.images[currentImageIndex]}
          alt="Project Display"
          className="slider-image"
        />
      </div>

      {/* Thumbnail Gallery */}
      <div className="image-gallery">
        {project.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Project ${index}`}
            className={`thumbnail-image ${currentImageIndex === index ? "active" : ""}`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
<div className="alldet p-5">

<h3 className="project-title"  onClick={() => window.open(project.websiteLink, "_blank")}>{project.title}</h3>
      <ul className="project-details mt-5">
  {project.details?.map((detail, index) => (
    <li key={index} className="detail-item">
      <h4>{detail.heading}</h4>
      <p className=" descr  bg-light">{detail.description}</p>
    </li>
  ))}
</ul>


      {/* Footer */}
      <footer className="footer">
        <p>
          This project <strong>{project.title}</strong> showcases innovation and excellence.
        </p>
      </footer>
    </div>
    </div>
  );
};

export default ViewProject;
