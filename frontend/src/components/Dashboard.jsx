// frontend/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import { useAuth } from '../contexts/AuthContext';
import "../styles/glass-theme.css";

const Dashboard = () => {
  const [stats, setStats] = useState({  
    PENDING: 0,
    IN_PROGRESS: 0,
    REVIEW: 0,
    COMPLETED: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const totalTickets = Object.values(stats).reduce((sum, count) => sum + count, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'is-warning';
      case 'IN_PROGRESS': return 'is-info';
      case 'REVIEW': return 'is-link';
      case 'COMPLETED': return 'is-success';
      default: return 'is-light';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return 'fas fa-clock';
      case 'IN_PROGRESS': return 'fas fa-spinner';
      case 'REVIEW': return 'fas fa-search';
      case 'COMPLETED': return 'fas fa-check-circle';
      default: return 'fas fa-question';
    }
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
                  <p className="title is-5 text-glass">Loading Dashboard...</p>
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
              <div className="level mb-6">
                <div className="level-left">
                  <div className="level-item">
                    <h1 className="title text-glass">
                      <i className="fas fa-tachometer-alt mr-3"></i>
                      Dashboard
                    </h1>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <Link to="/projects" className="button is-primary">
                      <span className="icon">
                        <i className="fas fa-project-diagram"></i>
                      </span>
                      <span>View All Projects</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Welcome Section */}
              <div className="bg-glass mb-6" style={{ padding: '2rem', borderRadius: '15px' }}>
                <h2 className="subtitle text-glass mb-3">
                  Welcome back, <strong>{user?.fullName}</strong>!
                </h2>
                <p className="text-glass">
                  Here's an overview of all project tickets in the system.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="notification is-danger mb-5">
                  <button className="delete" onClick={() => setError("")}></button>
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  {error}
                </div>
              )}

              {/* Statistics Cards */}
              <div className="columns is-multiline">
                {/* Total Tickets */}
                <div className="column is-12-mobile is-6-tablet is-3-desktop">
                  <div className="bg-glass" style={{ padding: '1.5rem', borderRadius: '15px', height: '150px' }}>
                    <div className="level is-mobile">
                      <div className="level-left">
                        <div>
                          <p className="text-glass is-size-7 has-text-weight-medium">Total Tickets</p>
                          <p className="text-glass is-size-3 has-text-weight-bold">{totalTickets}</p>
                        </div>
                      </div>
                      <div className="level-right">
                        <span className="icon is-large has-text-grey">
                          <i className="fas fa-ticket-alt fa-2x"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Individual Status Cards */}
                {Object.entries(stats).map(([status, count]) => (
                  <div key={status} className="column is-12-mobile is-6-tablet is-3-desktop">
                    <div className="bg-glass" style={{ padding: '1.5rem', borderRadius: '15px', height: '150px' }}>
                      <div className="level is-mobile">
                        <div className="level-left">
                          <div>
                            <p className="text-glass is-size-7 has-text-weight-medium">
                              {status.replace('_', ' ')}
                            </p>
                            <p className="text-glass is-size-3 has-text-weight-bold">{count}</p>
                            {totalTickets > 0 && (
                              <p className="text-glass is-size-7">
                                {((count / totalTickets) * 100).toFixed(1)}%
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="level-right">
                          <span className={`icon is-large has-text-${getStatusColor(status).replace('is-', '')}`}>
                            <i className={`${getStatusIcon(status)} fa-2x`}></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-glass mt-6" style={{ padding: '2rem', borderRadius: '15px' }}>
                <h3 className="title is-4 text-glass mb-4">
                  <i className="fas fa-bolt mr-2"></i>
                  Quick Actions
                </h3>
                <div className="columns">
                  <div className="column">
                    <Link to="/projects" className="button is-info is-fullwidth">
                      <span className="icon">
                        <i className="fas fa-list"></i>
                      </span>
                      <span>View All Projects</span>
                    </Link>
                  </div>
                  {user?.role?.roleName === 'client' && (
                    <div className="column">
                      <Link to="/projects/add" className="button is-success is-fullwidth">
                        <span className="icon">
                          <i className="fas fa-plus"></i>
                        </span>
                        <span>Create New Ticket</span>
                      </Link>
                    </div>
                  )}
                  {(user?.role?.roleName === 'admin') && (
                  <div className="column">
                    <Link to="/users" className="button is-primary is-fullwidth">
                      <span className="icon">
                        <i className="fas fa-users"></i>
                      </span>
                      <span>Manage Users</span>
                    </Link>
                  </div>
                  )}
                  {(user?.role?.roleName === 'admin') && (
                    <div className="column">
                      <Link to="/roles" className="button is-warning is-fullwidth">
                        <span className="icon">
                          <i className="fas fa-user-tag"></i>
                        </span>
                        <span>Manage Roles</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* System Info */}
              <div className="bg-glass mt-4" style={{ padding: '1rem', borderRadius: '15px' }}>
                <p className="text-glass has-text-centered is-size-7">
                  <i className="fas fa-info-circle mr-2"></i>
                  Last updated: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;