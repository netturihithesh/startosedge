import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { checkProfileCompleteness } from '../utils/profileUtils';

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Check if profile is complete
                const { isComplete } = await checkProfileCompleteness(currentUser.uid);
                setIsProfileComplete(isComplete);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="loading-container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div className="spinner"></div>
            </div>
        );
    }

    // If not logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" state={{ from: location, message: "Please login to access this section", type: "info" }} replace />;
    }

    // If logged in but profile incomplete, and not already on profile page
    // We allow access to /profile so they can fix it
    if (!isProfileComplete && location.pathname !== '/profile') {
        return <Navigate to="/profile" state={{ showIncompleteProfileWarning: true }} replace />;
    }

    return children;
};

export default ProtectedRoute;
