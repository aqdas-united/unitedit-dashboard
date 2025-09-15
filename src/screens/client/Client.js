import React, { useState } from "react";
import "./Client.css";
import UserIcon from "../../assets/icons/userPlaceholder.png"; // Placeholder for client image
import EYE from "../../assets/icons/eye.png";

const Clients = () => {
  const [searchValue, setSearchValue] = useState("");

  const clients = [
    {
      id: "Mobile App",
      clientName: "John Smith",
      totalProjects: "02",
      contactInfo: "abc@gmail.com",
      paymentSummary: "$2000",
    },
    {
      id: "Mobile App",
      clientName: "John Smith",
      totalProjects: "02",
      contactInfo: "abc@gmail.com",
      paymentSummary: "$2000",
    },
    {
      id: "Mobile App",
      clientName: "John Smith",
      totalProjects: "02",
      contactInfo: "abc@gmail.com",
      paymentSummary: "$2000",
    },
    {
      id: "Mobile App",
      clientName: "John Smith",
      totalProjects: "02",
      contactInfo: "abc@gmail.com",
      paymentSummary: "$2000",
    },
    {
      id: "Mobile App",
      clientName: "John Smith",
      totalProjects: "02",
      contactInfo: "abc@gmail.com",
      paymentSummary: "$2000",
    },
    {
      id: "Mobile App",
      clientName: "John Smith",
      totalProjects: "02",
      contactInfo: "abc@gmail.com",
      paymentSummary: "$2000",
    },
  ];

  const filteredClients = clients.filter((client) =>
    Object.values(client).some((value) =>
      value.toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  return (
    <div className="client-list-container">
      {/* Top Bar */}
      <div className="top-bar">
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
        <div className="button-group">
          <button className="sort-btn">Status</button>
          <button className="add-new-btn">Add New Client</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Total Project</th>
              <th>Contact Info</th>
              <th>Payment Summary</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client, index) => (
              <tr key={index}>
                <td>
                  <div className="client-info">
                    <img src={UserIcon} alt="Client" className="client-img" />
                    {client.clientName}
                    <br />
                    {client.id}
                  </div>
                </td>
                <td>{client.totalProjects}</td>
                <td>{client.contactInfo}</td>
                <td>{client.paymentSummary}</td>
                <td>
                  <button className="view-btn">View Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;