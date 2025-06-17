// frontend/src/components/ProjectsEdit.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "./Navbar";
import { useAuth } from '../contexts/AuthContext';
import "../styles/glass-theme.css";

const ProjectsEdit = () => {
  const [formData, setFormData] = useState({
    subject: '',
    budget: '',
    description: '',
    priority: 'MEDIUM',
    projectTitle: '',
    deadline: '',
    ticketStatus: 'OPEN'
  });
  const [originalTicket, setOriginalTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/project-tickets/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project ticket');
      }

      const ticket = await response.json();
      setOriginalTicket(ticket);

      // Check if user can edit this ticket
      if (user?.role?.roleName === 'client' && ticket.clientId !== user.userId) {
        throw new Error('You can only edit your own tickets');
      }

      // Format deadline for datetime-local input
      const formattedDeadline = ticket.deadline 
        ? new Date(ticket.deadline).toISOString().slice(0, 16)
        : '';

      setFormData({
        subject: ticket.subject || '',
        budget: ticket.budget || '',
        description: ticket.description || '',
        priority: ticket.priority || 'MEDIUM',
        projectTitle: ticket.projectTitle || '',
        deadline: formattedDeadline,
        ticketStatus: ticket.ticketStatus || 'OPEN'
      });
    } catch (error) {
      console.error('Error fetching project ticket:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      // Validation
      if (!formData.subject || !formData.budget || !formData.description || !formData.projectTitle) {
        throw new Error('Please fill in all required fields');
      }

      if (parseFloat(formData.budget) <= 0) {
        throw new Error('Budget must be greater than 0');
      }

      // Check business rules for client
      if (user?.role?.roleName === 'client') {
        if (formData.ticketStatus === 'OPEN' && originalTicket.projectStatus === 'IN_PROGRESS') {
          throw new Error('Cannot change ticket status to OPEN when project is in progress');
        }
      }

      const token = localStorage.getItem('token');
      const updateData = {
        ...formData,
        budget: parseFloat(formData.budget),
        deadline: formData.deadline || null
      };

      // Set resolvedAt if changing to RESOLVED
      if (formData.ticketStatus === 'RESOLVED' && originalTicket.ticketStatus !== 'RESOLVED') {
        updateData.resolvedAt = new Date().toISOString();
      }

      const response = await fetch(`http://localhost:5000/project-tickets/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update project ticket');
      }

      // Success - redirect to projects list
      navigate('/projects');
    } catch (error) {
      console.error('Error updating project ticket:', error);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Check permissions
  const canEdit = () => {
    if (!originalTicket) return false;
    if (user?.role?.roleName === 'admin') return true;
    if (user?.role?.roleName === 'client' && originalTicket.clientId === user.userId) return true;
    return false;
  };

  const getAvailableTicketStatuses = () => {
    if (user?.role?.roleName === 'client') {
      // Client can change to any status except when project is IN_PROGRESS and trying to set OPEN
      if (originalTicket?.projectStatus === 'IN_PROGRESS') {
        return ['IN_PROGRESS', 'RESOLVED', 'CLOSED'].filter(status => 
          status !== 'OPEN'
        );
      }
      return ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    }
    return ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  };

  if (isLoading) {
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
                <div className="has-text-centered">
                  <div className="is-size-1 mb-4">
                    <i className="fas fa-spinner fa-spin has-text-primary"></i>
                  </div>
                  <p className="title is-5 text-glass">Loading Ticket...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!canEdit()) {
    return (
      <>
        <Navbar />
        <div className="section gradient-background" style={{ minHeight: '100vh' }}>
          <div className="content-wrapper">
            <div className="section">
              <div className="container">
                <div className="notification is-danger">
                  <h1 className="title">Access Denied</h1>
                  <p>You don't have permission to edit this ticket.</p>
                  <button className="button is-light mt-3" onClick={() => navigate('/projects')}>
                    Back to Projects
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

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
                          <i className="fas fa-edit mr-3"></i>
                          Edit Project Ticket #{id}
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

                  {/* Current Status Info */}
                  {originalTicket && (
                    <div className="bg-glass mb-5" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                      <h4 className="title is-6 text-glass mb-3">
                        <i className="fas fa-info-circle mr-2"></i>
                        Current Status
                      </h4>
                      <div className="columns">
                        <div className="column">
                          <p className="text-glass">
                            <strong>Ticket Status:</strong> 
                            <span className={`tag ml-2 ${
                              originalTicket.ticketStatus === 'OPEN' ? 'is-success' :
                              originalTicket.ticketStatus === 'IN_PROGRESS' ? 'is-info' :
                              originalTicket.ticketStatus === 'RESOLVED' ? 'is-warning' :
                              'is-dark'
                            }`}>
                              {originalTicket.ticketStatus}
                            </span>
                          </p>
                        </div>
                        <div className="column">
                          <p className="text-glass">
                            <strong>Project Status:</strong> 
                            <span className={`tag ml-2 ${
                              originalTicket.projectStatus === 'PENDING' ? 'is-warning' :
                              originalTicket.projectStatus === 'IN_PROGRESS' ? 'is-info' :
                              originalTicket.projectStatus === 'REVIEW' ? 'is-link' :
                              'is-success'
                            }`}>
                              {originalTicket.projectStatus}
                            </span>
                          </p>
                        </div>
                        {originalTicket.editor && (
                          <div className="column">
                            <p className="text-glass">
                              <strong>Assigned Editor:</strong> {originalTicket.editor.fullName}
                            </p>
                          </div>
                        )}
                      </div>
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
                        <div className="column is-4">
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

                        <div className="column is-4">
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

                        <div className="column is-4">
                          <div className="field">
                            <label className="label text-glass">Ticket Status</label>
                            <div className="control has-icons-left">
                              <div className="select is-fullwidth">
                                <select
                                  name="ticketStatus"
                                  value={formData.ticketStatus}
                                  onChange={handleInputChange}
                                >
                                  {getAvailableTicketStatuses().map(status => (
                                    <option key={status} value={status}>
                                      {status.replace('_', ' ')}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <span className="icon is-small is-left">
                                <i className="fas fa-flag"></i>
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
                                disabled={isSaving}
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
                                className={`button is-primary ${isSaving ? 'is-loading' : ''}`}
                                disabled={isSaving}
                              >
                                <span className="icon">
                                  <i className="fas fa-save"></i>
                                </span>
                                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Business Rules Info */}
                  {user?.role?.roleName === 'client' && (
                    <div className="bg-glass mt-5" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                      <h4 className="title is-6 text-glass">
                        <i className="fas fa-info-circle mr-2"></i>
                        Important Notes
                      </h4>
                      <div className="content text-glass">
                        <ul>
                          <li>You can edit most fields while your ticket is in <strong>PENDING</strong> status</li>
                          <li>Once an editor takes your project (<strong>IN_PROGRESS</strong>), you cannot change ticket status to <strong>OPEN</strong></li>
                          <li>You can mark your ticket as <strong>RESOLVED</strong> when you're satisfied with the work</li>
                          <li>Changing ticket status to <strong>RESOLVED</strong> will automatically set the resolved date</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsEdit;