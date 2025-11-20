import React, { useState } from 'react';
import './Internships.css';

const Internships = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const internshipFeatures = [
        'Practice work—not theory',
        'Weekly progress reports and mentor check-ins',
        'Certificate + personalized recommendations'
    ];

    const technicalDomains = [
        { icon: '💻', title: 'Web & Full-Stack Development' },
        { icon: '🤖', title: 'AI, Machine Learning & Data Science' },
        { icon: '🔒', title: 'Cybersecurity Awareness' },
        { icon: '🐍', title: 'Python & Scripting Automation' },
        { icon: '📡', title: 'IoT / Embedded Devices' }
    ];

    const nonTechnicalDomains = [
        { icon: '📝', title: 'Content & Communication' },
        { icon: '📱', title: 'Digital Marketing & SEO' },
        { icon: '🎨', title: 'Instructional Design' },
        { icon: '👥', title: 'HR & Talent Engagement' }
    ];

    const whyIntern = [
        { icon: '⭐', title: 'Live, industry-grade projects' },
        { icon: '🏆', title: '1-to-1 mentorship & weekly goals' },
        { icon: '💼', title: 'Career coaching + soft-skills workshops' },
        { icon: '📜', title: 'Certificate & Letter of Recommendation' }
    ];

    const faqs = [
        {
            question: 'Is this a paid internship?',
            answer: 'This is an unpaid program focused on skill development. It includes high-value mentorship, a certificate upon completion, and a letter of recommendation for your successful completion.'
        },
        {
            question: 'What is the duration?',
            answer: 'Internships typically run for 6-12 weeks depending on the domain and project complexity chosen.'
        },
        {
            question: 'What is the mode of work?',
            answer: 'All internships are remote. You will have weekly virtual check-ins with your mentor and access to our learning platform.'
        },
        {
            question: 'Who is eligible to apply?',
            answer: 'Students, recent graduates, and working professionals looking to upskill are welcome. Some domains may require basic foundational knowledge.'
        },
        {
            question: 'What are the requirements?',
            answer: 'A laptop with internet access, dedication to learn, and commitment to complete assigned projects on time.'
        },
        {
            question: 'Are there any fees involved?',
            answer: 'Our internship program is free. However,we have select paid internships available for those seeking premium mentorship.'
        }
    ];

    return (
        <div className="internships-page">
            {/* Hero Section */}
            <section className="internships-hero section">
                <div className="container">
                    <div className="internships-hero-content text-center">
                        <h1 className="fade-in-up">Gain Real-World <span className="text-gradient">Experience</span></h1>
                        <p className="hero-description fade-in-up">
                            Our internships bridge the gap between academic theory and industry practice.
                        </p>
                    </div>
                </div>
            </section>

            {/* Internship Overview */}
            <section className="internship-overview-section section">
                <div className="container">
                    <h2>Internship Overview</h2>
                    <p className="overview-description">
                        Our internship at StartosEdge immerses students in live projects, guided by expert mentors.
                        From web-app builds to marketing campaigns, every task is real and impactful.
                    </p>
                    <ul className="features-list">
                        {internshipFeatures.map((feature, index) => (
                            <li key={index}>
                                <span className="check-icon">✓</span> {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Internship Domains */}
            <section className="internship-domains-section section">
                <div className="container">
                    <h2>Internship Domains</h2>

                    {/* Technical Domains */}
                    <div className="domain-category">
                        <h3><span className="domain-icon">⚙️</span> Technical Domains</h3>
                        <div className="domains-grid">
                            {technicalDomains.map((domain, index) => (
                                <div className="domain-card card" key={index}>
                                    <span className="domain-emoji">{domain.icon}</span>
                                    <p>{domain.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Non-Technical Domains */}
                    <div className="domain-category">
                        <h3><span className="domain-icon">💡</span> Non-Technical / Creative Domains</h3>
                        <div className="domains-grid">
                            {nonTechnicalDomains.map((domain, index) => (
                                <div className="domain-card card" key={index}>
                                    <span className="domain-emoji">{domain.icon}</span>
                                    <p>{domain.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Intern Section */}
            <section className="why-intern-section section">
                <div className="container">
                    <h2>Why Intern With Us?</h2>
                    <div className="why-intern-grid">
                        {whyIntern.map((item, index) => (
                            <div className="why-intern-item" key={index}>
                                <span className="why-icon">{item.icon}</span>
                                <p>{item.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="faqs-section section">
                <div className="container">
                    <h2>FAQs</h2>
                    <div className="faqs-list">
                        {faqs.map((faq, index) => (
                            <div className="faq-item card" key={index}>
                                <button
                                    className={`faq-question ${openFaq === index ? 'active' : ''}`}
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                >
                                    <span>{faq.question}</span>
                                    <span className="faq-icon">{openFaq === index ? '−' : '+'}</span>
                                </button>
                                {openFaq === index && (
                                    <div className="faq-answer">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="faq-note card">
                        <p>
                            <strong>Note:</strong> For more paid & non-refundable, clarity on regular attendance are mandatory.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Internships;
