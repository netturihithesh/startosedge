import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { useAdmin } from '../hooks/useAdmin';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { useNavigate } from 'react-router-dom';
import './ProgramsDetail.css';
import '../components/Modal.css';

const ProgramsDetail = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [programs, setPrograms] = useState([]);
    const { isAdmin } = useAdmin();
    const { toasts, success, error: showError, removeToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [enrolledPrograms, setEnrolledPrograms] = useState([]);
    const [userProfile, setUserProfile] = useState(null);

    // Grant Access State
    const [grantEmail, setGrantEmail] = useState('');
    const [grantProgramId, setGrantProgramId] = useState('');

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
    const [showAddModal, setShowAddModal] = useState(false);
    const [showGrantModal, setShowGrantModal] = useState(false);

    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                showError('Please log in to view programs.');
                navigate('/login');
            } else {
                // Fetch user profile and enrollments
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUserProfile(data);
                        setEnrolledPrograms(data.enrolled_programs || []);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
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
            if (!file.type.startsWith('image/')) {
                showError('Please select an image file');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                showError('Image size should be less than 2MB');
                return;
            }
            setThumbnailFile(file);
        }
    };

    const uploadThumbnail = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { data, error } = await supabase.storage
            .from('course-videos')
            .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (error) throw new Error('Image upload failed: ' + error.message);

        const { data: { publicUrl } } = supabase.storage
            .from('course-videos')
            .getPublicUrl(fileName);
        return publicUrl;
    };

    const [editingProgram, setEditingProgram] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let thumbnail_url = formData.thumbnail_url;
            if (thumbnailFile) {
                thumbnail_url = await uploadThumbnail(thumbnailFile);
            }

            if (editingProgram) {
                // Update existing program
                const { error } = await supabase
                    .from('programs')
                    .update({
                        title: formData.title,
                        description: formData.description,
                        duration: formData.duration,
                        price: formData.price,
                        category: formData.category,
                        thumbnail_url: thumbnail_url,
                        is_featured: formData.is_featured
                    })
                    .eq('id', editingProgram.id);

                if (error) throw error;
                success('Program updated successfully!');
            } else {
                // Insert new program
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
            }

            // Reset form
            setFormData({
                title: '', description: '', duration: '', price: '',
                category: 'technical', thumbnail_url: '', is_featured: false
            });
            setThumbnailFile(null);
            setEditingProgram(null);
            setShowAddModal(false);
            fetchPrograms();
        } catch (error) {
            console.error('Error saving program:', error);
            showError('Failed to save program: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleEditClick = (program) => {
        setEditingProgram(program);
        setFormData({
            title: program.title,
            description: program.description,
            duration: program.duration,
            price: program.price,
            category: program.category,
            thumbnail_url: program.thumbnail_url,
            is_featured: program.is_featured
        });
        // Scroll to form
        // window.scrollTo({ top: 0, behavior: 'smooth' });
        setShowAddModal(true);
    };

    const handleCancelEdit = () => {
        setEditingProgram(null);
        setFormData({
            title: '', description: '', duration: '', price: '',
            category: 'technical', thumbnail_url: '', is_featured: false
        });
        setThumbnailFile(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('⚠️ WARNING: This will PERMANENTLY delete the program, its thumbnail, and ALL associated videos from both the database and storage.\n\nAre you sure you want to proceed?')) {
            try {
                // Show loading indicator
                const btn = document.activeElement;
                if (btn) {
                    btn.disabled = true;
                    btn.innerText = 'Deleting...';
                }

                // 1. Fetch Program Details (for thumbnail)
                const { data: program } = await supabase.from('programs').select('thumbnail_url').eq('id', id).single();

                // 2. Fetch Associated Videos (for video files)
                const { data: videos } = await supabase.from('program_videos').select('video_url').eq('program_id', id);

                // 3. Delete Thumbnail from Storage
                if (program?.thumbnail_url && program.thumbnail_url.includes('course-videos/')) {
                    const path = program.thumbnail_url.split('course-videos/').pop();
                    if (path) {
                        const { error: storageError } = await supabase.storage.from('course-videos').remove([path]);
                        if (storageError) console.warn('Failed to delete thumbnail:', storageError);
                    }
                }

                // 4. Delete Video Files from Storage
                if (videos && videos.length > 0) {
                    const videoPaths = videos.map(v => {
                        if (!v.video_url || !v.video_url.includes('course-videos/')) return null;
                        return v.video_url.split('course-videos/').pop();
                    }).filter(Boolean);

                    if (videoPaths.length > 0) {
                        const { error: videoStorageError } = await supabase.storage.from('course-videos').remove(videoPaths);
                        if (videoStorageError) console.warn('Failed to delete videos:', videoStorageError);
                    }
                }

                // 5. Delete Program from DB
                const { error } = await supabase.from('programs').delete().eq('id', id);
                if (error) throw error;

                success('Program and all associated files deleted successfully!');
                fetchPrograms();
            } catch (error) {
                console.error('Error deleting program:', error);
                showError('Failed to delete program: ' + error.message);
                // Re-enable button if failed
                const btn = document.activeElement;
                if (btn) {
                    btn.disabled = false;
                    btn.innerText = 'Delete';
                }
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

    const handleGrantAccess = async (e) => {
        e.preventDefault();
        if (!grantEmail || !grantProgramId) {
            showError("Please enter email and select a program.");
            return;
        }

        try {
            const q = query(collection(db, 'users'), where('email', '==', grantEmail));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                showError('User not found! Ask them to sign up first.');
                return;
            }

            const userDoc = querySnapshot.docs[0];
            await updateDoc(userDoc.ref, {
                enrolled_programs: arrayUnion(grantProgramId)
            });

            success(`✅ Access granted to ${grantEmail}!`);
            setGrantEmail('');
            setGrantProgramId('');
            setShowGrantModal(false);

            // Refresh local state if the admin is granting access to themselves (edge case)
            if (grantEmail === userProfile.email) {
                setEnrolledPrograms(prev => [...prev, grantProgramId]);
            }

        } catch (error) {
            console.error("Error granting access:", error);
            showError("Failed to grant access: " + error.message);
        }
    };

    const handleBuyRequest = async (program) => {
        if (!userProfile) {
            showError("Please update your profile first (Name & Phone required).");
            navigate('/profile');
            return;
        }

        if (!userProfile.phone) {
            showError("Phone number is required for purchase. Please update your profile.");
            navigate('/profile');
            return;
        }

        if (!window.confirm(`Confirm purchase request for "${program.title}"? Admin will contact you at ${userProfile.phone}.`)) {
            return;
        }

        const btnId = `buy-btn-${program.id}`;
        const btn = document.getElementById(btnId);
        const originalText = btn ? btn.innerText : "🛒 Buy Now";

        if (btn) {
            btn.innerText = "⏳ Sending...";
            btn.disabled = true;
        }

        // REPLACE THIS WITH YOUR DEPLOYED GOOGLE APPS SCRIPT URL
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx3jlCg-oOWDhDaP258SUUDrtbqC6h1kf4WQXqf7s-K-ROj4ZH-hioneCoHfWudMJhT/exec";

        try {
            const params = new URLSearchParams();
            params.append("name", userProfile.name);
            params.append("email", userProfile.email);
            params.append("phone", userProfile.phone);
            params.append("course", program.title);
            params.append("timestamp", new Date().toLocaleString());

            // Send data to Google Sheets
            await fetch(SCRIPT_URL, {
                method: "POST",
                body: params,
                mode: "no-cors",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            success("Request sent successfully! Admin will verify and grant access shortly.");
        } catch (error) {
            console.error("Error sending request:", error);
            showError("Failed to send request. Please try again or contact support.");
        } finally {
            if (btn) {
                btn.innerText = "✅ Request Sent";
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, 3000);
            }
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
                        <h1 className="fade-in-up">All Career <span className="text-gradient">Programs</span></h1>
                        <p className="hero-description fade-in-up">
                            Choose your path to a successful tech career. Every program is designed to make you industry-ready.
                        </p>
                    </div>
                </div>
            </section>

            {/* Admin Controls Buttons */}
            {isAdmin && (
                <section className="section pb-0">
                    <div className="container">
                        <div className="admin-controls-bar" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn btn-primary" onClick={() => { handleCancelEdit(); setShowAddModal(true); }}>
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '8px' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Add New Program
                            </button>
                            <button className="btn btn-success" onClick={() => setShowGrantModal(true)}>
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '8px' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                                Grant Access
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* Add/Edit Program Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content" style={{ maxWidth: '800px', width: '90%' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingProgram ? 'Edit Program' : 'Add New Program'}</h3>
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit} className="admin-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Program Title</label>
                                        <input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Full Stack Development" />
                                    </div>
                                    <div className="form-group">
                                        <label>Price</label>
                                        <input name="price" value={formData.price} onChange={handleChange} required placeholder="e.g. ₹20,000" />
                                    </div>
                                    <div className="form-group">
                                        <label>Duration</label>
                                        <input name="duration" value={formData.duration} onChange={handleChange} required placeholder="e.g. 6 Months" />
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
                                        <input type="file" accept="image/*" onChange={handleFileChange} />
                                        {thumbnailFile && <small className="text-muted">Selected: {thumbnailFile.name}</small>}
                                        {!thumbnailFile && formData.thumbnail_url && <small className="text-muted">Current: <a href={formData.thumbnail_url} target="_blank" rel="noreferrer">View Image</a></small>}
                                    </div>
                                    <div className="form-group checkbox-group">
                                        <label>
                                            <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} />
                                            Feature on Home Page
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" placeholder="Describe the program..."></textarea>
                                </div>
                                <div className="admin-form-actions" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={uploading}>
                                        {uploading ? 'Saving...' : (editingProgram ? 'Update Program' : 'Add Program')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Grant Access Modal */}
            {showGrantModal && (
                <div className="modal-overlay" onClick={() => setShowGrantModal(false)}>
                    <div className="modal-content" style={{ maxWidth: '500px', width: '90%' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Grant Course Access</h3>
                            <button className="modal-close" onClick={() => setShowGrantModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p className="text-muted" style={{ marginBottom: '1rem' }}>
                                Enter the user's email to unlock the course for them.
                            </p>
                            <form onSubmit={handleGrantAccess} className="admin-form">
                                <div className="form-group">
                                    <label>User Email</label>
                                    <input
                                        type="email"
                                        value={grantEmail}
                                        onChange={(e) => setGrantEmail(e.target.value)}
                                        required
                                        placeholder="user@example.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Select Program</label>
                                    <select
                                        value={grantProgramId}
                                        onChange={(e) => setGrantProgramId(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Select Course --</option>
                                        {programs.map(p => (
                                            <option key={p.id} value={p.id}>{p.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="admin-form-actions" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowGrantModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-success">
                                        Grant Access
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Bar */}
            <section className="filter-section section">
                <div className="container">
                    <div className="filter-buttons">
                        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                        <button className={`filter-btn ${filter === 'technical' ? 'active' : ''}`} onClick={() => setFilter('technical')}>Technical</button>
                        <button className={`filter-btn ${filter === 'non-technical' ? 'active' : ''}`} onClick={() => setFilter('non-technical')}>Non-Technical</button>
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
                            {filteredPrograms.map((program) => {
                                const isEnrolled = enrolledPrograms.includes(program.id) || isAdmin;
                                return (
                                    <div className={`program-detail-card card ${isAdmin ? 'admin-mode' : ''}`} key={program.id}>
                                        <div className="program-thumbnail">
                                            <img
                                                src={program.thumbnail_url || 'https://via.placeholder.com/300x200?text=No+Image'}
                                                alt={program.title}
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                                            />
                                            {program.is_featured && <span className="featured-badge">Featured</span>}
                                            <span className="category-badge">{program.category}</span>

                                            {isAdmin && (
                                                <button
                                                    className="edit-btn-pencil"
                                                    title="Edit Program"
                                                    onClick={(e) => { e.stopPropagation(); handleEditClick(program); }}
                                                >
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                            )}
                                        </div>
                                        <div className="program-content">
                                            <h3>{program.title}</h3>
                                            <p className="program-description">{program.description}</p>
                                            <div className="program-meta">
                                                <span>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <polyline points="12 6 12 12 16 14"></polyline>
                                                    </svg>
                                                    {program.duration}
                                                </span>
                                                <span>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                                                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                                                        <line x1="7" y1="7" x2="7.01" y2="7"></line>
                                                    </svg>
                                                    {program.price}
                                                </span>
                                            </div>

                                            {isEnrolled ? (
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => navigate(`/programs/${program.id}`)}
                                                >
                                                    Access Course
                                                </button>
                                            ) : (
                                                <button
                                                    id={`buy-btn-${program.id}`}
                                                    className="btn btn-primary"
                                                    onClick={() => handleBuyRequest(program)}
                                                >
                                                    Buy Now
                                                </button>
                                            )}

                                            {isAdmin && (
                                                <div className="admin-controls">
                                                    <button
                                                        className={`btn btn-sm ${program.is_featured ? 'btn-warning' : 'btn-success'}`}
                                                        onClick={(e) => { e.stopPropagation(); toggleFeatured(program); }}
                                                    >
                                                        {program.is_featured ? 'Un-Feature' : 'Feature'}
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(program.id); }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ProgramsDetail;
