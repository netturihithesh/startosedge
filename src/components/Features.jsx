import React from 'react';
import './Features.css';

const Features = () => {
    const keyOfferings = [
        {
            icon: '🚀',
            title: 'Industry-driven Internships & Live Projects'
        },
        {
            icon: '🎓',
            title: 'AICTE-linked Career-Readiness Programs'
        },
        {
            icon: '🏆',
            title: 'NAAC/NBA support for colleges'
        },
        {
            icon: '📜',
            title: 'Placement-focused Certification Courses'
        },
        {
            icon: '💼',
            title: 'Corporate Training & L&D Solutions'
        },
        {
            icon: '👨‍🏫',
            title: 'Faculty Development Programs'
        }
    ];

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
                    {/* Key Offerings */}
                    <div className="features-column">
                        <h2 className="features-section-title">Key Offerings</h2>
                        <div className="features-list">
                            {keyOfferings.map((offering, index) => (
                                <div className="feature-card card" key={index}>
                                    <div className="feature-icon">{offering.icon}</div>
                                    <p className="feature-text">{offering.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Who We Serve */}
                    <div className="features-column">
                        <h2 className="features-section-title">Who We Serve</h2>
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
