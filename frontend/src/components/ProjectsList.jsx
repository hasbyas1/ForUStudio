// frontend/src/components/ProjectsList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import { useAuth } from '../contexts/AuthContext';
import "../styles/glass-theme.css";

const ProjectsList = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterProjectStatus, setFilterProjectStatus] = useState("ALL");
  const { user } = useAuth();

  useEffect(() => {
    fetchProjectTickets();
  }, []);

  const fetchProjectTickets = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/project-tickets', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project tickets');
      }

      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching project tickets:', error);
      setError('Failed to load project tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId, updates) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/project-tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update ticket');
      }

      // Refresh the tickets list
      fetchProjectTickets();
    } catch (error) {
      console.error('Error updating ticket:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/project-tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }

      fetchProjectTickets();
    } catch (error) {
      console.error('Error deleting ticket:', error);
      setError('Failed to delete ticket');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'is-success';
      case 'IN_PROGRESS': return 'is-info';
      case 'RESOLVED': return 'is-warning';
      case 'CLOSED': return 'is-dark';
      default: return 'is-light';
    }
  };

  const getProjectStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'is-warning';
      case 'IN_PROGRESS': return 'is-info';
      case 'REVIEW': return 'is-link';
      case 'COMPLETED': return 'is-success';
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

  const filteredTickets = tickets.filter(ticket => {
    if (filterStatus !== "ALL" && ticket.ticketStatus !== filterStatus) return false;
    if (filterProjectStatus !== "ALL" && ticket.projectStatus !== filterProjectStatus) return false;
    return true;
  });

  const canEdit = (ticket) => {
    if (user?.role?.roleName === 'admin') return true;
    if (user?.role?.roleName === 'editor') return true;
    if (user?.role?.roleName === 'client' && ticket.clientId === user.userId) return true;
    return false;
  };

  const canDelete = () => {
    return user?.role?.roleName === 'admin';
  };

  const renderActionButtons = (ticket) => {
    const isClient = user?.role?.roleName === 'client';
    const isEditor = user?.role?.roleName === 'editor' || user?.role?.roleName === 'admin';
    const isOwner = ticket.clientId === user?.userId;

    return (
      <div className="field is-grouped">
        {/* Client Actions */}
        {isClient && isOwner && (
          <>
            <div className="control">
              <Link 
                to={`/projects/edit/${ticket.projectTicketId}`} 
                className="button is-small is-info"
              >
                <span className="icon">
                  <i className="fas fa-edit"></i>
                </span>
                <span>Edit</span>
              </Link>
            </div>
            {ticket.ticketStatus !== 'RESOLVED' && ticket.projectStatus !== 'IN_PROGRESS' && (
              <div className="control">
                <button 
                  className="button is-small is-warning"
                  onClick={() => handleStatusUpdate(ticket.projectTicketId, { ticketStatus: 'RESOLVED' })}
                >
                  <span className="icon">
                    <i className="fas fa-check"></i>
                  </span>
                  <span>Mark Resolved</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* Editor Actions */}
        {isEditor && (
          <>
            {ticket.projectStatus === 'PENDING' && (
              <div className="control">
                <button 
                  className="button is-small is-info"
                  onClick={() => handleStatusUpdate(ticket.projectTicketId, { projectStatus: 'IN_PROGRESS' })}
                >
                  <span className="icon">
                    <i className="fas fa-play"></i>
                  </span>
                  <span>Take Project</span>
                </button>
              </div>
            )}
            
            {ticket.projectStatus === 'IN_PROGRESS' && (
              <>
                <div className="control">
                  <button 
                    className="button is-small is-link"
                    onClick={() => handleStatusUpdate(ticket.projectTicketId, { projectStatus: 'REVIEW' })}
                  >
                    <span className="icon">
                      <i className="fas fa-search"></i>
                    </span>
                    <span>Send to Review</span>
                  </button>
                </div>
              </>
            )}

            {ticket.projectStatus === 'REVIEW' && (
              <>
                <div className="control">
                  <button 
                    className="button is-small is-info"
                    onClick={() => handleStatusUpdate(ticket.projectTicketId, { projectStatus: 'IN_PROGRESS' })}
                  >
                    <span className="icon">
                      <i className="fas fa-undo"></i>
                    </span>
                    <span>Back to Progress</span>
                  </button>
                </div>
                <div className="control">
                  <button 
                    className="button is-small is-success"
                    onClick={() => handleStatusUpdate(ticket.projectTicketId, { projectStatus: 'COMPLETED' })}
                  >
                    <span className="icon">
                      <i className="fas fa-check-circle"></i>
                    </span>
                    <span>Complete</span>
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* Admin Delete Action */}
        {canDelete() && (
          <div className="control">
            <button 
              className="button is-small is-danger"
              onClick={() => handleDelete(ticket.projectTicketId)}
            >
              <span className="icon">
                <i className="fas fa-trash"></i>
              </span>
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    );
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
                  <p className="title is-5 text-glass">Loading Projects...</p>
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
            <div className="container is-fluid">
              {/* Header */}
              <div className="level mb-5">
                <div className="level-left">
                  <div className="level-item">
                    <h1 className="title text-glass">
                      <i className="fas fa-project-diagram mr-3"></i>
                      Project Tickets
                    </h1>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <Link to="/dashboard" className="button is-light mr-3">
                      <span className="icon">
                        <i className="fas fa-tachometer-alt"></i>
                      </span>
                      <span>Dashboard</span>
                    </Link>
                  </div>
                  {user?.role?.roleName === 'client' && (
                    <div className="level-item">
                      <Link to="/projects/add" className="button is-success">
                        <span className="icon">
                          <i className="fas fa-plus"></i>
                        </span>
                        <span>Create New Ticket</span>
                      </Link>
                    </div>
                  )}
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

              {/* Filters */}
              <div className="bg-glass mb-5" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label text-glass">Filter by Ticket Status</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                          >
                            <option value="ALL">All Ticket Status</option>
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label text-glass">Filter by Project Status</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select 
                            value={filterProjectStatus} 
                            onChange={(e) => setFilterProjectStatus(e.target.value)}
                          >
                            <option value="ALL">All Project Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="REVIEW">Review</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="column is-narrow">
                    <div className="field">
                      <label className="label text-glass">Total</label>
                      <div className="control">
                        <span className="tag is-info is-large">
                          {filteredTickets.length} tickets
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tickets Table */}
              <div className="bg-glass" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                {filteredTickets.length === 0 ? (
                  <div className="has-text-centered py-6">
                    <div className="is-size-1 mb-4">
                      <i className="fas fa-inbox text-glass"></i>
                    </div>
                    <p className="title is-5 text-glass">No tickets found</p>
                    <p className="subtitle is-6 text-glass">
                      {user?.role?.roleName === 'client' 
                        ? "Create your first project ticket to get started"
                        : "No tickets match your current filters"
                      }
                    </p>
                    {user?.role?.roleName === 'client' && (
                      <Link to="/projects/add" className="button is-primary mt-4">
                        <span className="icon">
                          <i className="fas fa-plus"></i>
                        </span>
                        <span>Create New Ticket</span>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="table is-fullwidth is-hoverable" style={{
                      backgroundColor: 'transparent',
                      color: '#e2e8f0'
                    }}>
                      <thead>
                        <tr style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}>
                          <th className="text-glass">ID</th>
                          <th className="text-glass">Project Title</th>
                          <th className="text-glass">Client</th>
                          <th className="text-glass">Editor</th>
                          <th className="text-glass">Priority</th>
                          <th className="text-glass">Budget</th>
                          <th className="text-glass">Ticket Status</th>
                          <th className="text-glass">Project Status</th>
                          <th className="text-glass">Created</th>
                          <th className="text-glass">Deadline</th>
                          <th className="text-glass">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTickets.map((ticket, index) => (
                          <tr key={ticket.projectTicketId} style={{ 
                            backgroundColor: index % 2 === 0 ? 'rgba(30, 41, 59, 0.4)' : 'rgba(30, 41, 59, 0.2)' 
                          }}>
                            <td className="text-glass">
                              <strong>#{ticket.projectTicketId}</strong>
                            </td>
                            <td className="text-glass">
                              <Link 
                                to={`/projects/view/${ticket.projectTicketId}`}
                                className="has-text-link"
                              >
                                <strong>{ticket.projectTitle}</strong>
                              </Link>
                              <br />
                              <small className="has-text-grey-light">
                                {ticket.subject}
                              </small>
                            </td>
                            <td className="text-glass">
                              <div>
                                <strong>{ticket.client?.fullName}</strong>
                                <br />
                                <small className="has-text-grey-light">
                                  {ticket.client?.email}
                                </small>
                              </div>
                            </td>
                            <td className="text-glass">
                              {ticket.editor ? (
                                <div>
                                  <strong>{ticket.editor.fullName}</strong>
                                  <br />
                                  <small className="has-text-grey-light">
                                    {ticket.editor.email}
                                  </small>
                                </div>
                              ) : (
                                <span className="has-text-grey-light">Unassigned</span>
                              )}
                            </td>
                            <td>
                              <span className={`tag ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                              </span>
                            </td>
                            <td className="text-glass">
                              <strong>${ticket.budget?.toLocaleString()}</strong>
                            </td>
                            <td>
                              <span className={`tag ${getStatusColor(ticket.ticketStatus)}`}>
                                {ticket.ticketStatus.replace('_', ' ')}
                              </span>
                            </td>
                            <td>
                              <span className={`tag ${getProjectStatusColor(ticket.projectStatus)}`}>
                                {ticket.projectStatus.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="text-glass">
                              <small>
                                {new Date(ticket.createdAt).toLocaleDateString()}
                              </small>
                            </td>
                            <td className="text-glass">
                              {ticket.deadline ? (
                                <small className={
                                  new Date(ticket.deadline) < new Date() ? 'has-text-danger' : ''
                                }>
                                  {new Date(ticket.deadline).toLocaleDateString()}
                                </small>
                              ) : (
                                <span className="has-text-grey-light">No deadline</span>
                              )}
                            </td>
                            <td>
                              {renderActionButtons(ticket)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsList;