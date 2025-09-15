import React from "react";
import "./Header.css";
import SEARCH_ICON from "../../assets/icons/search.png";
import BELL_ICON from "../../assets/icons/bell.png";
import UER_PLACEHOLDER from "../../assets/icons/userPlaceholder.png";

const Header = () => {
  return (
    <div className="header">
      <div className="header-left">
        <h3>Hello, Wania Ch 👋</h3>
      </div>
      <div className="header-right">
        {/* <div className="search-container">
          <img src={SEARCH_ICON} alt="Search" className="search-icon" />
          <input
            type="text"
            placeholder="Search Anything"
            className="search-bar"
          />
        </div> */}
        {/* <img src={BELL_ICON} alt="Notifications" className="bell-icon" /> */}
        {/* <div className="user-info"> */}
          {/* <img src={UER_PLACEHOLDER} alt="User" className="user-image" /> */}
          {/* <div className="user-details"> */}
            {/* <span className="user-name">Wania Ch</span> */}
            {/* <span className="user-role">Admin</span> */}
          {/* </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Header;
