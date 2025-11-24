import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAdmin } from '../hooks/useAdmin';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import './TaskHub.css';

const TaskHub = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAdmin();
    const { toasts, success, error: showError, removeToast } = useToast();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        coins: '',
        difficulty: 'Medium',
        skills_required: '',
        deadline: ''
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTasks(data || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
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
                .from('tasks')
                .insert([{ ...formData }]);

            if (error) throw error;

            success('Task posted successfully!');
            setFormData({
                title: '',
                description: '',
                coins: '',
                difficulty: 'Medium',
                skills_required: '',
                deadline: ''
            });
            fetchTasks();
        } catch (error) {
            console.error('Error posting task:', error);
            showError('Failed to post task');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this task?')) {
            try {
                const { error } = await supabase
                    .from('tasks')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                success('Task deleted');
                fetchTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
                showError('Failed to delete task');
            }
        }
    };

    return (
        <div className="taskhub-container section">
            {toasts.map(toast => (
                <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
            ))}

            <div className="container">
                <div className="taskhub-header">
                    <h1 className="text-gradient">TaskHub</h1>
                    <p className="section-description">
                        Complete tasks, earn rewards, and build your portfolio.
                    </p>
                </div>

                {isAdmin && (
                    <div className="admin-panel card fade-in-up">
                        <h3>Post a New Task</h3>
                        <form onSubmit={handleSubmit} className="task-form">
                            <div className="form-group">
                                <label>Job Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. React Frontend Developer"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Brief description of the task..."
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Required Skills</label>
                                    <input
                                        type="text"
                                        name="skills_required"
                                        value={formData.skills_required}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. React, Node.js, CSS"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Coins/Reward</label>
                                    <input
                                        type="number"
                                        name="coins"
                                        value={formData.coins}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. 500"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Difficulty</label>
                                    <select name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
                                        <option>Easy</option>
                                        <option>Medium</option>
                                        <option>Hard</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Post Task</button>
                        </form>
                    </div>
                )}

                <div className="tasks-grid">
                    {loading ? (
                        <p className="text-center">Loading tasks...</p>
                    ) : tasks.length === 0 ? (
                        <div className="no-tasks text-center">
                            <p>No tasks available at the moment.</p>
                            {isAdmin && <p>Use the form above to post the first task!</p>}
                        </div>
                    ) : (
                        tasks.map(task => (
                            <div className="task-card card" key={task.id}>
                                <div className="task-header">
                                    <h3 className="task-title">{task.title}</h3>
                                    <span className="task-earnings">🪙 {task.coins}</span>
                                </div>
                                <p className="task-desc">{task.description}</p>
                                <div className="task-meta">
                                    <strong>Skills:</strong> {task.skills_required}
                                    <span className={`badge ${task.difficulty.toLowerCase()}`}>{task.difficulty}</span>
                                </div>
                                <div className="task-actions">
                                    <button className="btn btn-primary btn-sm">Apply Now</button>
                                    {isAdmin && (
                                        <button
                                            className="btn btn-secondary btn-sm delete-btn"
                                            onClick={() => handleDelete(task.id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskHub;
