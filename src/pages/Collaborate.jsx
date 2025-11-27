import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Collaborate.css';

const Collaborate = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [formData, setFormData] = useState({
        message: '',
        role: '',
        organization: ''
    });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Check login status
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const name = localStorage.getItem('userName');
            if (token && name) {
                setIsLoggedIn(true);
                setUserName(name);
            } else {
                setIsLoggedIn(false);
                setUserName('');
            }
        };

        checkAuth();

        // Listen for login events
        window.addEventListener('user-login', checkAuth);
        window.addEventListener('storage', checkAuth);

        return () => {
            window.removeEventListener('user-login', checkAuth);
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Here you can add actual form submission logic (e.g., send to backend)
        console.log('Form submitted:', {
            userName,
            email: localStorage.getItem('userEmail') || 'N/A',
            ...formData
        });

        setSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setSubmitted(false);
            setFormData({
                message: '',
                role: '',
                organization: ''
            });
        }, 3000);
    };

    const individualOptions = [
        'Mentor with us: guide cohorts and review capstone projects',
        'Become a trainer: deliver modules in your area of expertise',
        'Contribute content: build labs, case studies, and assessments'
    ];

    const organizationOptions = [
        'Hire-trained talent via our career programs',
        'Co-create custom upskilling tracks with your SMEs',
        'Offer real-world problem statements and internships'
    ];

    const corporatePrograms = [
        'Full Stack, Data, Cloud, Cybersecurity bootcamps',
        'Role-based tracks: SDE, DevOps, QA Automation',
        'Soft skills: communication, collaboration, leadership'
    ];

    const collegePrograms = [
        'Aptitude + Reasoning + Coding interview prep',
        'Company-specific drives: mock tests and interviews',
        'Capstone-based portfolio and career support'
    ];

    const schoolPrograms = [
        'Foundation coding (Scratch, Python basics)',
        'STEM clubs: robotics, IoT, and maker activities',
        'Communication and digital citizenship workshops'
    ];

    return (
        <div className="collaborate-page">
            {/* Hero Section */}
            <section className="collaborate-hero section">
                <div className="container">
                    <div className="collaborate-hero-content text-center">
                        <h1 className="fade-in-up">Collaborate <span className="text-gradient">With Us</span></h1>
                        <p className="hero-description fade-in-up">
                            Partner as an individual mentor/trainer or as an organization to empower learners.
                            Explore our corporate and campus programs designed for real outcomes.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Card */}
            <section className="contact-card-section section">
                <div className="container">
                    <div className="contact-card card">
                        <h3>Contact Us</h3>

                        {isLoggedIn ? (
                            submitted ? (
                                <div className="success-message">
                                    <div style={{ fontSize: '48px', marginBottom: '1rem' }}>✅</div>
                                    <h4>Thank you for reaching out!</h4>
                                    <p>We've received your message and will get back to you soon.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="contact-form">
                                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                                        Welcome, <strong style={{ color: 'var(--primary-light)' }}>{userName}</strong>!
                                        Fill out the form below to get in touch with us.
                                    </p>

                                    <div className="form-group">
                                        <label htmlFor="role">I am interested as:</label>
                                        <select
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select an option</option>
                                            <option value="individual-mentor">Individual - Mentor</option>
                                            <option value="individual-trainer">Individual - Trainer</option>
                                            <option value="individual-content">Individual - Content Creator</option>
                                            <option value="organization-hiring">Organization - Hiring Partner</option>
                                            <option value="organization-training">Organization - Training Partner</option>
                                            <option value="college">College/University</option>
                                            <option value="school">School</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="organization">Organization (if applicable):</label>
                                        <input
                                            type="text"
                                            id="organization"
                                            name="organization"
                                            value={formData.organization}
                                            onChange={handleChange}
                                            placeholder="Enter your organization name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="message">Message:</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell us about your requirements and how you'd like to collaborate..."
                                            rows="5"
                                            required
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="btn btn-primary">
                                        Send Message
                                    </button>
                                </form>
                            )
                        ) : (
                            <>
                                <p>Please log in to send us your details.</p>
                                <Link to="/login" className="btn btn-primary">
                                    Login / Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* For Individuals & Organizations */}
            <section className="collab-options-section section">
                <div className="container">
                    <div className="collab-grid">
                        <div className="collab-card card">
                            <div className="collab-icon">👤</div>
                            <h3>For Individuals</h3>
                            <ul className="collab-list">
                                {individualOptions.map((option, index) => (
                                    <li key={index}>• {option}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="collab-card card">
                            <div className="collab-icon">🏢</div>
                            <h3>For Organizations</h3>
                            <ul className="collab-list">
                                {organizationOptions.map((option, index) => (
                                    <li key={index}>• {option}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Programs Section */}
            <section className="programs-overview-section section">
                <div className="container">
                    <div className="programs-overview-grid">
                        {/* Corporate Training */}
                        <div className="program-overview-card card">
                            <div className="program-icon">💼</div>
                            <h3>Corporate Training Programs</h3>
                            <ul className="program-list">
                                {corporatePrograms.map((item, index) => (
                                    <li key={index}>• {item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* College Programs */}
                        <div className="program-overview-card card">
                            <div className="program-icon">🎓</div>
                            <h3>College CRT Programs</h3>
                            <ul className="program-list">
                                {collegePrograms.map((item, index) => (
                                    <li key={index}>• {item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* School-level Programs */}
                        <div className="program-overview-card card">
                            <div className="program-icon">🏫</div>
                            <h3>School-level Programs for Students</h3>
                            <ul className="program-list">
                                {schoolPrograms.map((item, index) => (
                                    <li key={index}>• {item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Collaborate;
