// frontend/src/components/ProjectsList.jsx (Updated with Files link and complete component)
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
  const [searchTerm, setSearchTerm] = useState("");

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
      console.log('Updating ticket:', ticketId, 'with:', updates);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/project-tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const result = await response.json();
      console.log('Update response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update ticket');
      }

      // Refresh the tickets list
      fetchProjectTickets();
    } catch (error) {
      console.error('Error updating ticket:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket? All associated files will also be deleted.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/project-tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete ticket');
      }

      // Refresh the list
      fetchProjectTickets();
    } catch (error) {
      console.error('Error deleting ticket:', error);
      setError(error.message);
    }
  };

  // Filter tickets based on selected filters
  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = filterStatus === "ALL" || ticket.ticketStatus === filterStatus;
    const projectStatusMatch = filterProjectStatus === "ALL" || ticket.projectStatus === filterProjectStatus;
    
    // Search functionality - mencari di project title, subject, client name
    const searchMatch = searchTerm === "" || 
      ticket.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.client?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.editor?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.projectTicketId.toString().includes(searchTerm);
    
    return statusMatch && projectStatusMatch && searchMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'is-warning';
      case 'IN_PROGRESS': return 'is-info';
      case 'REVIEW': return 'is-link';
      case 'COMPLETED': return 'is';
      case 'OPEN': return 'is-success';
      case 'RESOLVED': return 'has-background-primary-50 has-text-primary-50-invert';
      case 'CLOSED': return 'is';
      default: return 'is-light';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return 'is-dark';
      case 'HIGH': return 'is-danger';
      case 'MEDIUM': return 'is-warning';
      case 'LOW': return 'is-success';
      default: return 'is-light';
    }
  };

  // Check if user can access project files
  const canAccessFiles = (ticket) => {
    if (user?.role?.roleName === 'admin') return true;
    if (user?.role?.roleName === 'client' && ticket.clientId === user.userId) return true;
    if (user?.role?.roleName === 'editor' && ticket.editorId === user.userId) return true;
    return false;
  };

  // Check edit permissions
  const canEdit = (ticket) => {
    if (user?.role?.roleName === 'admin') return true;
    if (user?.role?.roleName === 'client' && ticket.clientId === user.userId) {
      return ticket.ticketStatus === 'OPEN' || 
             (ticket.projectStatus === 'REVIEW' && ticket.ticketStatus === 'IN_PROGRESS');
    }
    if (user?.role?.roleName === 'editor') {
      return ticket.projectStatus !== 'COMPLETED' && ticket.ticketStatus !== 'CLOSED';
    }
    return false;
  };

  // Check delete permissions
  const canDelete = (ticket) => {
    if (user?.role?.roleName === 'admin') return true;
    if (user?.role?.roleName === 'client' && ticket.clientId === user.userId) {
      return ticket.ticketStatus === 'OPEN';
    }
    return false;
  };

  const formatCurrency = (amount) => {
    return 'Rp' + new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Render action buttons for each ticket
  const renderActionButtons = (ticket) => {
    const isFinalState = ticket.projectStatus === 'COMPLETED' || ticket.ticketStatus === 'CLOSED';
    const isClient = user?.role?.roleName === 'client';
    const isEditor = user?.role?.roleName === 'editor';
    const isAdmin = user?.role?.roleName === 'admin';

    return (
      <div className="buttons">
        {/* View Button - everyone can view their accessible tickets */}
        <Link 
          to={`/projects/view/${ticket.projectTicketId}`}
          className="button is-small is-info"
        >
          <span className="icon">
            <i className="fas fa-eye"></i>
          </span>
          <span>View</span>
        </Link>

        {/* Files Button - for users who can access files */}
        {canAccessFiles(ticket) && (
          <Link 
            to={`/projects/${ticket.projectTicketId}/files`}
            className="button is-small is-link"
          >
            <span className="icon">
              <i className="fas fa-folder"></i>
            </span>
            <span>Files</span>
          </Link>
        )}

        {/* Edit Button */}
        {canEdit(ticket) && (
          <Link 
            to={`/projects/edit/${ticket.projectTicketId}`}
            className="button is-small is-warning"
          >
            <span className="icon">
              <i className="fas fa-edit"></i>
            </span>
            <span>Edit</span>
          </Link>
        )}

        {/* Editor Actions */}
        {isEditor && !isFinalState && (
          <>
            {/* Take Project Button */}
            {ticket.projectStatus === 'PENDING' && !ticket.editorId && (
              <button 
                className="button is-small is-success"
                onClick={() => handleStatusUpdate(ticket.projectTicketId, {
                  editorId: user.userId,
                  projectStatus: 'IN_PROGRESS'
                })}
              >
                <span className="icon">
                  <i className="fas fa-hand-paper"></i>
                </span>
                <span>Take</span>
              </button>
            )}

            {/* Project Status Updates */}
            {ticket.editorId === user.userId && (
              <>
                {ticket.projectStatus === 'IN_PROGRESS' && (
                  <button 
                    className="button is-small is-primary"
                    onClick={() => handleStatusUpdate(ticket.projectTicketId, {
                      projectStatus: 'REVIEW'
                    })}
                  >
                    <span className="icon">
                      <i className="fas fa-search"></i>
                    </span>
                    <span>Review</span>
                  </button>
                )}

                {ticket.projectStatus === 'REVIEW' && (
                  <>
                    <button 
                      className="button is-small is-warning"
                      onClick={() => handleStatusUpdate(ticket.projectTicketId, {
                        projectStatus: 'IN_PROGRESS'
                      })}
                    >
                      <span className="icon">
                        <i className="fas fa-arrow-left"></i>
                      </span>
                      <span>Back to Work</span>
                    </button>
                    {/* Complete button only shows when ticket is RESOLVED */}
                    {ticket.ticketStatus === 'RESOLVED' && (
                      <button 
                        className="button is-small is-success"
                        onClick={() => handleStatusUpdate(ticket.projectTicketId, {
                          projectStatus: 'COMPLETED'
                        })}
                      >
                        <span className="icon">
                          <i className="fas fa-check"></i>
                        </span>
                        <span>Complete</span>
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* Delete Button */}
        {canDelete(ticket) && (
          <button 
            className="button is-small is-danger"
            onClick={() => handleDelete(ticket.projectTicketId)}
          >
            <span className="icon">
              <i className="fas fa-trash"></i>
            </span>
            <span>Delete</span>
          </button>
        )}

        {/* Show final state message */}
        {isFinalState && (
          <span className="tag is-dark">
            <span className="icon">
              <i className="fas fa-lock"></i>
            </span>
            <span>Final State</span>
          </span>
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

              {/* Search Box */}
              <div className="column is-4">
                <div className="field">
                  <label className="label text-glass">Search Projects</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="text"
                      placeholder="Search by title, subject, client name, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-search"></i>
                    </span>
                  </div>
                </div>
              </div>

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
                </div>
              </div>

              {/* Tickets Table/List */}
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
                    <table className="table is-fullwidth is-hoverable enhanced-table" style={{
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
                          <th className="text-glass">Files</th>
                          <th className="text-glass">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTickets.map((ticket, index) => (
                          <tr key={ticket.projectTicketId} style={{ 
                            backgroundColor: index % 2 === 0 ? 
                              'rgba(15, 23, 42, 0.6)' : 'rgba(30, 41, 59, 0.4)' 
                          }}>
                            <td className="text-glass">
                              <span className="tag is-dark">#{ticket.projectTicketId}</span>
                            </td>
                            <td className="text-glass">
                              <strong>{ticket.projectTitle}</strong>
                              <br />
                              <small>{ticket.subject}</small>
                            </td>
                            <td className="text-glass">
                              {ticket.client?.fullName || 'N/A'}
                            </td>
                            <td className="text-glass">
                              {ticket.editor?.fullName || 'Unassigned'}
                            </td>
                            <td>
                              <span className={`tag ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                              </span>
                            </td>
                            <td className="text-glass">
                              {formatCurrency(ticket.budget)}
                            </td>
                            <td>
                              <span className={`tag ${getStatusColor(ticket.ticketStatus)}`}>
                                {ticket.ticketStatus}
                              </span>
                            </td>
                            <td>
                              <span className={`tag ${getStatusColor(ticket.projectStatus)}`}>
                                {ticket.projectStatus}
                              </span>
                            </td>
                            <td className="text-glass">
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </td>
                            <td className="text-glass">
                              {ticket.deadline ? 
                                new Date(ticket.deadline).toLocaleDateString() : 
                                'No deadline'
                              }
                            </td>
                            <td className="text-glass">
                              {ticket.projectFiles && ticket.projectFiles.length > 0 ? (
                                <span className="tag is-link">
                                  <span className="icon">
                                    <i className="fas fa-paperclip"></i>
                                  </span>
                                  <span>{ticket.projectFiles.length}</span>
                                </span>
                              ) : (
                                <span className="tag is">
                                  <span className="icon">
                                    <i className="fas fa-paperclip"></i>
                                  </span>
                                  <span>0</span>
                                </span>
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