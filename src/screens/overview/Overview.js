import React, { useState, useEffect } from "react";
import "./Overview.css";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OverviewCard = ({ icon, label, count, change }) => {
  return (
    <div className="overview-card">
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h6>{label}</h6>
        <h4>{count}</h4>
        <span className="change">{change}</span>
      </div>
    </div>
  );
};

const Overview = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [paymentStats, setPaymentStats] = useState({ totalAmount: 0 });
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4500";

  useEffect(() => {
    console.log("Component mounted, fetching data...");
    fetchPaymentStats();
    fetchProjects();
  }, []);

  const fetchPaymentStats = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found");
        setErrors({ apiError: "Authentication token missing" });
        return;
      }
      console.log("Fetching payment stats from:", `${API_BASE_URL}/api/v1/payment`);
      const response = await fetch(`${API_BASE_URL}/api/v1/payment`, {
        method: "GET",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success && data.status === 200) {
        setPaymentStats({ totalAmount: data.data.totalAmount });
        console.log("Payment stats fetched:", data.data);
      } else {
        console.error("Failed to fetch payment stats:", data.message);
        setErrors({ apiError: data.message || "Failed to fetch payment stats" });
      }
    } catch (error) {
      console.error("Error fetching payment stats:", error);
      setErrors({ apiError: "Error fetching payment stats. Please try again." });
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

  const taskData = {
    labels: ["Completed Task", "Task in Progress", "Not Started Yet"],
    datasets: [
      {
        data: [
          projects.filter((p) => p.status === "Completed").length,
          projects.filter((p) => p.status === "Active").length,
          projects.filter((p) => p.status === "Inactive").length,
        ],
        backgroundColor: ["#2ECC71", "#9B59B6", "#95A5A6"],
        borderWidth: 0,
      },
    ],
  };

  const taskOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { color: "#666" } },
    },
  };

  const barData = {
    labels: ["Design", "Development", "QA"],
    datasets: [
      {
        label: "",
        data: [
          projects.filter((p) => p.phase === "Designing").length,
          projects.filter((p) => p.phase === "Development").length,
          projects.filter((p) => p.phase === "Testing").length,
        ],
        backgroundColor: ["#9B59B6", "#1ABC9C", "#3498DB"],
        borderRadius: 5,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { color: "#666" } },
      x: { ticks: { color: "#666" } },
    },
    plugins: { legend: { display: false } },
  };

  const ongoingProjects = projects.map((p) => ({
    name: p.client?.name || "Unknown",
    project: p.name,
    status: p.status,
  }));

  const filteredProjects = ongoingProjects.filter(
    (project) => selectedStatus === "All" || project.status === selectedStatus
  );

  return (
    <div className="overview-container">
      <div className="metrics-section">
        <OverviewCard icon="$" label="Total Payment" count={`$${paymentStats.totalAmount}`} change="+5 vs last month" />
        <OverviewCard icon="📊" label="Total Projects" count={projects.length} change="+15 vs last month" />
        <OverviewCard icon="🚀" label="Active Project" count={projects.filter((p) => p.status === "Active").length} change="+5 vs last month" />
        <OverviewCard icon="✅" label="Delivered Project" count={projects.filter((p) => p.status === "Completed").length} change="+5 vs last month" />
      </div>

      <div className="stats-section">
        <div className="chart-container">
          <h3>Statistics</h3>
          <Doughnut data={taskData} options={taskOptions} />
        </div>
        <div className="chart-container">
          <h3></h3>
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="ongoing-projects">
          <div className="projects-header">
            <h3>Ongoing Projects</h3>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="status-filter"
            >
              <option value="All">All</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>
          <div className="projects-list">
            {filteredProjects.map((project, index) => (
              <div key={index} className="project-item">
                <span>{project.name}</span>
                <span>{project.project}</span>
                <button
                  className={`status-btn ${project.status.toLowerCase().replace(" ", "-")}`}
                >
                  {project.status}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {errors.apiError && (
        <div className="error-container">
          <span className="error">{errors.apiError}</span>
        </div>
      )}
    </div>
  );
};

export default Overview;