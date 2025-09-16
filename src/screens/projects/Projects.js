import React, { useState, useEffect } from "react";
import "./Projects.css";
import EYE from "../../assets/icons/eye.png";

const Projects = () => {
  const [searchValue, setSearchValue] = useState("");
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    status: "Active",
    phase: "Designing",
    budget: 0,
    client: "",
  });
  const [errors, setErrors] = useState({});

  // Get API base URL from environment variable or use localhost for development
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4500";

  // Fetch projects and clients on component mount
  useEffect(() => {
    console.log("Component mounted, fetching projects and clients...");
    fetchProjects();
    fetchClients();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found");
        setErrors({ apiError: "Authentication token missing" });
        return;
      }
      console.log("Fetching projects from:", `${API_BASE_URL}/api/v1/project`);
      const response = await fetch(`${API_BASE_URL}/api/v1/project`, {
        method: "GET",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success && data.status === 200) {
        setProjects(data.data.projects);
        console.log("Projects fetched:", data.data.projects);
      } else {
        console.error("Failed to fetch projects:", data.message);
        setErrors({ apiError: data.message || "Failed to fetch projects" });
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setErrors({ apiError: "Error fetching projects. Please try again." });
    }
  };

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found");
        setErrors({ apiError: "Authentication token missing" });
        return;
      }
      console.log("Fetching clients from:", `${API_BASE_URL}/api/v1/client`);
      const response = await fetch(`${API_BASE_URL}/api/v1/client`, {
        method: "GET",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success && data.status === 200) {
        setClients(data.data.data);
        console.log("Clients fetched:", data.data.data);
      } else {
        console.error("Failed to fetch clients:", data.message);
        setErrors({ apiError: data.message || "Failed to fetch clients" });
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setErrors({ apiError: "Error fetching clients. Please try again." });
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.date.trim()) newErrors.date = "Date is required";
    if (formData.budget < 0) newErrors.budget = "Budget cannot be negative";
    if (!formData.client) newErrors.client = "Client is required";
    return newErrors;
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Open modal for adding or editing
  const openModal = (mode, project = null) => {
    console.log("Button clicked, opening modal in", mode, "mode", project);
    setModalMode(mode);
    setSelectedProject(project);
    setFormData(
      project
        ? { ...project, budget: parseInt(project.budget), client: project.client._id }
        : {
            name: "",
            date: "",
            status: "Active",
            phase: "Designing",
            budget: 0,
            client: "",
          }
    );
    setErrors({});
    setModalOpen(true);
  };

  // Handle form submission for add/edit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setErrors({ apiError: "Authentication token missing" });
      return;
    }

    const url =
      modalMode === "add"
        ? `${API_BASE_URL}/api/v1/project`
        : `${API_BASE_URL}/api/v1/project/${selectedProject._id}`;
    const method = modalMode === "add" ? "POST" : "PATCH";

    try {
      console.log(`Submitting ${modalMode} request to:`, url, formData);
      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ...(modalMode === "edit" && { _id: selectedProject._id }),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setModalOpen(false);
        fetchProjects(); // Refresh project list
        console.log("Submission successful:", data);
      } else {
        setErrors({ apiError: data.message || "Operation failed. Please try again." });
        console.error("API error:", data.message);
      }
    } catch (error) {
      setErrors({ apiError: error.message || "Operation failed. Please try again." });
      console.error("Error submitting form:", error);
    }
  };

  // Handle delete project
  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found");
      setErrors({ apiError: "Authentication token missing" });
      return;
    }

    try {
      console.log("Deleting project with ID:", projectId);
      const response = await fetch(`${API_BASE_URL}/api/v1/project/${projectId}`, {
        method: "DELETE",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        fetchProjects(); // Refresh project list
        console.log("Project deleted:", projectId);
      } else {
        console.error("Failed to delete project:", data.message);
        setErrors({ apiError: data.message || "Failed to delete project" });
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      setErrors({ apiError: "Error deleting project. Please try again." });
    }
  };

  const filteredProjects = projects.filter((project) =>
    Object.values(project).some((value) =>
      value.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  return (
    <div className="advanced-filter-container">
      {/* Add New Project Button at Top-Right Corner */}
      <button className="add-new-btn" onClick={() => openModal("add")} style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
        Add New Project
      </button>

      {/* Top Bar */}
      <div className="top-bar">
        <div className="search-container">
          <svg className="search-icon" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            placeholder="Search Project"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className="button-group">
          <button className="advanced-filter-btn">
            <svg className="filter-icon" viewBox="0 0 24 24">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
            </svg>
            Status
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Client</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Phase</th>
              <th>Budget</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project._id}>
                <td>{project.name}</td>
                <td>{project.client.name}</td>
                <td>{project.date}</td>
                <td>
                  <span
                    className={`status-badge ${
                      project.status === "Active" ? "completed" : ""
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td>{project.phase}</td>
                <td>{`$${project.budget}`}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => openModal("edit", project)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(project._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Error Display */}
      {errors.apiError && (
        <div className="error-container">
          <span className="error">{errors.apiError}</span>
        </div>
      )}

      {/* Modal for Add/Edit Project */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{modalMode === "add" ? "Add New Project" : "Edit Project"}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter project name"
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  placeholder="Enter date (e.g., 12-3-2025)"
                />
                {errors.date && <span className="error">{errors.date}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="status">Status:</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="phase">Phase:</label>
                <select
                  id="phase"
                  name="phase"
                  value={formData.phase}
                  onChange={handleFormChange}
                >
                  <option value="Designing">Designing</option>
                  <option value="Development">Development</option>
                  <option value="Testing">Testing</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="budget">Budget:</label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleFormChange}
                  placeholder="Enter budget"
                />
                {errors.budget && <span className="error">{errors.budget}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="client">Client:</label>
                <select
                  id="client"
                  name="client"
                  value={formData.client}
                  onChange={handleFormChange}
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                {errors.client && <span className="error">{errors.client}</span>}
              </div>
              {errors.apiError && <span className="error">{errors.apiError}</span>}
              <div className="modal-buttons">
                <button type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit">{modalMode === "add" ? "Add Project" : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;