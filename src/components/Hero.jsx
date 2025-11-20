import React from 'react';
import './Hero.css';

const Hero = () => {
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
                        <span>🎯 Personalized Career Guidance & Placement Support</span>
                    </div>

                    <h1 className="hero-title fade-in-up">
                        Your Dream MNC Job Is Within <span className="text-gradient">Reach</span>
                    </h1>

                    <p className="hero-description fade-in-up">
                        We guide job-seeking students and working professionals with personalized roadmaps for their learning.
                        Transition from placements to career advancement with StartosEdge.
                    </p>

                    <div className="hero-actions fade-in-up">
                        <button className="btn btn-primary btn-lg">
                            Get Plan Started
                            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-card fade-in-up">
                            <h3 className="stat-number">500+</h3>
                            <p className="stat-label">Job Offers</p>
                        </div>
                        <div className="stat-card fade-in-up">
                            <h3 className="stat-number">95%</h3>
                            <p className="stat-label">Success Rate</p>
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
