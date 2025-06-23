// frontend/src/components/ProjectsEdit.jsx - COMPLETE VERSION
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

      const token = localStorage.getItem('token');
      
      // Prepare update data based on what client can actually change
      let updateData = {};
      
      if (user?.role?.roleName === 'client') {
        // If ticket status is OPEN, client can edit basic fields
        if (originalTicket.ticketStatus === 'OPEN') {
          updateData = {
            subject: formData.subject,
            budget: parseFloat(formData.budget),
            description: formData.description,
            priority: formData.priority,
            projectTitle: formData.projectTitle,
            deadline: formData.deadline || null
          };
        }
        
        // If project is in REVIEW and ticket is IN_PROGRESS, client can change ticket status to RESOLVED
        if (canChangeTicketStatus() && formData.ticketStatus !== originalTicket.ticketStatus) {
          updateData.ticketStatus = formData.ticketStatus;
        }
      }

      console.log('Sending update data:', updateData);

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

      const result = await response.json();
      console.log('Update successful:', result);

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
    
    // Nobody can edit if ticket is in final state
    const isFinalState = originalTicket.projectStatus === 'COMPLETED' || originalTicket.ticketStatus === 'CLOSED';
    if (isFinalState) return false;
    
    if (user?.role?.roleName === 'admin') return true;
    
    if (user?.role?.roleName === 'client' && originalTicket.clientId === user.userId) {
      // Client can edit when ticket is OPEN or when project is REVIEW (but only ticket status)
      return originalTicket.ticketStatus === 'OPEN' || 
             (originalTicket.projectStatus === 'REVIEW');
    }
    
    return false;
  };

  const getAvailableTicketStatuses = () => {
    if (!originalTicket) return [];
    
    if (user?.role?.roleName === 'client') {
      // Client can only change to RESOLVED when project is in REVIEW and ticket is IN_PROGRESS
      if (originalTicket.projectStatus === 'REVIEW' && originalTicket.ticketStatus === 'IN_PROGRESS') {
        return ['IN_PROGRESS', 'RESOLVED'];
      }
      // Otherwise, client cannot change ticket status
      return [originalTicket.ticketStatus];
    }
    
    return [originalTicket.ticketStatus]; // Default: cannot change
  };

  const getEditableFields = () => {
    if (!originalTicket) return [];
    
    if (user?.role?.roleName === 'client') {
      // Client can edit basic fields ONLY when ticket status is OPEN
      if (originalTicket.ticketStatus === 'OPEN') {
        return ['subject', 'budget', 'description', 'priority', 'projectTitle', 'deadline'];
      }
      // When ticket status is not OPEN, client can only change ticket status (and only to RESOLVED when in REVIEW)
      return [];
    }
    
    return [];
  };

  const isFieldEditable = (fieldName) => {
    const editableFields = getEditableFields();
    return editableFields.includes(fieldName);
  };

  const canChangeTicketStatus = () => {
    if (!originalTicket) return false;
    
    if (user?.role?.roleName === 'client') {
      // Client can change ticket status to RESOLVED when project is REVIEW and ticket is IN_PROGRESS
      return originalTicket.projectStatus === 'REVIEW' && originalTicket.ticketStatus === 'IN_PROGRESS';
    }
    
    return false;
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
                  <p className="title is-5 text-glass">Loading Project...</p>
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
                  <div className="column is-6">
                    <div className="box has-text-centered" style={{ padding: '3rem', borderRadius: '15px' }}>
                      <div className="is-size-1 mb-4 has-text-warning">
                        <i className="fas fa-lock"></i>
                      </div>
                      <h2 className="title is-4 text-glass">Cannot Edit This Ticket</h2>
                      <p className="text-glass mb-4">
                        This ticket cannot be edited in its current state or you don't have permission to edit it.
                      </p>
                      <button 
                        className="button is-primary"
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
                          Edit Project Ticket
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

                  {error && (
                    <div className="notification is-danger">
                      <button 
                        className="delete" 
                        onClick={() => setError("")}
                      ></button>
                      {error}
                    </div>
                  )}

                  {/* Current Status Info */}
                  {originalTicket && (
                    <div className="bg-glass mb-5" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                      <h3 className="title is-6 text-glass mb-3">Current Status</h3>
                      <div className="columns">
                        <div className="column">
                          <p className="text-glass">
                            <strong>Ticket Status:</strong>
                            <span className={`tag ml-2 ${
                              originalTicket.ticketStatus === 'OPEN' ? 'is-success' :
                              originalTicket.ticketStatus === 'IN_PROGRESS' ? 'is-info' :
                              originalTicket.ticketStatus === 'RESOLVED' ? 'has-background-primary-50 has-text-primary-50-invert' :
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
                                disabled={!isFieldEditable('projectTitle')}
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
                                disabled={!isFieldEditable('subject')}
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
                                disabled={!isFieldEditable('budget')}
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
                                  disabled={!isFieldEditable('priority')}
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
                                  disabled={!canChangeTicketStatus()}
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
                            {!canChangeTicketStatus() && (
                              <p className="help text-glass">
                                Ticket status cannot be changed in current state
                              </p>
                            )}
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
                                disabled={!isFieldEditable('deadline')}
                                style={{
                                  color: 'white',
                                  backgroundColor: '#14161a', // Background hitam seperti input lainnya
                                  borderColor: '#dbdbdb'
                                }}
                              />
                              <span className="icon is-small is-left" style={{ color: '#ffffff' }}>
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
                                style={{ color: "white" }}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Detailed description of your project requirements..."
                                rows="6"
                                disabled={!isFieldEditable('description')}
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

                  {/* Info Box */}
                  <div className="bg-glass mt-5" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                    <h4 className="title is-6 text-glass">
                      <i className="fas fa-info-circle mr-2"></i>
                      Edit Permissions
                    </h4>
                    <div className="content text-glass">
                      {user?.role?.roleName === 'client' && (
                        <div>
                          <p><strong>As a Client:</strong></p>
                          <ul>
                            <li>You can edit project details when ticket status is <strong>OPEN</strong></li>
                            <li>You can mark ticket as <strong>RESOLVED</strong> when project is in <strong>REVIEW</strong> status</li>
                            <li>Once ticket is <strong>CLOSED</strong> or project is <strong>COMPLETED</strong>, no further edits are allowed</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS untuk calendar icon */}
        <style jsx>{`
          input[type="datetime-local"]::-webkit-calendar-picker-indicator {
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3e%3cpath fill='%23ffffff' d='M6 2a1 1 0 0 0-1 1v1H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1zM3 8h14v8H3V8z'/%3e%3c/svg%3e") !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            background-size: 16px 16px !important;
            cursor: pointer !important;
            opacity: 1 !important;
            filter: none !important;
          }
          
          input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3e%3cpath fill='%23ffdd57' d='M6 2a1 1 0 0 0-1 1v1H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1zM3 8h14v8H3V8z'/%3e%3c/svg%3e") !important;
            transform: scale(1.1) !important;
          }

          input[type="datetime-local"]:disabled::-webkit-calendar-picker-indicator {
            opacity: 0.5 !important;
            cursor: not-allowed !important;
          }
        `}</style>
      </div>
    </>
  );
};

export default ProjectsEdit;