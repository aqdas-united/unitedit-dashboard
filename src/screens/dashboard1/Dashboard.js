import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Dashboard from "./Dashboard";
import Header from "../../components/header/Header";
import "./Dashboard.css";
import Clients from "../client/Client";
import UserManagement from "../projects/Projects";
import Settings from "../settings/Settings";

import Finance from "../finance/Finance";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<UserManagement />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/deliveries" element={<Finance />} />
          <Route path="/settings" element={<Settings />} />

          <Route
            path="*"
            element={<Navigate to="/dashboard/dashboard" replace />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
