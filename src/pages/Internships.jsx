import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAdmin } from '../hooks/useAdmin';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import './Internships.css';

const Internships = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAdmin();
    const { toasts, success, error: showError, removeToast } = useToast();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: 'Remote',
        type: 'Full-time',
        stipend: '',
        duration: '',
        apply_link: '',
        description: ''
    });

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            const { data, error } = await supabase
                .from('internships')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setInternships(data || []);
        } catch (error) {
            console.error('Error fetching internships:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('internships')
                .insert([{ ...formData }]);

            if (error) throw error;

            success('Internship posted successfully!');
            setFormData({
                title: '',
                company: '',
                location: 'Remote',
                type: 'Full-time',
                stipend: '',
                duration: '',
                apply_link: '',
                description: ''
            });
            fetchInternships();
        } catch (error) {
            console.error('Error posting internship:', error);
            showError('Failed to post internship');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this internship?')) {
            try {
                const { error } = await supabase
                    .from('internships')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                success('Internship deleted');
                fetchInternships();
            } catch (error) {
                console.error('Error deleting internship:', error);
                showError('Failed to delete internship');
            }
        }
    };

    // Static content arrays...
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

    return (
        <div className="internships-page">
            {toasts.map(toast => (
                <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
            ))}

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

            {/* Admin Section: Add Internship */}
            {isAdmin && (
                <section className="section">
                    <div className="container">
                        <div className="admin-panel card">
                            <h3>👑 Admin: Post New Internship</h3>
                            <form onSubmit={handleSubmit} className="admin-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Title</label>
                                        <input name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g. Frontend Intern" />
                                    </div>
                                    <div className="form-group">
                                        <label>Company</label>
                                        <input name="company" value={formData.company} onChange={handleInputChange} required placeholder="e.g. TechCorp" />
                                    </div>
                                    <div className="form-group">
                                        <label>Duration</label>
                                        <input name="duration" value={formData.duration} onChange={handleInputChange} required placeholder="e.g. 3 Months" />
                                    </div>
                                    <div className="form-group">
                                        <label>Stipend</label>
                                        <input name="stipend" value={formData.stipend} onChange={handleInputChange} placeholder="e.g. ₹10,000/mo" />
                                    </div>
                                    <div className="form-group">
                                        <label>Type</label>
                                        <select name="type" value={formData.type} onChange={handleInputChange}>
                                            <option>Full-time</option>
                                            <option>Part-time</option>
                                            <option>Remote</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Apply Link</label>
                                        <input name="apply_link" value={formData.apply_link} onChange={handleInputChange} placeholder="https://..." />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3"></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">Post Internship</button>
                            </form>
                        </div>
                    </div>
                </section>
            )}

            {/* Available Internships List */}
            <section className="section">
                <div className="container">
                    <h2 className="text-center">Open Positions</h2>
                    {loading ? (
                        <p className="text-center">Loading opportunities...</p>
                    ) : internships.length === 0 ? (
                        <p className="text-center text-muted">No open positions currently. Check back later!</p>
                    ) : (
                        <div className="internships-grid">
                            {internships.map(item => (
                                <div className="internship-card card" key={item.id}>
                                    <div className="card-header">
                                        <h3>{item.title}</h3>
                                        <span className="badge">{item.type}</span>
                                    </div>
                                    <p className="company-tag"><strong>Company:</strong> {item.company}</p>
                                    <p className="duration-tag"><strong>Duration:</strong> {item.duration}</p>
                                    <p className="stipend-tag"><strong>Stipend:</strong> {item.stipend || 'Unpaid'}</p>
                                    <p className="description">{item.description}</p>
                                    <div className="card-actions">
                                        {item.apply_link && (
                                            <a href={item.apply_link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Apply Now</a>
                                        )}
                                        {isAdmin && (
                                            <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
        </div>
    );
};

export default Internships;
