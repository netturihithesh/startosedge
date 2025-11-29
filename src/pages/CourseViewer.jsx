import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAdmin } from '../hooks/useAdmin';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import './CourseViewer.css';

const CourseViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin } = useAdmin();
    const { toasts, success, error: showError, removeToast } = useToast();

    const [course, setCourse] = useState(null);
    const [videos, setVideos] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Admin Form State
    const [videoForm, setVideoForm] = useState({
        title: '',
        description: ''
    });
    const [videoFile, setVideoFile] = useState(null);

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            // Fetch Course Details
            const { data: courseData, error: courseError } = await supabase
                .from('programs')
                .select('*')
                .eq('id', id)
                .single();

            if (courseError || !courseData) {
                showError('Course not found');
                navigate('/programs');
                return;
            }
            setCourse(courseData);

            // Fetch Videos
            const { data: videoList, error: videoError } = await supabase
                .from('program_videos')
                .select('*')
                .eq('program_id', id)
                .order('created_at', { ascending: true });

            if (videoError) throw videoError;

            setVideos(videoList || []);
            if (videoList && videoList.length > 0) {
                setCurrentVideo(videoList[0]);
            }
        } catch (error) {
            console.error('Error loading course:', error);
            showError('Error loading course content');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('video/')) {
                showError('Please select a valid video file');
                return;
            }
            // Limit size if needed (e.g., 50MB for demo)
            if (file.size > 50 * 1024 * 1024) {
                showError('Video size must be less than 50MB');
                return;
            }
            setVideoFile(file);
        }
    };

    const uploadVideoFile = async (file) => {
        const fileExt = file.name.split('.').pop();
        // Create a unique path: videos/program_id/timestamp_random.ext
        const fileName = `videos/${id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        console.log('Uploading video:', fileName);

        const { data, error } = await supabase.storage
            .from('course-videos')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('course-videos')
            .getPublicUrl(fileName);

        return publicUrl;
    };

    const handleAddVideo = async (e) => {
        e.preventDefault();
        if (!videoFile) {
            showError('Please select a video file to upload');
            return;
        }

        setUploading(true);
        try {
            const videoUrl = await uploadVideoFile(videoFile);

            const { error } = await supabase
                .from('program_videos')
                .insert([{
                    program_id: id,
                    title: videoForm.title,
                    description: videoForm.description,
                    video_url: videoUrl
                }]);

            if (error) throw error;

            success('Video uploaded successfully!');
            setVideoForm({ title: '', description: '' });
            setVideoFile(null);
            // Reset file input
            document.getElementById('video-upload-input').value = '';
            fetchCourseData();
        } catch (error) {
            console.error('Error adding video:', error);
            showError('Failed to add video: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteVideo = async (videoId) => {
        if (window.confirm('Delete this video?')) {
            try {
                const { error } = await supabase
                    .from('program_videos')
                    .delete()
                    .eq('id', videoId);

                if (error) throw error;

                success('Video deleted');
                fetchCourseData();
            } catch (error) {
                console.error('Error deleting video:', error);
                showError('Failed to delete video');
            }
        }
    };

    const [videoBlobUrl, setVideoBlobUrl] = useState(null);
    const [videoLoading, setVideoLoading] = useState(false);

    useEffect(() => {
        if (currentVideo?.video_url) {
            loadSecureVideo(currentVideo.video_url);
        }
        return () => {
            // Cleanup blob URL to free memory
            if (videoBlobUrl) {
                URL.revokeObjectURL(videoBlobUrl);
            }
        };
    }, [currentVideo]);

    const loadSecureVideo = async (url) => {
        setVideoLoading(true);
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            setVideoBlobUrl(objectUrl);
        } catch (error) {
            console.error('Error loading secure video:', error);
            showError('Failed to load secure video');
        } finally {
            setVideoLoading(false);
        }
    };

    if (loading) return <div className="loading-screen">Loading Course...</div>;
    if (!course) return null;

    return (
        <div className="course-viewer-page">
            {toasts.map(toast => (
                <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
            ))}

            <div className="course-viewer-container">
                {/* Left Sidebar: Video List */}
                <div className="course-sidebar">
                    <div className="sidebar-header">
                        <button className="back-btn" onClick={() => navigate('/programs')}>← Back</button>
                        <h3>{course.title}</h3>
                    </div>
                    <div className="video-list">
                        {videos.length === 0 ? (
                            <p className="no-videos">No videos yet.</p>
                        ) : (
                            videos.map((video, index) => (
                                <div
                                    key={video.id}
                                    className={`video-item ${currentVideo?.id === video.id ? 'active' : ''}`}
                                    onClick={() => setCurrentVideo(video)}
                                >
                                    <span className="video-number">{index + 1}</span>
                                    <div className="video-info">
                                        <h4>{video.title}</h4>
                                        <span className="video-duration">Watch Now</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Content: Video Player */}
                <div className="course-main">
                    {currentVideo ? (
                        <div className="video-player-wrapper">
                            <div className="video-frame">
                                {videoLoading ? (
                                    <div className="video-loading-overlay">
                                        <div className="spinner"></div>
                                        <p>Securing Video Stream...</p>
                                    </div>
                                ) : (
                                    <video
                                        key={videoBlobUrl} // Key forces reload on change
                                        controls
                                        controlsList="nodownload"
                                        onContextMenu={e => e.preventDefault()}
                                        playsInline
                                        className="html5-video-player"
                                        src={videoBlobUrl}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>
                            <div className="video-details">
                                <h2>{currentVideo.title}</h2>
                                <p className="video-description">{currentVideo.description}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <h2>Select a video to start learning</h2>
                            <p>Choose a topic from the sidebar.</p>
                        </div>
                    )}

                    {/* Admin: Add Video Form */}
                    {isAdmin && (
                        <div className="admin-video-panel card">
                            <h3>Upload New Video</h3>
                            <form onSubmit={handleAddVideo}>
                                <div className="form-group">
                                    <label>Video Title</label>
                                    <input
                                        value={videoForm.title}
                                        onChange={e => setVideoForm({ ...videoForm, title: e.target.value })}
                                        required
                                        placeholder="e.g. Introduction to React"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={videoForm.description}
                                        onChange={e => setVideoForm({ ...videoForm, description: e.target.value })}
                                        required
                                        placeholder="Briefly explain what this video covers..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Select Video File (Max 50MB)</label>
                                    <input
                                        id="video-upload-input"
                                        type="file"
                                        accept="video/*"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={uploading}>
                                    {uploading ? 'Uploading Video...' : 'Upload Video'}
                                </button>
                            </form>

                            {/* Delete Current Video Button */}
                            {currentVideo && (
                                <button
                                    className="btn btn-secondary mt-2"
                                    onClick={() => handleDeleteVideo(currentVideo.id)}
                                    style={{ marginTop: '1rem' }}
                                >
                                    Delete Current Video
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseViewer;
