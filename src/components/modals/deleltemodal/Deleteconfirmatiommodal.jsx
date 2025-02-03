import React from "react";


const Deleteconfirmationmodal = ({ show, onClose, onConfirm }) => {
  return (
    <div className={`modal ${show ? "show" : ""}`} tabIndex="-1" style={{ display: show ? "block" : "none",}}>
      <div className="modal-dialog" style={{ width: "350px" }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Deletion</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this project?</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              No
            </button>
            <button type="button" className="btn btn-danger bg-danger" onClick={onConfirm}>
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deleteconfirmationmodal;
