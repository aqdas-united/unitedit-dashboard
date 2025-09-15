import React, { useState } from "react";
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

  const taskData = {
    labels: ["Completed Task", "Task in Progress", "Not Started Yet"],
    datasets: [
      {
        data: [15, 2, 3],
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
        data: [50, 20, 15],
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

  const ongoingProjects = [
    { name: "Jhon Smith", project: "School app", status: "In Progress" },
    { name: "Jhon Smith", project: "School app", status: "Completed" },
    { name: "Jhon Smith", project: "School app", status: "Not Started" },
    { name: "Jhon Smith", project: "School app", status: "Completed" },
    { name: "Jhon Smith", project: "School app", status: "In Progress" },
    { name: "Jhon Smith", project: "School app", status: "Completed" },
  ];

  const filteredProjects = ongoingProjects.filter(
    (project) => selectedStatus === "All" || project.status === selectedStatus
  );

  return (
    <div className="overview-container">
      <div className="metrics-section">
        <OverviewCard icon="$" label="Total Payment" count="$500" change="+5 vs last month" />
        <OverviewCard icon="📊" label="Total Projects" count="20" change="+15 vs last month" />
        <OverviewCard icon="🚀" label="Active Project" count="10" change="+5 vs last month" />
        <OverviewCard icon="✅" label="Delivered Project" count="10" change="+5 vs last month" />
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
    </div>
  );
};

export default Overview;