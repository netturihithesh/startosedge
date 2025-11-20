import React from 'react';
import './About.css';

const About = () => {
    const aboutCards = [
        {
            icon: '🎯',
            title: 'Our Identity',
            description: 'StartosEdge is a fully tech-centric, delivering enterprise-grade training programs across multiple domains.'
        },
        {
            icon: '🌟',
            title: 'Vision-Driven Mission',
            description: 'To power learners, leaders of a workforce that thrives on innovation. At StratosEdge, we bridge the gap.'
        },
        {
            icon: '🤝',
            title: 'Strategic Partnerships',
            description: 'Collaborating with educators, academic institutions, and create continual learning journeys.'
        }
    ];

    const solutions = [
        {
            icon: '🏢',
            title: 'Enterprise Training',
            description: 'Upskilling your workforce in full-stack, data, cloud, QA, and managerial capability training.'
        },
        {
            icon: '🎓',
            title: 'Campus Readiness',
            description: 'Aptly Aptitude + Reasoning + Coding simulation assessments for job readiness.'
        },
        {
            icon: '⚙️',
            title: 'Tech Excellence',
            description: 'Hands-on proficiency in: full-stack, data, cloud, and open source for upskilling tech teams.'
        },
        {
            icon: '💬',
            title: 'Communication Mastery',
            description: 'Communication excellence: presentation, storytelling, and business communication.'
        },
        {
            icon: '🚀',
            title: 'Leadership Acceleration',
            description: 'Executive coaching, leadership, OKR frameworks, and driving organizational change.'
        },
        {
            icon: '🎯',
            title: 'Tailored Learning',
            description: 'Custom-built solutions to match schools (K-12), lean, post, and corporate needs.'
        }
    ];

    const expertise = [
        {
            category: 'Left Column',
            items: [
                'Strategic Decision-Making, Executive Business Storytelling',
                'Emotional Intelligence, mission-Driven DEI, Learning',
                'Cross-Cultural Communication, Mitigation',
                'Change Management',
                'AI-Driven Learning, Digital Transformation in Training'
            ]
        },
        {
            category: 'Right Column',
            items: [
                'Career Acceleration, Agile Learning, Talent Development',
                'Sales Enablement, Negotiation Mastery, Customer-Centric Selling',
                'Product Management',
                'Time Management',
                'Industry-Specific Adaptability: IT, BFSI, Telecom, Manufacturing'
            ]
        }
    ];

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero section">
                <div className="container">
                    <div className="about-hero-content text-center">
                        <h1 className="fade-in-up">
                            Transforming Talent for <span className="text-gradient">Tomorrow's Workforce</span>
                        </h1>
                        <p className="hero-subtitle fade-in-up">
                            Corporate Development | Campus-to-Corporate Readiness | Leadership Development | Digital Up-skilling
                        </p>
                    </div>
                </div>
            </section>

            {/* About Us Cards */}
            <section className="about-cards-section section">
                <div className="container">
                    <h2 className="section-title text-center">About Us</h2>
                    <div className="about-cards-grid">
                        {aboutCards.map((card, index) => (
                            <div className="about-info-card card" key={index}>
                                <div className="card-icon">{card.icon}</div>
                                <h3>{card.title}</h3>
                                <p>{card.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Meet Founder Section */}
            <section className="founder-section section">
                <div className="container">
                    <div className="founder-content">
                        <div className="founder-image">
                            <img src="/assets/founder.png" alt="Hari Krishna K" className="founder-avatar" />
                        </div>
                        <div className="founder-info">
                            <h2>Meet Hari Krishna K</h2>
                            <p className="founder-role">Co-Founder & CEO of StartosEdge</p>
                            <p className="founder-bio">
                                Hari Krishna K brings 15+ years of unmatched experience in empowering careers, students, and professionals to unlock their potential. He has transformed over 50,000 lives, led unique cohorts, and set the standard to build high-impact learning programs.
                            </p>
                            <div className="founder-quote">
                                <p>"Thriving is not about achieving a title. It's about transforming everyday lives."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Solutions */}
            <section className="solutions-section section">
                <div className="container">
                    <h2 className="section-title text-center">Our Solutions</h2>
                    <div className="solutions-grid">
                        {solutions.map((solution, index) => (
                            <div className="solution-card card" key={index}>
                                <div className="solution-icon">{solution.icon}</div>
                                <h3>{solution.title}</h3>
                                <p>{solution.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Detailed Expertise */}
            <section className="expertise-section section">
                <div className="container">
                    <h2 className="section-title text-center">Detailed Expertise</h2>
                    <div className="expertise-grid">
                        {expertise.map((column, colIndex) => (
                            <div className="expertise-column" key={colIndex}>
                                {column.items.map((item, index) => (
                                    <div className="expertise-item" key={index}>
                                        <span className="check-icon">✓</span>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
