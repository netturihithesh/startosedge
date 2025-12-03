import React from 'react';
import './Features.css';

const Features = () => {
    const whoWeServe = [
        {
            icon: '👨‍🎓',
            title: 'Students',
            description: 'internships, employability, and career clarity'
        },
        {
            icon: '🏫',
            title: 'Colleges',
            description: 'academic–industry integration and branding'
        },
        {
            icon: '🏢',
            title: 'Corporates',
            description: 'internship hiring, training collaborations, and project-based engagements'
        }
    ];

    return (
        <section className="features section" id="offerings">
            <div className="container">
                <div className="features-grid">
                    {/* Who We Serve */}
                    <div className="feature-column">
                        <h2 className="feature-column-title">Who We Serve</h2>
                        <div className="features-list">
                            {whoWeServe.map((item, index) => (
                                <div className="feature-card card" key={index}>
                                    <div className="feature-icon">{item.icon}</div>
                                    <div className="feature-content">
                                        <h3 className="feature-subtitle">{item.title}</h3>
                                        <p className="feature-text">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
