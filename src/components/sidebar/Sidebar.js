import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import MEDICAL_IMAGES from "../../assets/images/logo.png";
import OVERVIEW from "../../assets/icons/overview.png";
import APPOINMENT from "../../assets/icons/appointment.png";
import DELIVERY from "../../assets/icons/delivery.png";
import SETTING from "../../assets/icons/setting.png";
import USER_MANAGE from "../../assets/icons/userManage.png";
import LOGOUT from "../../assets/icons/logout.png"

import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  // Set Overview as active by default if on /dashboard
  React.useEffect(() => {
    if (location.pathname === "/dashboard") {
      window.history.replaceState(null, "", "/dashboard/overview");
    }
  }, [location.pathname]);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={MEDICAL_IMAGES} alt="Medical Logo" className="medical-logo" />
        <h2>UnitedIT</h2>
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/dashboard/overview" activeclassname="active" end>
            <img
              src={OVERVIEW}
              alt="User Management"
              className="sidebar-icon"
            />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/projects" activeclassname="active">
            <img
              src={USER_MANAGE}
              alt="User Management"
              className="sidebar-icon"
            />
            <span>Projects</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/clients" activeclassname="active">
            <img src={APPOINMENT} alt="Clients" className="sidebar-icon" />
            <span>Clients</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/deliveries" activeclassname="active">
            <img src={DELIVERY} alt="Deliveries" className="sidebar-icon" />
            <span>Finance</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/settings" activeclassname="active">
            <img src={SETTING} alt="Settings" className="sidebar-icon" />
            <span>Settings</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/login"
            activeclassname="active"
            onClick={() => localStorage.clear()}
          >
            <img src={LOGOUT} alt="Logout" className="sidebar-icon" />
            <span>Logout</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
