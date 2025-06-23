// frontend/src/components/ProjectsAdd.jsx (Updated with file upload)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';

const ProjectsAdd = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ← Gunakan useAuth context
  const [formData, setFormData] = useState({
    subject: '',
    budget: '',
    description: '',
    priority: 'MEDIUM',
    projectTitle: '',
    deadline: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is authenticated and is a client
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role?.roleName !== 'client') {
      navigate('/dashboard');
      return;
    }
  }, [navigate, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
      
      // Create FormData object to handle both form data and files
      const submitData = new FormData();
      
      // Append form fields
      submitData.append('subject', formData.subject);
      submitData.append('budget', parseFloat(formData.budget));
      submitData.append('description', formData.description);
      submitData.append('priority', formData.priority);
      submitData.append('projectTitle', formData.projectTitle);
      if (formData.deadline) {
        submitData.append('deadline', formData.deadline);
      }
      
      // Append files
      selectedFiles.forEach(file => {
        submitData.append('files', file);
      });

      const response = await fetch('http://localhost:5000/project-tickets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData // Don't set Content-Type, let browser set it for FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project ticket');
      }

      const result = await response.json();
      console.log('Project created successfully:', result);

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

                  {error && (
                    <div className="notification is-danger">
                      <button 
                        className="delete" 
                        onClick={() => setError("")}
                      ></button>
                      {error}
                    </div>
                  )}

                  {/* Form */}
                  <div className="bg-glass" style={{ padding: '2rem', borderRadius: '15px' }}>
                    <form onSubmit={handleSubmit}>
                      <div className="field">
                        <label className="label text-glass">Project Title *</label>
                        <div className="control">
                          <input
                            className="input"
                            type="text"
                            name="projectTitle"
                            value={formData.projectTitle}
                            onChange={handleInputChange}
                            placeholder="Enter project title"
                            required
                          />
                        </div>
                      </div>

                      <div className="field">
                        <label className="label text-glass">Subject *</label>
                        <div className="control">
                          <input
                            className="input"
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="Brief subject of your request"
                            required
                          />
                        </div>
                      </div>

                      <div className="columns">
                        <div className="column">
                          <div className="field">
                            <label className="label text-glass">Budget (USD) *</label>
                            <div className="control">
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
                            </div>
                          </div>
                        </div>
                        <div className="column">
                          <div className="field">
                            <label className="label text-glass">Priority</label>
                            <div className="control">
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
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="field">
                        <label className="label text-glass">Deadline (Optional)</label>
                        <div className="control">
                          <input
                            className="input"
                            type="datetime-local"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="field">
                        <label className="label text-glass">Description *</label>
                        <div className="control">
                          <textarea
                            className="textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your project requirements in detail..."
                            rows="4"
                            required
                          ></textarea>
                        </div>
                      </div>

                      {/* File Upload Section */}
                      <div className="field">
                        <label className="label text-glass">
                          <i className="fas fa-upload mr-2"></i>
                          Upload Project Files (Optional)
                        </label>
                        <div className="control">
                          <input
                            type="file"
                            multiple
                            className="input"
                            onChange={handleFileSelect}
                            accept=".mp4,.avi,.mov,.mkv,.wmv,.mp3,.wav,.aac,.flac,.jpg,.jpeg,.png,.gif,.bmp,.pdf,.txt,.zip,.rar,.7z"
                          />
                        </div>
                        <p className="help text-glass">
                          Upload your source materials, videos, audio files, images, or documents. 
                          These will be stored in the INPUT folder for the editor to access.
                          Supported formats: Video, Audio, Images, Documents, Archives. Max: 500MB per file.
                        </p>
                      </div>

                      {/* Selected Files Display */}
                      {selectedFiles.length > 0 && (
                        <div className="field">
                          <label className="label text-glass">Selected Files ({selectedFiles.length}):</label>
                          <div className="bg-glass-light" style={{ padding: '1rem', borderRadius: '10px' }}>
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="media">
                                <div className="media-left">
                                  <span className="icon text-glass">
                                    <i className="fas fa-file"></i>
                                  </span>
                                </div>
                                <div className="media-content">
                                  <div className="content">
                                    <p className="text-glass">
                                      <strong>{file.name}</strong>
                                      <br />
                                      <small>Size: {formatFileSize(file.size)}</small>
                                    </p>
                                  </div>
                                </div>
                                <div className="media-right">
                                  <button
                                    type="button"
                                    className="button is-small is-danger"
                                    onClick={() => removeFile(index)}
                                  >
                                    <span className="icon">
                                      <i className="fas fa-times"></i>
                                    </span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="field is-grouped">
                        <div className="control">
                          <button
                            type="submit"
                            className={`button is-primary ${isLoading ? 'is-loading' : ''}`}
                            disabled={isLoading}
                          >
                            <span className="icon">
                              <i className="fas fa-plus"></i>
                            </span>
                            <span>{isLoading ? 'Creating...' : 'Create Ticket'}</span>
                          </button>
                        </div>
                        <div className="control">
                          <button
                            type="button"
                            className="button is-light"
                            onClick={() => navigate('/projects')}
                            disabled={isLoading}
                          >
                            Cancel
                          </button>
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
                        <li>Any uploaded files will be stored in the project's <strong>INPUT</strong> folder</li>
                        <li>An editor will review and take your project, changing status to <strong>"IN_PROGRESS"</strong></li>
                        <li>You can access the project files page to manage your materials</li>
                        <li>The editor will upload deliverables to the <strong>OUTPUT</strong> folder</li>
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