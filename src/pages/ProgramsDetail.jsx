import React, { useState } from 'react';
import './ProgramsDetail.css';

const ProgramsDetail = () => {
    const [filter, setFilter] = useState('all');

    const programs = [
        {
            id: 1,
            icon: '💻',
            title: 'Full Stack Development Program',
            description: 'Master modern frontend and backend technologies. Learn MERN stack and build projects that impress top recruiters.',
            duration: '6 Months',
            price: '₹20,000',
            category: 'technical'
        },
        {
            id: 2,
            icon: '📊',
            title: 'Data Science & AI Program',
            description: 'Go from data analysis to deep learning. Learn Python, ML, and data visualization to crack dream DS roles.',
            duration: '6 Months',
            price: '₹25,000',
            category: 'technical'
        },
        {
            id: 3,
            icon: '☁️',
            title: 'Cloud Engineering Program (AWS)',
            description: 'Get certified and land a high-paying cloud job. Includes mastering EC2, S3, Lambda, and more.',
            duration: '4 Months',
            price: '₹20,000',
            category: 'technical'
        },
        {
            id: 4,
            icon: '🔒',
            title: 'Cyber Security Program',
            description: 'Become a cyber defender. Protect organizations from digital threats with ethical hacking training.',
            duration: '5 Months',
            price: '₹18,000',
            category: 'technical'
        },
        {
            id: 5,
            icon: '🐍',
            title: 'Python & Scripting Automation',
            description: 'Automate repetitive tasks and build powerful scripts to boost productivity in any tech role.',
            duration: '3 Months',
            price: '₹12,000',
            category: 'technical'
        },
        {
            id: 6,
            icon: '📡',
            title: 'IoT / Embedded Devices',
            description: 'Learn to build end-to-program smart devices using Raspberry Pi, Arduino, and IoT cloud platforms.',
            duration: '5 Months',
            price: '₹20,000',
            category: 'technical'
        },
        {
            id: 7,
            icon: '📱',
            title: 'Digital Marketing & SEO',
            description: 'Master online promotion. Learn SEO, SEM, and social media strategies to grow brands online.',
            duration: '3 Months',
            price: '₹10,000',
            category: 'non-technical'
        },
        {
            id: 8,
            icon: '📝',
            title: 'Content & Communication',
            description: 'Develop writing, storytelling, and visual media skills. Hone your professional communication edge.',
            duration: '2 Months',
            price: '₹8,000',
            category: 'non-technical'
        },
        {
            id: 9,
            icon: '👥',
            title: 'HR & Talent Engagement',
            description: 'Learn the fundamentals of human resources, talent recruitment and innovative employee support.',
            duration: '3 Months',
            price: '₹15,000',
            category: 'non-technical'
        },
        {
            id: 10,
            icon: '🎨',
            title: 'Instructional Design & Curriculum Research',
            description: 'Learn to create engaging and effective learning experiences and research-driven training edge.',
            duration: '4 Months',
            price: '₹20,000',
            category: 'non-technical'
        }
    ];

    const filteredPrograms = filter === 'all'
        ? programs
        : programs.filter(p => p.category === filter);

    return (
        <div className="programs-detail-page">
            {/* Hero Section */}
            <section className="programs-detail-hero section">
                <div className="container">
                    <div className="programs-detail-hero-content text-center">
                        <h1 className="fade-in-up">All Placement <span className="text-gradient">Programs</span></h1>
                        <p className="hero-description fade-in-up">
                            Choose your path to a successful tech career. Every program comes with 100% placement assistance.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="filter-section section">
                <div className="container">
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`filter-btn ${filter === 'technical' ? 'active' : ''}`}
                            onClick={() => setFilter('technical')}
                        >
                            Technical
                        </button>
                        <button
                            className={`filter-btn ${filter === 'non-technical' ? 'active' : ''}`}
                            onClick={() => setFilter('non-technical')}
                        >
                            Non-Technical
                        </button>
                    </div>
                </div>
            </section>

            {/* Programs Grid */}
            <section className="programs-grid-section section">
                <div className="container">
                    <div className="programs-detail-grid">
                        {filteredPrograms.map((program) => (
                            <div className="program-detail-card card" key={program.id}>
                                <div className="program-detail-icon">{program.icon}</div>
                                <h3>{program.title}</h3>
                                <p className="program-detail-description">{program.description}</p>
                                <div className="program-detail-meta">
                                    <span className="meta-item">
                                        <strong>{program.duration}</strong>
                                    </span>
                                    <span className="meta-item price">
                                        <strong>{program.price}</strong>
                                    </span>
                                </div>
                                <button className="btn btn-primary btn-full">
                                    Explore
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProgramsDetail;
