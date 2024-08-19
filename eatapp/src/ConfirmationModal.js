import React from 'react';
import './ConfirmationModal.css'; // You can style it as shown below

const ConfirmationModal = ({ show, onClose, onConfirm, message }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h4>Confirmation</h4>
                </div>
                <div className="modal-body">
                    <p>{message || "Are you sure you want to delete this item?"}</p>
                </div>
                <div className="modal-footer">
                    <button className="confirm-btn" onClick={onConfirm}>Yes, Delete</button>
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
