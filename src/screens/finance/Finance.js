import React, { useState, useEffect } from "react";
import "./Finance.css";
import EyeIcon from "../../assets/icons/eye.png";

const Finance = () => {
  const [searchValue, setSearchValue] = useState("");
  const [payments, setPayments] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, receivedAmount: 0, pendingAmount: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    amount: 0,
    status: "pending",
    client: "",
    project: "",
  });
  const [errors, setErrors] = useState({});

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4500";

  useEffect(() => {
    console.log("Component mounted, fetching data...");
    fetchPayments();
    fetchClients();
    fetchProjects();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found");
        setErrors({ apiError: "Authentication token missing" });
        return;
      }
      console.log("Fetching payments from:", `${API_BASE_URL}/api/v1/payment`);
      const response = await fetch(`${API_BASE_URL}/api/v1/payment`, {
        method: "GET",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success && data.status === 200) {
        setPayments(data.data.payments);
        setSummary({
          totalAmount: data.data.totalAmount,
          receivedAmount: data.data.receivedAmount,
          pendingAmount: data.data.pendingAmount,
        });
        console.log("Payments and summary fetched:", data.data);
      } else {
        console.error("Failed to fetch payments:", data.message);
        setErrors({ apiError: data.message || "Failed to fetch payments" });
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setErrors({ apiError: "Error fetching payments. Please try again." });
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date.trim()) newErrors.date = "Date is required";
    if (formData.amount <= 0) newErrors.amount = "Amount must be positive";
    if (!formData.client) newErrors.client = "Client is required";
    if (!formData.project) newErrors.project = "Project is required";
    return newErrors;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const openModal = (mode, payment = null) => {
    console.log("Button clicked, opening modal in", mode, "mode", payment);
    setModalMode(mode);
    setSelectedPayment(payment);
    setFormData(
      payment
        ? { ...payment, client: payment.client?._id || "", project: payment.project._id }
        : {
            date: "",
            amount: 0,
            status: "pending",
            client: "",
            project: "",
          }
    );
    setErrors({});
    setModalOpen(true);
  };

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
        ? `${API_BASE_URL}/api/v1/payment/create`
        : `${API_BASE_URL}/api/v1/payment/${selectedPayment._id}`;
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
          ...(modalMode === "edit" && { _id: selectedPayment._id }),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setModalOpen(false);
        fetchPayments(); // Refresh payment list and summary
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

  const handleDelete = async (paymentId) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found");
      setErrors({ apiError: "Authentication token missing" });
      return;
    }

    try {
      console.log("Deleting payment with ID:", paymentId);
      const response = await fetch(`${API_BASE_URL}/api/v1/payment/${paymentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        fetchPayments(); // Refresh payment list and summary
        console.log("Payment deleted:", paymentId);
      } else {
        console.error("Failed to delete payment:", data.message);
        setErrors({ apiError: data.message || "Failed to delete payment" });
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      setErrors({ apiError: "Error deleting payment. Please try again." });
    }
  };

  const filteredPayments = payments.filter((payment) =>
    Object.values(payment).some((value) =>
      value?.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  return (
    <div className="finance-status-container">
      {/* Add New Payment Button at Top-Right Corner */}
      <button className="add-new-btn" onClick={() => openModal("add")} style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
        Add New Payment
      </button>

      {/* Summary Section */}
      <div className="summary-section">
        <div className="summary-card">
          <div className="summary-title">Payment Summary</div>
          <div className="summary-item">
            <span className="total-icon">✓</span> Total Invoices: ${summary.totalAmount}
          </div>
          <div className="summary-item">
            <span className="received-icon">✓</span> Received: ${summary.receivedAmount}
          </div>
          <div className="summary-item">
            <span className="pending-icon">💰</span> Pending: ${summary.pendingAmount}
          </div>
          <div className="summary-donut">${summary.totalAmount}</div>
        </div>
        <div className="summary-card">
          <div className="summary-chart"></div>
        </div>
      </div>

      {/* Pending Payments Header */}
      <div className="pending-payments-header">Pending Payments</div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.project.name}</td>
                <td>{payment.client?.name || "N/A"}</td>
                <td>{payment.date}</td>
                <td>{`$${payment.amount}`}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => openModal("edit", payment)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(payment._id)}
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

      {/* Modal for Add/Edit Payment */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{modalMode === "add" ? "Add New Payment" : "Edit Payment"}</h2>
            <form onSubmit={handleFormSubmit}>
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
                <label htmlFor="amount">Amount:</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleFormChange}
                  placeholder="Enter amount"
                />
                {errors.amount && <span className="error">{errors.amount}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="status">Status:</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="pending">Pending</option>
                  <option value="received">Received</option>
                </select>
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
              <div className="form-group">
                <label htmlFor="project">Project:</label>
                <select
                  id="project"
                  name="project"
                  value={formData.project}
                  onChange={handleFormChange}
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {errors.project && <span className="error">{errors.project}</span>}
              </div>
              {errors.apiError && <span className="error">{errors.apiError}</span>}
              <div className="modal-buttons">
                <button type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit">{modalMode === "add" ? "Add Payment" : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;