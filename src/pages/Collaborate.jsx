import React from 'react';
import { Link } from 'react-router-dom';
import './Collaborate.css';

const Collaborate = () => {
    const individualOptions = [
        'Mentor with us: guide cohorts and review capstone projects',
        'Become a trainer: deliver modules in your area of expertise',
        'Contribute content: build labs, case studies, and assessments'
    ];

    const organizationOptions = [
        'Hire-trained talent via our placement programs',
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
        'Capstone-based portfolio and placement assistance'
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
                        <p>Please log in to send us your details.</p>
                        <Link to="/login" className="btn btn-primary">
                            Login / Sign Up
                        </Link>
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
