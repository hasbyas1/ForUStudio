// frontend/src/components/ProjectsAdd.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import { useAuth } from '../contexts/AuthContext';
import "../styles/glass-theme.css";

const ProjectsAdd = () => {
  const [formData, setFormData] = useState({
    subject: '',
    budget: '',
    description: '',
    priority: 'MEDIUM',
    projectTitle: '',
    deadline: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not client
  if (user?.role?.roleName !== 'client') {
    return (
      <>
        <Navbar />
        <div className="section gradient-background" style={{ minHeight: '100vh' }}>
          <div className="content-wrapper">
            <div className="section">
              <div className="container">
                <div className="notification is-danger">
                  <h1 className="title">Access Denied</h1>
                  <p>Only clients can create new project tickets.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validation
      if (!formData.subject || !formData.budget || !formData.description || !formData.projectTitle) {
        throw new Error('Please fill in all required fields');
      }

      if (parseFloat(formData.budget) <= 0) {
        throw new Error('Budget must be greater than 0');
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/project-tickets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          budget: parseFloat(formData.budget),
          deadline: formData.deadline || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project ticket');
      }

      // Success - redirect to projects list
      navigate('/projects');
    } catch (error) {
      console.error('Error creating project ticket:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="section gradient-background" style={{ minHeight: '100vh' }}>
        <div className="radius-shape-1"></div>
        <div className="radius-shape-2"></div>
        <div className="radius-shape-3"></div>
        <div className="radius-shape-4"></div>
        <div className="radius-shape-5"></div>
        <div className="data-shape-1"></div>
        <div className="data-shape-2"></div>
        <div className="data-shape-3"></div>
        <div className="data-shape-4"></div>

        <div className="content-wrapper">
          <div className="section">
            <div className="container">
              <div className="columns is-centered">
                <div className="column is-8-desktop is-10-tablet">
                  {/* Header */}
                  <div className="level mb-5">
                    <div className="level-left">
                      <div className="level-item">
                        <h1 className="title text-glass">
                          <i className="fas fa-plus-circle mr-3"></i>
                          Create New Project Ticket
                        </h1>
                      </div>
                    </div>
                    <div className="level-right">
                      <div className="level-item">
                        <button 
                          className="button is-light"
                          onClick={() => navigate('/projects')}
                        >
                          <span className="icon">
                            <i className="fas fa-arrow-left"></i>
                          </span>
                          <span>Back to Projects</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="notification is-danger mb-5">
                      <button className="delete" onClick={() => setError("")}></button>
                      <i className="fas fa-exclamation-triangle mr-2"></i>
                      {error}
                    </div>
                  )}

                  {/* Form */}
                  <div className="bg-glass" style={{ padding: '2rem', borderRadius: '15px' }}>
                    <form onSubmit={handleSubmit}>
                      <div className="columns is-multiline">
                        {/* Project Title */}
                        <div className="column is-12">
                          <div className="field">
                            <label className="label text-glass">
                              Project Title <span className="has-text-danger">*</span>
                            </label>
                            <div className="control has-icons-left">
                              <input
                                className="input"
                                type="text"
                                name="projectTitle"
                                value={formData.projectTitle}
                                onChange={handleInputChange}
                                placeholder="Enter project title"
                                required
                              />
                              <span className="icon is-small is-left">
                                <i className="fas fa-project-diagram"></i>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Subject */}
                        <div className="column is-12">
                          <div className="field">
                            <label className="label text-glass">
                              Subject <span className="has-text-danger">*</span>
                            </label>
                            <div className="control has-icons-left">
                              <input
                                className="input"
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                placeholder="Brief description of the project"
                                required
                              />
                              <span className="icon is-small is-left">
                                <i className="fas fa-tag"></i>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Budget and Priority */}
                        <div className="column is-6">
                          <div className="field">
                            <label className="label text-glass">
                              Budget <span className="has-text-danger">*</span>
                            </label>
                            <div className="control has-icons-left">
                              <input
                                className="input"
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                              />
                              <span className="icon is-small is-left">
                                <i className="fas fa-dollar-sign"></i>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="column is-6">
                          <div className="field">
                            <label className="label text-glass">Priority</label>
                            <div className="control has-icons-left">
                              <div className="select is-fullwidth">
                                <select
                                  name="priority"
                                  value={formData.priority}
                                  onChange={handleInputChange}
                                >
                                  <option value="LOW">Low</option>
                                  <option value="MEDIUM">Medium</option>
                                  <option value="HIGH">High</option>
                                  <option value="URGENT">Urgent</option>
                                </select>
                              </div>
                              <span className="icon is-small is-left">
                                <i className="fas fa-exclamation-circle"></i>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Deadline */}
                        <div className="column is-12">
                          <div className="field">
                            <label className="label text-glass">Deadline (Optional)</label>
                            <div className="control has-icons-left">
                              <input
                                className="input"
                                type="datetime-local"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleInputChange}
                              />
                              <span className="icon is-small is-left">
                                <i className="fas fa-calendar-alt"></i>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="column is-12">
                          <div className="field">
                            <label className="label text-glass">
                              Description <span className="has-text-danger">*</span>
                            </label>
                            <div className="control">
                              <textarea
                                className="textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Detailed description of your project requirements..."
                                rows="6"
                                required
                              ></textarea>
                            </div>
                          </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="column is-12">
                          <div className="field is-grouped is-grouped-right">
                            <div className="control">
                              <button
                                type="button"
                                className="button is-light mr-3"
                                onClick={() => navigate('/projects')}
                                disabled={isLoading}
                              >
                                <span className="icon">
                                  <i className="fas fa-times"></i>
                                </span>
                                <span>Cancel</span>
                              </button>
                            </div>
                            <div className="control">
                              <button
                                type="submit"
                                className={`button is-success ${isLoading ? 'is-loading' : ''}`}
                                disabled={isLoading}
                              >
                                <span className="icon">
                                  <i className="fas fa-save"></i>
                                </span>
                                <span>{isLoading ? 'Creating...' : 'Create Ticket'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Info Box */}
                  <div className="bg-glass mt-5" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                    <h4 className="title is-6 text-glass">
                      <i className="fas fa-info-circle mr-2"></i>
                      What happens next?
                    </h4>
                    <div className="content text-glass">
                      <ol>
                        <li>Your ticket will be created with status <strong>"OPEN"</strong> and project status <strong>"PENDING"</strong></li>
                        <li>An editor will review and take your project, changing status to <strong>"IN_PROGRESS"</strong></li>
                        <li>You'll be able to track progress and communicate with the assigned editor</li>
                        <li>Once completed, you can mark the ticket as <strong>"RESOLVED"</strong></li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsAdd;