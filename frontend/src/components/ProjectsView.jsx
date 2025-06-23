// frontend/src/components/ProjectsView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from "./Navbar";
import { useAuth } from '../contexts/AuthContext';
import "../styles/glass-theme.css";

const ProjectsView = () => {
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
        if (response.status === 404) {
          throw new Error('Project ticket not found');
        } else if (response.status === 403) {
          throw new Error('You don\'t have permission to view this ticket');
        }
        throw new Error('Failed to fetch project ticket');
      }

      const data = await response.json();
      setTicket(data);
    } catch (error) {
      console.error('Error fetching project ticket:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'is-success';
      case 'IN_PROGRESS': return 'is-info';
      case 'RESOLVED': return 'has-background-primary-50 has-text-primary-50-invert';
      case 'CLOSED': return 'is';
      default: return 'is-light';
    }
  };

  const getProjectStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'is-warning';
      case 'IN_PROGRESS': return 'is-info';
      case 'REVIEW': return 'is-link';
      case 'COMPLETED': return 'is';
      default: return 'is-light';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW': return 'is-success';
      case 'MEDIUM': return 'is-warning';
      case 'HIGH': return 'is-danger';
      case 'URGENT': return 'is-dark';
      default: return 'is-light';
    }
  };

  const canEdit = () => {
    if (!ticket) return false;
    if (user?.role?.roleName === 'admin') return true;
    if (user?.role?.roleName === 'client' && ticket.clientId === user.userId) return true;
    return false;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  // jika Anda ingin format yang lebih sederhana tanpa simbol currency:
  const formatCurrency = (amount) => {
    return 'Rp' + new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
                  <p className="title is-5 text-glass">Loading Ticket Details...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="section gradient-background" style={{ minHeight: '100vh' }}>
          <div className="content-wrapper">
            <div className="section">
              <div className="container">
                <div className="notification is-danger">
                  <h1 className="title">Error</h1>
                  <p>{error}</p>
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

  if (!ticket) {
    return (
      <>
        <Navbar />
        <div className="section gradient-background" style={{ minHeight: '100vh' }}>
          <div className="content-wrapper">
            <div className="section">
              <div className="container">
                <div className="notification is-warning">
                  <h1 className="title">Ticket Not Found</h1>
                  <p>The requested project ticket could not be found.</p>
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
              {/* Header */}
              <div className="level mb-5">
                <div className="level-left">
                  <div className="level-item">
                    <h1 className="title text-glass">
                      <i className="fas fa-eye mr-3"></i>
                      Project Ticket #{ticket.projectTicketId}
                    </h1>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <button 
                      className="button is-light mr-3"
                      onClick={() => navigate('/projects')}
                    >
                      <span className="icon">
                        <i className="fas fa-arrow-left"></i>
                      </span>
                      <span>Back to Projects</span>
                    </button>
                  </div>
                  {canEdit() && (
                    <div className="level-item">
                      <Link 
                        to={`/projects/edit/${ticket.projectTicketId}`}
                        className="button is-primary"
                      >
                        <span className="icon">
                          <i className="fas fa-edit"></i>
                        </span>
                        <span>Edit Ticket</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="columns">
                {/* Main Content */}
                <div className="column is-8">
                  {/* Project Details */}
                  <div className="bg-glass mb-5" style={{ padding: '2rem', borderRadius: '15px' }}>
                    <h2 className="title is-4 project-title-stroke mb-4">
                      <i className="fas fa-project-diagram mr-2"></i>
                      {ticket.projectTitle}
                    </h2>
                    
                    <div className="field">
                      <label className="label table-text-white">Subject</label>
                      <p className="table-text-white">{ticket.subject}</p>
                    </div>

                    <div className="field">
                      <label className="label table-text-white">Description</label>
                      <div className="content table-text-white" style={{ 
                        backgroundColor: 'rgba(30, 41, 59, 0.3)', 
                        padding: '1rem', 
                        borderRadius: '8px',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {ticket.description}
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-glass" style={{ padding: '2rem', borderRadius: '15px' }}>
                    <h3 className="title is-5 text-glass mb-4">
                      <i className="fas fa-history mr-2"></i>
                      Timeline
                    </h3>
                    
                    <div className="timeline">
                      <div className="timeline-item">
                        <div className="timeline-marker is-success"></div>
                        <div className="timeline-content">
                          <p className="heading text-glass">Created</p>
                          <p className="text-glass">{formatDate(ticket.createdAt)}</p>
                          <p className="text-glass is-size-7">Ticket was created by {ticket.client?.fullName}</p>
                          <p className="text-glass is-size-7">---------</p>
                        </div>
                      </div>

                      {ticket.takenAt && (
                        <div className="timeline-item">
                          <div className="timeline-marker is-info"></div>
                          <div className="timeline-content">
                            <p className="heading text-glass">Taken by Editor</p>
                            <p className="text-glass">{formatDate(ticket.takenAt)}</p>
                            <p className="text-glass is-size-7">Project taken by {ticket.editor?.fullName}</p>
                            <p className="text-glass is-size-7">---------</p>
                          </div>
                        </div>
                      )}

                      {ticket.resolvedAt && (
                        <div className="timeline-item">
                          <div className="timeline-marker is-warning"></div>
                          <div className="timeline-content">
                            <p className="heading text-glass">Resolved</p>
                            <p className="text-glass">{formatDate(ticket.resolvedAt)}</p>
                            <p className="text-glass is-size-7">Marked as resolved</p>
                            <p className="text-glass is-size-7">---------</p>
                          </div>
                        </div>
                      )}

                      {ticket.projectStatus === 'COMPLETED' && (
                        <div className="timeline-item">
                          <div className="timeline-marker is-success"></div>
                          <div className="timeline-content">
                            <p className="heading text-glass">Completed</p>
                            <p className="text-glass">{formatDate(ticket.updatedAt)}</p>
                            <p className="text-glass is-size-7">Project completed</p>
                            <p className="text-glass is-size-7">---------</p>
                          </div>
                        </div>
                      )}

                      <div className="timeline-item">
                        <div className="timeline-marker is-light"></div>
                        <div className="timeline-content">
                          <p className="heading text-glass">Last Updated</p>
                          <p className="text-glass">{formatDate(ticket.updatedAt)}</p>
                          <p className="text-glass is-size-7">---------</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="column is-4">
                  {/* Status Card */}
                  <div className="bg-glass mb-5" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                    <h3 className="title is-6 text-glass mb-3">
                      <i className="fas fa-flag mr-2"></i>
                      Status Information
                    </h3>
                    
                    <div className="field">
                      <label className="label text-glass is-small">Ticket Status</label>
                      <span className={`tag is-medium ${getStatusColor(ticket.ticketStatus)}`}>
                        {ticket.ticketStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="field">
                      <label className="label text-glass is-small">Project Status</label>
                      <span className={`tag is-medium ${getProjectStatusColor(ticket.projectStatus)}`}>
                        {ticket.projectStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="field">
                      <label className="label text-glass is-small">Priority</label>
                      <span className={`tag is-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>

                  {/* Project Details Card */}
                  <div className="bg-glass mb-5" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                    <h3 className="title is-6 text-glass mb-3">
                      <i className="fas fa-info-circle mr-2"></i>
                      Project Details
                    </h3>
                    
                    <div className="field">
                      <label className="label text-glass is-small">Budget</label>
                      <p className="text-glass has-text-weight-semibold is-size-5">
                        {formatCurrency(ticket.budget)}
                      </p>
                    </div>

                    <div className="field">
                      <label className="label text-glass is-small">Deadline</label>
                      <p className="text-glass">
                        {ticket.deadline ? (
                          <span className={new Date(ticket.deadline) < new Date() ? 'has-text-danger' : ''}>
                            {formatDate(ticket.deadline)}
                            {new Date(ticket.deadline) < new Date() && (
                              <span className="tag is-danger is-small ml-2">Overdue</span>
                            )}
                          </span>
                        ) : (
                          'No deadline set'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* People Card */}
                  <div className="bg-glass mb-5" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                    <h3 className="title is-6 text-glass mb-3">
                      <i className="fas fa-users mr-2"></i>
                      People
                    </h3>
                    
                    <div className="field">
                      <label className="label text-glass is-small">Client</label>
                      <div className="media">
                        <div className="media-left">
                          <span className="icon">
                            <i className="fas fa-user-circle"></i>
                          </span>
                        </div>
                        <div className="media-content">
                          <p className="text-glass has-text-weight-semibold">
                            {ticket.client?.fullName}
                          </p>
                          <p className="text-glass is-size-7">
                            {ticket.client?.email}
                          </p>
                          <span className="tag is-info is-small">
                            {ticket.client?.role?.roleName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="field">
                      <label className="label text-glass is-small">Assigned Editor</label>
                      {ticket.editor ? (
                        <div className="media">
                          <div className="media-left">
                            <span className="icon">
                              <i className="fas fa-user-edit"></i>
                            </span>
                          </div>
                          <div className="media-content">
                            <p className="text-glass has-text-weight-semibold">
                              {ticket.editor.fullName}
                            </p>
                            <p className="text-glass is-size-7">
                              {ticket.editor.email}
                            </p>
                            <span className="tag is-warning is-small">
                              {ticket.editor.role?.roleName}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-glass has-text-grey-light">
                          <i className="fas fa-clock mr-2"></i>
                          Waiting for editor assignment
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Card */}
                  {(user?.role?.roleName === 'editor' || user?.role?.roleName === 'admin') && (
                    <div className="bg-glass" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                      <h3 className="title is-6 text-glass mb-3">
                        <i className="fas fa-cogs mr-2"></i>
                        Editor Actions
                      </h3>
                      
                      {ticket.projectStatus === 'PENDING' && (
                        <button className="button is-info is-fullwidth mb-3">
                          <span className="icon">
                            <i className="fas fa-play"></i>
                          </span>
                          <span>Take Project</span>
                        </button>
                      )}

                      {ticket.projectStatus === 'IN_PROGRESS' && (
                        <>
                          <button className="button is-link is-fullwidth mb-3">
                            <span className="icon">
                              <i className="fas fa-search"></i>
                            </span>
                            <span>Send to Review</span>
                          </button>
                        </>
                      )}
                      {ticket.projectStatus === 'REVIEW' && (
                        <>
                          <button className="button is-info is-fullwidth mb-2">
                            <span className="icon">
                              <i className="fas fa-undo"></i>
                            </span>
                            <span>Back to Progress</span>
                          </button>
                          {/* Complete button only shows when ticket is RESOLVED */}
                          {ticket.ticketStatus === 'RESOLVED' && (
                            <button className="button is-success is-fullwidth">
                              <span className="icon">
                                <i className="fas fa-check-circle"></i>
                              </span>
                              <span>Complete</span>
                            </button>
                          )}
                        </>
                      )}
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

export default ProjectsView;