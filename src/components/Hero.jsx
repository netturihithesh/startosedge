import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './Hero.css';

const Hero = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check login status
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsLoggedIn(!!user);
        });

        return () => unsubscribe();
    }, []);

    const handleGetStarted = () => {
        if (isLoggedIn) {
            // Scroll to Programs section
            const programsSection = document.getElementById('programs');
            if (programsSection) {
                programsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            // Redirect to login with a message
            navigate('/login', { state: { message: "Login to open program section", type: "info" } });
        }
    };

    return (
        <section className="hero" id="home">
            <div className="hero-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="container">
                <div className="hero-content">
                    <div className="hero-badge fade-in-up">
                        <span>🎯 Personalized Career Guidance & Industry Mentorship</span>
                    </div>

                    <h1 className="hero-title fade-in-up">
                        Your Dream MNC Job Is Within <span className="text-gradient">Reach</span>
                    </h1>

                    <p className="hero-description fade-in-up">
                        We guide job-seeking students and working professionals with personalized roadmaps for their learning.
                        Transition from learning to career advancement with StartosEdge.
                    </p>

                    <div className="hero-actions fade-in-up">
                        <button className="btn btn-primary btn-lg" onClick={handleGetStarted}>
                            {isLoggedIn ? 'View Programs' : 'Get Plan Started'}
                            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-card fade-in-up">
                            <h3 className="stat-number">500+</h3>
                            <p className="stat-label">Careers Launched</p>
                        </div>
                        <div className="stat-card fade-in-up">
                            <h3 className="stat-number">95%</h3>
                            <p className="stat-label">Satisfaction Rate</p>
                        </div>
                        <div className="stat-card fade-in-up">
                            <h3 className="stat-number">₹8 LPA</h3>
                            <p className="stat-label">Average Package</p>
                        </div>
                        <div className="stat-card fade-in-up">
                            <h3 className="stat-number">50+</h3>
                            <p className="stat-label">Hiring Partners</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
