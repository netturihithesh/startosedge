import React from 'react';
import { Link } from 'react-router-dom';

const FinishSignUp = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '2rem',
            padding: '2rem'
        }}>
            <h1>This feature is currently unavailable</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Please use email/password or Google sign-in to create an account.</p>
            <Link to="/signup" className="btn btn-primary">Go to Sign Up</Link>
        </div>
    );
};

export default FinishSignUp;
