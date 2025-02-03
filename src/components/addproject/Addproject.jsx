import React, { useState } from "react";
import axios from "axios"; // You can use axios or fetch for API calls
import "./addproject.css";
import baseUrl from "../config/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AddProjectComponent = () => {
  const [headings, setHeadings] = useState([{ heading: "", description: "" }]);
  const [files, setFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]); // State for image previews
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [firstservice, setfirstservice] = useState("");
  const [secondservice, setsecondservice] = useState("");
 const { user} = useSelector((state) => state.auth);
  const token = user?.token
  const config = {
    headers: {
      "x-auth-token": token,
    },
  }
  const addHeadingField = () => {
    setHeadings([...headings, { heading: "", description: "" }]);
  };

  const Navigate = useNavigate();
  const handleInputChange = (index, field, value) => {
    const updatedHeadings = [...headings];
    updatedHeadings[index][field] = value;
    setHeadings(updatedHeadings);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Generate preview images for the selected files
    const previewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewImages(previewUrls);
  };

  const handleFormSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("firstservice", firstservice);
    formData.append("secondservice", secondservice);
    formData.append("description", description);
    formData.append("websiteLink", websiteLink);

    headings.forEach((item, index) => {
      formData.append(`headings[${index}][heading]`, item.heading);
      formData.append(`headings[${index}][description]`, item.description);
    });

    files.forEach((file, index) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/add-project`, formData,config
      );
      if (response.status === 200) {
        toast.success("Project added successfully", { position: "top-right" });
        Navigate("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        const { status, message } = error.response.data;
        
        // Handle specific error codes
        if (status === 500) {
          toast.error("Internal server error. Please try again later.", { position: "top-right" });
        } else {
          toast.error(message || "Something went wrong. Please try again.", { position: "top-right" });
        }
      } else {
        toast.error("Network error. Please check your connection.", { position: "top-right" });
      }
    }
  };

  return (
    <div className="add-project-container">
      <h1 className="form-title">Add Project</h1>
      <div className="form-group">
        <input
          type="text"
          className="form-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-input"
          placeholder="First service"
          value={firstservice}
          onChange={(e) => setfirstservice(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-input"
          placeholder="Second service"
          value={secondservice}
          onChange={(e) => setsecondservice(e.target.value)}
        />
      </div>

      <div className="form-group">
        <textarea
          className="form-input"
          placeholder="Write description here"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="form-group">
        <input
          type="text"
          className="form-input"
          placeholder="Enter website link"
          value={websiteLink}
          onChange={(e) => setWebsiteLink(e.target.value)}
        />
      </div>

      {/* Image Preview Section */}
      {previewImages.length > 0 && (
        <div className="image-preview-container">
          {previewImages.map((image, index) => (
            <img key={index} style = {{width:"60px", height:"60px"}} src={image} alt={`preview ${index}`} className="image-preview mb-3 mt-2 ms-3 " />
          ))}
        </div>
      )}

      <div className="form-group">
        <input
          type="file"
          className="form-input"
          multiple
          onChange={(e) => handleFileChange(e)}
        />
      </div>

      {headings.map((item, index) => (
        <div key={index} className="heading-group mt-3 mb-2">
          <input
            type="text"
            className="form-input margining"
            placeholder="Heading"
            value={item.heading}
            onChange={(e) => handleInputChange(index, "heading", e.target.value)}
          />
          <textarea
            className="form-input mt-3"
            placeholder="Write heading description here"
            value={item.description}
            onChange={(e) => handleInputChange(index, "description", e.target.value)}
          ></textarea>
        </div>
      ))}

      <button className="btn add-heading-btn" onClick={addHeadingField}>
        Add another heading and description
      </button>

      <button className="btn submit-btn" onClick={handleFormSubmit}>
        Add Project
      </button>
    </div>
  );
};

export default AddProjectComponent;
