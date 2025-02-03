import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Use useParams to get project ID from URL
import baseUrl from "../config/config";
import deleteicon from "../../icons/delete.svg";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";


const EditProjectComponent = () => {
  const { id } = useParams(); // Get projectId from the URL
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [headings, setHeadings] = useState([{ heading: "", description: "" }]);
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [firstservice, setfirstservice] = useState("");
  const [secondservice, setsecondservice] = useState("");
  const[getdata, setgetdata] = useState(false);
  const Navigate = useNavigate();
  const { user} = useSelector((state) => state.auth);
  const token = user?.token
  const config = {
    headers: {
      "x-auth-token": token,
    },
  }
 // Effect runs only when `id` changes
 useEffect(() => {
  axios
    .get(`${baseUrl}/api/v1/get-project/${id}`,config)
    .then((response) => {
      if (response.status === 200) {
        const projectData = response.data.data.project;  // Access project data from response
        setProject(projectData);
        setTitle(projectData.title);
        setDescription(projectData.description);
        setfirstservice(projectData.firstservice);
        setsecondservice(projectData.secondservice);
        setWebsiteLink(projectData.websiteLink);
        setHeadings(projectData.details || [{ heading: "", description: "" }]);
        setFiles(projectData.images || []);
      } else {
        toast.error(response.data.message || "Failed to fetch project data.", { position: "top-right" });
      }
    })
    .catch((error) => {
      if (error.response) {
        const { status, message } = error.response.data;
        // Handle specific error codes from backend
        if (status === 404) {
          toast.error(message || "Project not found.", { position: "top-right" });
        } else if (status === 500) {
          toast.error("Internal server error. Please try again later.", { position: "top-right" });
        } else {
          toast.error(message || "Something went wrong. Please try again.", { position: "top-right" });
        }
      } else {
        toast.error("Network error. Please check your connection.", { position: "top-right" });
      }
    });
}, [id, getdata]);


  const addHeadingField = () => {
    setHeadings([...headings, { heading: "", description: "" }]);
  };
  const handleInputChange = (index, field, value) => {
    const updatedHeadings = [...headings];
    updatedHeadings[index][field] = value;
    setHeadings(updatedHeadings);
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const previewFiles = newFiles.map((file) => URL.createObjectURL(file));
    setFiles((prevFiles) => [
      ...prevFiles, 
      ...newFiles.map((file) => file instanceof File ? file : previewFiles)
    ]);
  }

  const handleFormSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("websiteLink", websiteLink);
    formData.append("secondservice", secondservice);
    formData.append("firstservice", firstservice);
    formData.append("headings", JSON.stringify(headings)); // Convert headings array to JSON
  
    files.forEach((file) => {
      if (file instanceof File) {
        formData.append("files", file);
      }
    });
   axios.put(`${baseUrl}/api/v1/updateproject/${project._id}`, formData, config)
    .then((response) => {
      if (response.status === 200) {
        toast.success("Project updated successfully", { position: "top-right" });
        setgetdata("!getdata");
        Navigate("/dashboard");
      }
    })
    .catch((error) => {
      if (error.response) {
        const { status, message } = error.response.data;
        if (status === 404) {
          toast.error(message || "Project not found on the provided ID", { position: "top-right" });
        } else if (status === 500) {
          toast.error("Internal server error. Please try again later.", { position: "top-right" });
        } else {
          toast.error(message || "Something went wrong. Please try again.", { position: "top-right" });
        }
      } else {
        toast.error("Network error. Please check your connection.", { position: "top-right" });
      }
    });
  };
  

  const handleDeleteImage = (index, id) => {
    axios.patch(`${baseUrl}/api/v1/deleteimage/${id}/${index}`,null,config)
      .then((res) => {
        if (res.status === 200) {
          setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
          toast.success("Image deleted successfully", { position: "top-right" });
        }
      })
      .catch((error) => {
        if (error.response) {
          const { status, message } = error.response.data;
  
          if (status === 404) {
            toast.error(message || "Project not found", { position: "top-right" });
          } else if (status === 400) {
            toast.error(message || "Invalid image index", { position: "top-right" });
          } else if (status === 500) {
            toast.error("Internal server error. Please try again later.", { position: "top-right" });
          } else {
            toast.error(message || "Something went wrong. Please try again.", { position: "top-right" });
          }
        } else {
          toast.error("Network error. Please check your connection.", { position: "top-right" });
        }
      });
  };
  

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-project-container">
      <h1 className="form-title">{project ? "Edit Project" : "Add Project"}</h1>

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
          placeholder="first"
          value={firstservice}
          onChange={(e) => setfirstservice(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-input"
          placeholder="second service"
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

      <div className=" mb-3" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {files.map((image, index) => (
          <div key={index} className="cards" style={{position: "relative" }}>
            <img
              src={deleteicon}
              alt="Delete"
              style={{
                position: "absolute",
                top: "0px",
                right: "5px",
                width: "20px",
                height: "20px",
                cursor: "pointer",
                background: "white",
                borderRadius: "50%",
                padding: "2px",
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
              }}
              onClick={() => handleDeleteImage(index, project._id)} // Function to handle delete
            />
            <img
              src={image} // Adjust if images have full URL
              style={{ width: "95%", height: "100px", borderRadius: "5px" }}
              alt={`Uploaded ${index}`}
              className="p-2 "
            />
          </div>
        ))}
      </div>

      <div className="form-group">
        <input
          type="file"
          className="form-input"
          multiple
          onChange={(e) => handleFileChange(e)}
        />
      </div>

      {headings.map((item, index) => (
        <div key={index} className="heading-group">
          <input
            type="text"
            className="form-input"
            placeholder="Heading"
            value={item.heading}
            onChange={(e) => handleInputChange(index, "heading", e.target.value)}
          />
          <textarea
            className="form-input"
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
        Update Project
      </button>
    </div>
  );
};

export default EditProjectComponent;
