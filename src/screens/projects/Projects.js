import React, { useState } from "react";
import "./Projects.css";
import EYE from "../../assets/icons/eye.png";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("user");
  const [searchValue, setSearchValue] = useState("");
  const [users] = useState([
    {
      id: "#1234",
      name: "Ahmad",
      client: "John Smith",
      dates: "12-07-2025",
      status: "Active",
      phase: "Designing",
      budget: "$1200",
    },
    {
      id: "#5678",
      name: "Hatsoon",
      client: "John Smith",
      dates: "12-07-2025",
      status: "Active",
      phase: "Designing",
      budget: "$1200",
    },
    {
      id: "#8971",
      name: "Ahmad",
      client: "John Smith",
      dates: "12-07-2025",
      status: "Active",
      phase: "Designing",
      budget: "$1200",
    },
    {
      id: "#5548",
      name: "Hatsoon",
      client: "John Smith",
      dates: "12-07-2025",
      status: "Active",
      phase: "Designing",
      budget: "$1200",
    },
    {
      id: "#0000",
      name: "Ahmad",
      client: "John Smith",
      dates: "12-07-2025",
      status: "Active",
      phase: "Designing",
      budget: "$1200",
    },
    {
      id: "#4482",
      name: "Ahmad",
      client: "John Smith",
      dates: "12-07-2025",
      status: "Active",
      phase: "Designing",
      budget: "$1200",
    },
    {
      id: "#4582",
      name: "Ahmad",
      client: "John Smith",
      dates: "12-07-2025",
      status: "Active",
      phase: "Designing",
      budget: "$1200",
    },
    {
      id: "#4852",
      name: "Ahmad",
      client: "John Smith",
      dates: "12-07-2025",
      status: "Active",
      phase: "Designing",
      budget: "$1200",
    },
    {
      id: "#4582",
      name: "Ahmad",
      client: "John Smith",
      dates: "12-07-2025",
      status: "Active",
      phase: "Designing",
      budget: "$1200",
    },
    {
      id: "#4582",
      name: "Ahmad",
      client: "John Smith",
      dates: "12-07-2025",
      status: "Active",
      phase: "Designing",
      budget: "$1200",
    },
    {
      id: "#4882",
      name: "Ahmad",
      client: "John Smith",
      dates: "12-07-2025",
      status: "Active",
      phase: "Designing",
      budget: "$1200",
    },
  ]);

  const [permissions] = useState([
    { id: "#001", name: "Dr. Sarah Khan", type: "Doctor", status: "Pending" },
    { id: "#002", name: "Ali Raza", type: "Rider", status: "Pending" },
    { id: "#003", name: "Dr. Faisal Ahmed", type: "Doctor", status: "Pending" },
    { id: "#004", name: "Bilal Hassan", type: "Rider", status: "Pending" },
    { id: "#005", name: "Dr. Zainab Malik", type: "Doctor", status: "Pending" },
  ]);

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value.toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const filteredPermissions = permissions.filter((permission) =>
    Object.values(permission).some((value) =>
      value.toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  return (
    <div className="advanced-filter-container">
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
          <button className="add-new-btn">Add New Project</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div
          className={`tab ${activeTab === "user" ? "active" : ""}`}
          onClick={() => setActiveTab("user")}
        >
          User
        </div>
        <div
          className={`tab ${activeTab === "permissions" ? "active" : ""}`}
          onClick={() => setActiveTab("permissions")}
        >
          Permissions
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {activeTab === "user" ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Client</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Phase</th>
                <th>Budget</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.id}</td>
                  <td>{user.client}</td>
                  <td>{user.dates}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.status === "Active" ? "completed" : ""
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>{user.phase}</td>
                  <td>{user.budget}</td>
                  <td>
                    <button className="view-btn">View Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Phone Number</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>View</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPermissions.map((permission, index) => (
                <tr key={index}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{permission.id}</td>
                  <td>{permission.name}</td>
                  <td>21 Mach 2025</td>
                  <td>+921234567889</td>
                  <td>Abc@gmail.com</td>
                  <td>
                    <span
                      className={`${
                        permission.type === "Doctor"
                          ? "status-badge doctor"
                          : "status-badge rider"
                      }`}
                    >
                      {permission.type}
                    </span>
                  </td>
                  <td>
                    <button className="eye-btn">
                      <img
                        src={EYE}
                        style={{ width: "20px", height: "20px" }}
                      />
                    </button>
                  </td>

                  <td className="actions">
                    <button className="approve-btn">
                      <svg viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </button>
                    <button className="reject-btn">
                      <svg viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;