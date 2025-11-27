import React, { useState } from 'react';
import './Modal.css';

const Modal = ({ title, message, onConfirm, onCancel, inputPlaceholder, type = 'confirm', confirmText, inputType = 'text', loading = false }) => {
    const [inputValue, setInputValue] = useState('');

    const handleConfirm = () => {
        if (type === 'prompt') {
            onConfirm(inputValue);
        } else {
            onConfirm();
        }
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onCancel}>×</button>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                    {type === 'prompt' && (
                        <input
                            type={inputType}
                            className="modal-input"
                            placeholder={inputPlaceholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            autoFocus
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleConfirm();
                                }
                            }}
                        />
                    )}
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleConfirm} disabled={loading}>
                        {loading ? 'Sending...' : (confirmText || (type === 'prompt' ? 'Submit' : 'Confirm'))}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
