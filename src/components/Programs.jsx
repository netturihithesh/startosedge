import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from '../hooks/useToast';
import Toast from './Toast';
import './Programs.css';

const Programs = () => {
    const navigate = useNavigate();
    const { toasts, success, error: showError, removeToast } = useToast();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const [enrolledPrograms, setEnrolledPrograms] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetchFeaturedPrograms();
        checkUserStatus();
    }, []);

    const checkUserStatus = async () => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUserProfile(data);
                        setEnrolledPrograms(data.enrolled_programs || []);
                        setIsAdmin(data.role === 'admin' || data.role === 'super_admin');
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            } else {
                setUserProfile(null);
                setEnrolledPrograms([]);
                setIsAdmin(false);
            }
        });
        return () => unsubscribe();
    };

    const fetchFeaturedPrograms = async () => {
        try {
            const { data, error } = await supabase
                .from('programs')
                .select('*')
                .eq('is_featured', true)
                .order('created_at', { ascending: false })
                .limit(4);

            if (error) throw error;
            setPrograms(data || []);
        } catch (error) {
            console.error('Error loading featured programs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyRequest = async (program) => {
        if (!auth.currentUser) {
            showError("Please log in to purchase a course.");
            navigate('/login');
            return;
        }

        if (!userProfile) {
            showError("Please update your profile first (Name & Phone required).");
            navigate('/profile');
            return;
        }

        if (!userProfile.phone) {
            showError("Phone number is required for purchase. Please update your profile.");
            navigate('/profile');
            return;
        }

        if (!window.confirm(`Confirm purchase request for "${program.title}"? Admin will contact you at ${userProfile.phone}.`)) {
            return;
        }

        const btnId = `buy-btn-home-${program.id}`;
        const btn = document.getElementById(btnId);
        const originalText = btn ? btn.innerText : "🛒 Buy Now";

        if (btn) {
            btn.innerText = "⏳ Sending...";
            btn.disabled = true;
        }

        // REPLACE THIS WITH YOUR DEPLOYED GOOGLE APPS SCRIPT URL
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx3jlCg-oOWDhDaP258SUUDrtbqC6h1kf4WQXqf7s-K-ROj4ZH-hioneCoHfWudMJhT/exec";

        try {
            const params = new URLSearchParams();
            params.append("name", userProfile.name);
            params.append("email", userProfile.email);
            params.append("phone", userProfile.phone);
            params.append("course", program.title);
            params.append("timestamp", new Date().toLocaleString());

            // Send data to Google Sheets
            await fetch(SCRIPT_URL, {
                method: "POST",
                body: params,
                mode: "no-cors",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            success("Request sent successfully! Admin will verify and grant access shortly.");
        } catch (error) {
            console.error("Error sending request:", error);
            showError("Failed to send request. Please try again or contact support.");
        } finally {
            if (btn) {
                btn.innerText = "✅ Request Sent";
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, 3000);
            }
        }
    };

    const handleProgramClick = (program) => {
        const isEnrolled = enrolledPrograms.includes(program.id) || isAdmin;

        if (isEnrolled) {
            navigate(`/programs/${program.id}`);
        } else {
            // If not enrolled, treat as buy request or redirect to login
            if (!auth.currentUser) {
                showError("Please log in to view course details or purchase.");
                navigate('/login');
            } else {
                // If logged in but not enrolled, maybe show details or buy?
                // The user requested "same option as each program in program section".
                // In ProgramsDetail, it shows "Buy Now".
                // So here we should probably show "Buy Now" button instead of just clicking the card.
                // But the card click usually goes to details.
                // Wait, ProgramsDetail doesn't have a separate details page, it IS the details page list.
                // CourseViewer is the content.
                // So if not enrolled, they can't see content.
                // So "Explore" button should probably be "Buy Now" if not enrolled.
            }
        }
    };

    return (
        <section className="programs section" id="programs">
            {toasts.map(toast => (
                <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
            ))}
            <div className="container">
                <div className="section-header text-center">
                    <h2>Our Flagship Placement Programs</h2>
                </div>

                <div className="programs-grid">
                    {loading ? (
                        <p className="text-center">Loading programs...</p>
                    ) : programs.length === 0 ? (
                        <p className="text-center text-muted">No featured programs available at the moment.</p>
                    ) : (
                        programs.map((program) => {
                            const isEnrolled = enrolledPrograms.includes(program.id) || isAdmin;

                            return (
                                <div className="program-card card" key={program.id}>
                                    <div className="program-thumbnail">
                                        {program.thumbnail_url ? (
                                            <img
                                                src={program.thumbnail_url}
                                                alt={program.title}
                                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                            />
                                        ) : null}
                                        <div className="program-icon-fallback" style={{ display: program.thumbnail_url ? 'none' : 'flex' }}>
                                            <span style={{ fontSize: '2rem' }}>🚀</span>
                                        </div>
                                        <span className="category-badge">{program.category}</span>
                                    </div>
                                    <div className="program-content">
                                        <h3 className="program-title">{program.title}</h3>
                                        <p className="program-description">{program.description.substring(0, 100)}...</p>
                                        <div className="program-meta">
                                            <span className="badge">{program.duration}</span>
                                            <span className="price-tag">{program.price}</span>
                                        </div>

                                        {isEnrolled ? (
                                            <button
                                                className="btn btn-success program-btn"
                                                onClick={() => navigate(`/programs/${program.id}`)}
                                            >
                                                Access Course
                                                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        ) : (
                                            <button
                                                id={`buy-btn-home-${program.id}`}
                                                className="btn btn-primary program-btn"
                                                onClick={() => handleBuyRequest(program)}
                                            >
                                                Buy Now
                                                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="text-center mt-4">
                    <button className="btn btn-outline" onClick={() => navigate('/programs')}>
                        View All Programs
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Programs;
