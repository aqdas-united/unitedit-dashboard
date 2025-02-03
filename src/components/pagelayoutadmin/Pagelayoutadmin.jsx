import React from "react";
import SideBarAdmin from "../../components/sidebar/Sidebar"
import Navbar from "../navbar/Navbar";
import "./pagelyoutadmin.css";

function PageLayoutAdmin(props) {
  return (
    <div id="wrapper" className="d-flex flex-column">
      <Navbar />
      <div id="content-wrapper" className="d-flex">
        <SideBarAdmin />
        <div id="content" className="main-content">{props.children}</div>
      </div>
    </div>
  );
}

export default PageLayoutAdmin;
