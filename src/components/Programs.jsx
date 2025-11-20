import React from 'react';
import './Programs.css';

const Programs = () => {
    const programs = [
        {
            icon: '💻',
            title: 'Full Stack Development',
            description: 'Master both frontend and backend technologies with hands-on projects and industry-standard practices.',
            duration: '6 Months',
            level: 'Beginner to Advanced'
        },
        {
            icon: '📊',
            title: 'Data Science & ML Projects',
            description: 'Learn data analysis, machine learning, and AI with real-world datasets and cutting-edge tools.',
            duration: '5 Months',
            level: 'Intermediate'
        },
        {
            icon: '🔒',
            title: 'Cyber Security Bootcamp',
            description: 'Comprehensive training in ethical hacking, network security, and cybersecurity best practices.',
            duration: '4 Months',
            level: 'Beginner to Advanced'
        },
        {
            icon: '📱',
            title: 'Digital Marketing & SEO',
            description: 'Master digital marketing strategies, SEO optimization, and social media marketing techniques.',
            duration: '3 Months',
            level: 'All Levels'
        }
    ];

    return (
        <section className="programs section" id="programs">
            <div className="container">
                <div className="section-header text-center">
                    <h2>Our Flagship Placement Programs</h2>
                    <p className="section-description">
                        Choose from our industry-leading programs designed to get you placement-ready
                        with comprehensive training and guaranteed interview opportunities.
                    </p>
                </div>

                <div className="programs-grid">
                    {programs.map((program, index) => (
                        <div className="program-card card" key={index}>
                            <div className="program-icon">{program.icon}</div>
                            <h3 className="program-title">{program.title}</h3>
                            <p className="program-description">{program.description}</p>
                            <div className="program-meta">
                                <span className="badge">{program.duration}</span>
                                <span className="badge">{program.level}</span>
                            </div>
                            <button className="btn btn-primary program-btn">
                                Explore
                                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Programs;
