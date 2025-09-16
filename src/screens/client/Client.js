import React, { useState, useEffect } from "react";
import "./Client.css";
import UserIcon from "../../assets/icons/userPlaceholder.png";

const Clients = () => {
  const [searchValue, setSearchValue] = useState("");
  const [clients, setClients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    projectType: "",
    totalProjects: 0,
    email: "",
    number: "",
    status: "Active",
  });
  const [errors, setErrors] = useState({});

  // Get API base URL from environment variable or use localhost for development
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4500";

  // Fetch clients on component mount
  useEffect(() => {
    console.log("Component mounted, rendering page...");
    fetchClients();
  }, []);

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
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.number.trim()) newErrors.number = "Phone number is required";
    if (!formData.projectType.trim()) newErrors.projectType = "Project type is required";
    if (formData.totalProjects < 0) newErrors.totalProjects = "Total projects cannot be negative";
    return newErrors;
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Open modal for adding or editing
  const openModal = (mode, client = null) => {
    console.log("Button clicked, opening modal in", mode, "mode", client);
    setModalMode(mode);
    setSelectedClient(client);
    setFormData(
      client
        ? { ...client, totalProjects: parseInt(client.totalProjects) }
        : {
            name: "",
            image: "",
            projectType: "",
            totalProjects: 0,
            email: "",
            number: "",
            status: "Active",
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
        ? `${API_BASE_URL}/api/v1/client/create`
        : `${API_BASE_URL}/api/v1/client/${selectedClient._id}`;
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
          ...(modalMode === "edit" && { _id: selectedClient._id }),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setModalOpen(false);
        fetchClients(); // Refresh client list
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

  // Handle delete client
  const handleDelete = async (clientId) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found");
      setErrors({ apiError: "Authentication token missing" });
      return;
    }

    try {
      console.log("Deleting client with ID:", clientId);
      const response = await fetch(`${API_BASE_URL}/api/v1/client/${clientId}`, {
        method: "DELETE",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: clientId }),
      });
      const data = await response.json();
      if (data.success) {
        fetchClients(); // Refresh client list
        console.log("Client deleted:", clientId);
      } else {
        console.error("Failed to delete client:", data.message);
        setErrors({ apiError: data.message || "Failed to delete client" });
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      setErrors({ apiError: "Error deleting client. Please try again." });
    }
  };

  const filteredClients = clients.filter((client) =>
    Object.values(client).some((value) =>
      value.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  return (
    <div className="client-list-container">
      {/* Add New Client Button at Top-Right Corner */}
      <button className="add-new-btn" onClick={() => openModal("add")} style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
        Add New Client
      </button>

      {/* Search and Table Design */}
      <div className="content-wrapper">
        <div className="search-container">
          <svg className="search-icon" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            placeholder="Search Client"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Project Type</th>
                <th>Total Projects</th>
                <th>Contact Info</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client._id}>
                  <td>
                    <div className="client-info">
                      <img
                        src={client.image || UserIcon}
                        alt="Client"
                        className="client-img"
                      />
                      {client.name}
                      <br />
                      {client._id}
                    </div>
                  </td>
                  <td>{client.projectType}</td>
                  <td>{client.totalProjects}</td>
                  <td>
                    {client.email}
                    <br />
                    {client.number}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${client.status.toLowerCase()}`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => openModal("edit", client)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(client._id)}
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
      </div>

      {/* Modal for Add/Edit Client */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{modalMode === "add" ? "Add New Client" : "Edit Client"}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter name"
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Enter email"
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="number">Phone Number:</label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleFormChange}
                  placeholder="Enter phone number"
                />
                {errors.number && <span className="error">{errors.number}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="projectType">Project Type:</label>
                <input
                  type="text"
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleFormChange}
                  placeholder="Enter project type"
                />
                {errors.projectType && (
                  <span className="error">{errors.projectType}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="totalProjects">Total Projects:</label>
                <input
                  type="number"
                  id="totalProjects"
                  name="totalProjects"
                  value={formData.totalProjects}
                  onChange={handleFormChange}
                  placeholder="Enter total projects"
                />
                {errors.totalProjects && (
                  <span className="error">{errors.totalProjects}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="image">Image URL:</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  placeholder="Enter image URL"
                />
                {errors.image && <span className="error">{errors.image}</span>}
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
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
              {errors.apiError && <span className="error">{errors.apiError}</span>}
              <div className="modal-buttons">
                <button type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit">Add Client</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;