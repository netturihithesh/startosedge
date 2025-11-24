import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Programs.css';

const Programs = () => {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedPrograms();
    }, []);

    const fetchFeaturedPrograms = async () => {
        try {
            const { data, error } = await supabase
                .from('programs')
                .select('*')
                .eq('is_featured', true)
                .order('created_at', { ascending: false })
                .limit(4); // Limit to 4 featured programs

            if (error) throw error;
            setPrograms(data || []);
        } catch (error) {
            console.error('Error loading featured programs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="programs section" id="programs">
            <div className="container">
                <div className="section-header text-center">
                    <h2>Our Flagship Placement Programs</h2>
                </div>

                <div className="programs-grid">
                    {loading ? (
                        <p className="text-center">Loading programs...</p>
                    ) : programs.length === 0 ? (
                        <p className="text-center text-muted">No featured programs available at the moment.</p>
                    ) : (
                        programs.map((program) => (
                            <div className="program-card card" key={program.id}>
                                <div className="program-thumbnail">
                                    {program.thumbnail_url ? (
                                        <img
                                            src={program.thumbnail_url}
                                            alt={program.title}
                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                        />
                                    ) : null}
                                    <div className="program-icon-fallback" style={{ display: program.thumbnail_url ? 'none' : 'flex' }}>
                                        <span style={{ fontSize: '2rem' }}>🚀</span>
                                    </div>
                                    <span className="category-badge">{program.category}</span>
                                </div>
                                <div className="program-content">
                                    <h3 className="program-title">{program.title}</h3>
                                    <p className="program-description">{program.description.substring(0, 100)}...</p>
                                    <div className="program-meta">
                                        <span className="badge">{program.duration}</span>
                                        <span className="price-tag">{program.price}</span>
                                    </div>
                                    <button
                                        className="btn btn-primary program-btn"
                                        onClick={() => navigate(`/programs/${program.id}`)}
                                    >
                                        Explore
                                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="text-center mt-4">
                    <button className="btn btn-outline" onClick={() => navigate('/programs')}>
                        View All Programs
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Programs;
