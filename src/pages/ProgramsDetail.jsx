import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { auth } from '../firebase';
import { useAdmin } from '../hooks/useAdmin';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { useNavigate } from 'react-router-dom';
import './ProgramsDetail.css';

const ProgramsDetail = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [programs, setPrograms] = useState([]);
    const { isAdmin } = useAdmin();
    const { toasts, success, error: showError, removeToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
        price: '',
        category: 'technical',
        thumbnail_url: '',
        is_featured: false
    });

    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                showError('Please log in to view programs.');
                navigate('/login');
            } else {
                setAuthLoading(false);
                fetchPrograms();
            }
        });

        return () => unsubscribe();
    }, [navigate, showError]);

    const fetchPrograms = async () => {
        try {
            const { data, error } = await supabase
                .from('programs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPrograms(data || []);
        } catch (error) {
            console.error('Error loading programs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showError('Please select an image file');
                return;
            }
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                showError('Image size should be less than 2MB');
                return;
            }
            setThumbnailFile(file);
        }
    };

    const uploadThumbnail = async (file) => {
        // Sanitize filename: remove special chars, spaces to underscores
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        console.log('Uploading file:', fileName);

        const { data, error } = await supabase.storage
            .from('course-videos')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Storage Upload Error:', error);
            throw new Error('Image upload failed: ' + error.message);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('course-videos')
            .getPublicUrl(fileName);

        console.log('File uploaded, public URL:', publicUrl);
        return publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            let thumbnail_url = formData.thumbnail_url;

            // Upload thumbnail if file is selected
            if (thumbnailFile) {
                thumbnail_url = await uploadThumbnail(thumbnailFile);
            }

            const { error } = await supabase
                .from('programs')
                .insert([{
                    title: formData.title,
                    description: formData.description,
                    duration: formData.duration,
                    price: formData.price,
                    category: formData.category,
                    thumbnail_url: thumbnail_url,
                    is_featured: formData.is_featured
                }]);

            if (error) throw error;

            success('Program added successfully!');
            setFormData({
                title: '',
                description: '',
                duration: '',
                price: '',
                category: 'technical',
                thumbnail_url: '',
                is_featured: false
            });
            setThumbnailFile(null);
            fetchPrograms();
        } catch (error) {
            console.error('Error adding program:', error);
            alert(`ERROR DETAILS:\nMessage: ${error.message}\nCode: ${error.code}\nDetails: ${error.details}\nHint: ${error.hint}`);
            showError('Failed to add program: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this program?')) {
            try {
                const { error } = await supabase
                    .from('programs')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                success('Program deleted');
                fetchPrograms();
            } catch (error) {
                console.error('Error deleting program:', error);
                showError('Failed to delete program');
            }
        }
    };

    const toggleFeatured = async (program) => {
        try {
            const { error } = await supabase
                .from('programs')
                .update({ is_featured: !program.is_featured })
                .eq('id', program.id);

            if (error) throw error;

            success(`Program ${!program.is_featured ? 'added to Home Page' : 'removed from Home Page'}`);
            fetchPrograms();
        } catch (error) {
            console.error('Error updating program:', error);
            showError('Failed to update program');
        }
    };

    const filteredPrograms = filter === 'all'
        ? programs
        : programs.filter(p => p.category === filter);

    if (authLoading) {
        return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
    }

    return (
        <div className="programs-detail-page">
            {toasts.map(toast => (
                <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
            ))}

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

            {/* Admin Section */}
            {isAdmin && (
                <section className="section">
                    <div className="container">
                        <div className="admin-panel card">
                            <h3>👑 Admin: Add New Program</h3>
                            <form onSubmit={handleSubmit} className="admin-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Program Title</label>
                                        <input
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. Full Stack Development"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Price</label>
                                        <input
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. ₹20,000"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Duration</label>
                                        <input
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. 6 Months"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select name="category" value={formData.category} onChange={handleChange}>
                                            <option value="technical">Technical</option>
                                            <option value="non-technical">Non-Technical</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Thumbnail Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        {thumbnailFile && (
                                            <small className="text-muted">Selected: {thumbnailFile.name}</small>
                                        )}
                                    </div>
                                    <div className="form-group checkbox-group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="is_featured"
                                                checked={formData.is_featured}
                                                onChange={handleChange}
                                            />
                                            Feature on Home Page
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        placeholder="Describe the program..."
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={uploading}>
                                    {uploading ? 'Uploading...' : 'Add Program'}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            )}

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
                    {loading ? (
                        <p className="text-center">Loading programs...</p>
                    ) : filteredPrograms.length === 0 ? (
                        <p className="text-center text-muted">No programs found.</p>
                    ) : (
                        <div className="programs-detail-grid">
                            {filteredPrograms.map((program) => (
                                <div className="program-detail-card card" key={program.id}>
                                    <div className="program-thumbnail">
                                        <img
                                            src={program.thumbnail_url || 'https://via.placeholder.com/300x200?text=No+Image'}
                                            alt={program.title}
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                                        />
                                        {program.is_featured && <span className="featured-badge">Featured</span>}
                                        <span className="category-badge">{program.category}</span>
                                    </div>
                                    <div className="program-content">
                                        <h3>{program.title}</h3>
                                        <p className="program-description">{program.description}</p>
                                        <div className="program-meta">
                                            <span>⏱ {program.duration}</span>
                                            <span>💰 {program.price}</span>
                                        </div>
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => navigate(`/programs/${program.id}`)}
                                        >
                                            View Details
                                        </button>
                                        {isAdmin && (
                                            <div className="admin-controls">
                                                <button
                                                    className={`btn btn-sm ${program.is_featured ? 'btn-warning' : 'btn-success'}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFeatured(program);
                                                    }}
                                                >
                                                    {program.is_featured ? 'Remove from Home' : 'Add to Home'}
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(program.id);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ProgramsDetail;
