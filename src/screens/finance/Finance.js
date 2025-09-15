import React, { useState } from "react";
import "./Finance.css";
import EyeIcon from "../../assets/icons/eye.png";

const Finance = () => {
  const [searchValue, setSearchValue] = useState("");

  const paymentSummary = {
    totalInvoices: "$5000",
    received: "$3000",
    pending: "$2000",
  };

  const pendingPayments = [
    { project: "School App, Website", client: "Jhon", dueDate: "12-07-2025", amount: "$1200" },
    { project: "School App, Website", client: "Jhon", dueDate: "12-07-2025", amount: "$1200" },
    { project: "School App, Website", client: "Jhon", dueDate: "12-07-2025", amount: "$1200" },
    { project: "School App, Website", client: "Jhon", dueDate: "12-07-2025", amount: "$1200" },
    { project: "School App, Website", client: "Jhon", dueDate: "12-07-2025", amount: "$1200" },
    { project: "School App, Website", client: "Jhon", dueDate: "12-07-2025", amount: "$1200" },
  ];

  const filteredPendingPayments = pendingPayments.filter((payment) =>
    Object.values(payment).some((value) =>
      value.toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  return (
    <div className="finance-status-container">
      {/* Summary Section */}
      <div className="summary-section">
        <div className="summary-card">
          <div className="summary-title">Payment Summary</div>
          <div className="summary-item">
            <span className="total-icon">✓</span> Total Invoices: {paymentSummary.totalInvoices}
          </div>
          <div className="summary-item">
            <span className="received-icon">✓</span> Received: {paymentSummary.received}
          </div>
          <div className="summary-item">
            <span className="pending-icon">💰</span> Pending: {paymentSummary.pending}
          </div>
          <div className="summary-donut">$5000</div>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPendingPayments.map((payment, index) => (
              <tr key={index}>
                <td>{payment.project}</td>
                <td>{payment.client}</td>
                <td>{payment.dueDate}</td>
                <td>{payment.amount}</td>
                <td>
                  <button className="remind-btn">Remind</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Finance;