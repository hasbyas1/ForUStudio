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
                  <p>You can't edit this ticket while it's in progress or either you don't have permission to edit this ticket.</p>
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
                                style={{color:"white"}}
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

                  {/* Business Rules Info */}
                  {user?.role?.roleName === 'client' && (
                    <div className="bg-glass mt-5" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                      <h4 className="title is-6 text-glass">
                        <i className="fas fa-info-circle mr-2"></i>
                        Business Rules
                      </h4>
                      <div className="content text-glass">
                        <ul>
                          <li><strong>OPEN Status:</strong> You can edit all fields and delete the ticket</li>
                          <li><strong>IN_PROGRESS:</strong> You CANNOT edit any fields (editor is working)</li>
                          <li><strong>REVIEW Status:</strong> You can ONLY mark ticket as <strong>RESOLVED</strong> if satisfied</li>
                          <li><strong>COMPLETED/CLOSED:</strong> Ticket is final and cannot be modified</li>
                        </ul>
                        
                        {originalTicket && (
                          <div className="notification is-info is-light mt-3">
                            <strong>Current State:</strong>
                            <br />
                            Ticket Status: <span className="tag is-info">{originalTicket.ticketStatus}</span>
                            <br />
                            Project Status: <span className="tag is-info">{originalTicket.projectStatus}</span>
                            <br />
                            {originalTicket.projectStatus === 'COMPLETED' || originalTicket.ticketStatus === 'CLOSED' ? (
                              <span className="has-text-danger">🔒 This ticket is in final state and cannot be modified</span>
                            ) : originalTicket.ticketStatus === 'OPEN' ? (
                              <span className="has-text-success">✅ You can edit all fields and delete this ticket</span>
                            ) : originalTicket.projectStatus === 'REVIEW' && originalTicket.ticketStatus === 'IN_PROGRESS' ? (
                              <span style={{color:"darkcyan"}}>✅ You can mark this ticket as RESOLVED if you're satisfied</span>
                            ) : (
                              <span className="has-text-warning">🚫 You cannot edit any fields in current state</span>
                            )}
                          </div>
                        )}
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