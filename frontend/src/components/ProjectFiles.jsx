// frontend/src/components/ProjectFiles.jsx - COMPLETE VERSION
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';

const ProjectFiles = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [projectTicket, setProjectTicket] = useState(null);
  const [files, setFiles] = useState({ INPUT: [], OUTPUT: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadCategory, setUploadCategory] = useState('INPUT');
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchProjectTicket();
    fetchProjectFiles();
  }, [projectId, navigate, user]);

  const fetchProjectTicket = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/project-tickets/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project ticket');
      }

      const data = await response.json();
      setProjectTicket(data);
    } catch (error) {
      console.error('Error fetching project ticket:', error);
      setError(error.message);
    }
  };

  const fetchProjectFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/project-tickets/${projectId}/files`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project files');
      }

      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching project files:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select files to upload");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      
      formData.append('fileCategory', uploadCategory);

      const response = await fetch(`http://localhost:5000/project-tickets/${projectId}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      // Reset form and refresh files
      setSelectedFiles([]);
      document.getElementById('fileInput').value = '';
      fetchProjectFiles();
      
    } catch (error) {
      console.error('Error uploading files:', error);
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/project-files/${fileId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/project-files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Delete failed');
      }

      fetchProjectFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      setError(error.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('video/')) return 'fas fa-video';
    if (fileType.startsWith('audio/')) return 'fas fa-volume-up';
    if (fileType.startsWith('image/')) return 'fas fa-image';
    if (fileType.includes('pdf')) return 'fas fa-file-pdf';
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) return 'fas fa-file-archive';
    return 'fas fa-file';
  };

  const canUploadToCategory = (category) => {
    if (user?.role?.roleName === 'admin') return true;
    if (user?.role?.roleName === 'client' && category === 'INPUT') return true;
    if (user?.role?.roleName === 'editor' && category === 'OUTPUT') return true;
    return false;
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="section gradient-background" style={{ minHeight: '100vh' }}>
          <div className="container">
            <div className="has-text-centered">
              <div className="button is-loading is-large is-text"></div>
              <p className="text-glass">Loading project files...</p>
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
                      <i className="fas fa-folder-open mr-3"></i>
                      Project Files
                    </h1>
                    {projectTicket && (
                      <p className="subtitle text-glass">
                        {projectTicket.projectTitle}
                      </p>
                    )}
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

              {/* Upload Section */}
              {(canUploadToCategory('INPUT') || canUploadToCategory('OUTPUT')) && (
                <div className="bg-glass mb-6" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                  <h3 className="title is-5 text-glass mb-4">
                    <i className="fas fa-cloud-upload-alt mr-2"></i>
                    Upload Files
                  </h3>
                  
                  <div className="field">
                    <label className="label text-glass">Category</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select 
                          value={uploadCategory} 
                          onChange={(e) => setUploadCategory(e.target.value)}
                        >
                          {canUploadToCategory('INPUT') && (
                            <option value="INPUT">Input Files (Client Materials)</option>
                          )}
                          {canUploadToCategory('OUTPUT') && (
                            <option value="OUTPUT">Output Files (Editor Results)</option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label text-glass">Select Files</label>
                    <div className="control">
                      <input
                        id="fileInput"
                        type="file"
                        multiple
                        className="input"
                        onChange={handleFileSelect}
                        accept=".mp4,.avi,.mov,.mkv,.wmv,.mp3,.wav,.aac,.flac,.jpg,.jpeg,.png,.gif,.bmp,.pdf,.txt,.zip,.rar,.7z"
                      />
                    </div>
                    <p className="help text-glass">
                      Supported formats: Video (MP4, AVI, MOV, MKV, WMV), Audio (MP3, WAV, AAC, FLAC), 
                      Images (JPG, PNG, GIF, BMP), Documents (PDF, TXT), Archives (ZIP, RAR, 7Z). 
                      Max size: 500MB per file.
                    </p>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="field">
                      <label className="label text-glass">Selected Files:</label>
                      <div className="content">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="text-glass">
                            • {file.name} ({formatFileSize(file.size)})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="field">
                    <div className="control">
                      <button
                        className={`button is-primary ${isUploading ? 'is-loading' : ''}`}
                        onClick={handleUpload}
                        disabled={isUploading || selectedFiles.length === 0}
                      >
                        <span className="icon">
                          <i className="fas fa-upload"></i>
                        </span>
                        <span>{isUploading ? 'Uploading...' : 'Upload Files'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Files Display */}
              <div className="columns">
                {/* INPUT Files */}
                <div className="column is-half">
                  <div className="bg-glass" style={{ padding: '1.5rem', borderRadius: '15px', height: 'fit-content' }}>
                    <h3 className="title is-5 text-glass mb-4">
                      <i className="fas fa-inbox mr-2"></i>
                      Input Files ({files.INPUT.length})
                    </h3>
                    <p className="text-glass mb-4">
                      <small>Client materials and source files</small>
                    </p>
                    
                    {files.INPUT.length === 0 ? (
                      <div className="has-text-centered py-5">
                        <i className="fas fa-inbox fa-3x text-glass mb-3"></i>
                        <p className="text-glass">No input files uploaded yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {files.INPUT.map((file) => (
                          <div key={file.fileId} className="media bg-glass-light" style={{ padding: '1rem', borderRadius: '10px' }}>
                            <div className="media-left">
                              <span className="icon is-large text-glass">
                                <i className={getFileIcon(file.fileType) + " fa-2x"}></i>
                              </span>
                            </div>
                            <div className="media-content">
                              <div className="content">
                                <p className="text-glass">
                                  <strong>{file.fileName}</strong>
                                  <br />
                                  <small>
                                    Size: {formatFileSize(file.fileSize)} • 
                                    Uploaded by: {file.uploader.fullName} • 
                                    {new Date(file.uploadedAt).toLocaleDateString()}
                                  </small>
                                </p>
                              </div>
                            </div>
                            <div className="media-right">
                              <div className="buttons">
                                {file.permissions.canDownload && (
                                  <button
                                    className="button is-small is-info"
                                    onClick={() => handleDownload(file.fileId, file.fileName)}
                                  >
                                    <span className="icon">
                                      <i className="fas fa-download"></i>
                                    </span>
                                  </button>
                                )}
                                {file.permissions.canDelete && (
                                  <button
                                    className="button is-small is-danger"
                                    onClick={() => handleDelete(file.fileId)}
                                  >
                                    <span className="icon">
                                      <i className="fas fa-trash"></i>
                                    </span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* OUTPUT Files */}
                <div className="column is-half">
                  <div className="bg-glass" style={{ padding: '1.5rem', borderRadius: '15px', height: 'fit-content' }}>
                    <h3 className="title is-5 text-glass mb-4">
                      <i className="fas fa-file-export mr-2"></i>
                      Output Files ({files.OUTPUT.length})
                    </h3>
                    <p className="text-glass mb-4">
                      <small>Editor deliverables and final results</small>
                    </p>
                    
                    {files.OUTPUT.length === 0 ? (
                      <div className="has-text-centered py-5">
                        <i className="fas fa-file-export fa-3x text-glass mb-3"></i>
                        <p className="text-glass">No output files available yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {files.OUTPUT.map((file) => (
                          <div key={file.fileId} className="media bg-glass-light" style={{ padding: '1rem', borderRadius: '10px' }}>
                            <div className="media-left">
                              <span className="icon is-large text-glass">
                                <i className={getFileIcon(file.fileType) + " fa-2x"}></i>
                              </span>
                            </div>
                            <div className="media-content">
                              <div className="content">
                                <p className="text-glass">
                                  <strong>{file.fileName}</strong>
                                  <br />
                                  <small>
                                    Size: {formatFileSize(file.fileSize)} • 
                                    Uploaded by: {file.uploader.fullName} • 
                                    {new Date(file.uploadedAt).toLocaleDateString()}
                                  </small>
                                </p>
                              </div>
                            </div>
                            <div className="media-right">
                              <div className="buttons">
                                {file.permissions.canDownload && (
                                  <button
                                    className="button is-small is-info"
                                    onClick={() => handleDownload(file.fileId, file.fileName)}
                                  >
                                    <span className="icon">
                                      <i className="fas fa-download"></i>
                                    </span>
                                  </button>
                                )}
                                {file.permissions.canDelete && (
                                  <button
                                    className="button is-small is-danger"
                                    onClick={() => handleDelete(file.fileId)}
                                  >
                                    <span className="icon">
                                      <i className="fas fa-trash"></i>
                                    </span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-glass mt-5" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                <h4 className="title is-6 text-glass">
                  <i className="fas fa-info-circle mr-2"></i>
                  File Management Rules
                </h4>
                <div className="content text-glass">
                  <div className="columns">
                    <div className="column">
                      <h6 className="subtitle is-6 text-glass">Input Files (Client)</h6>
                      <ul>
                        <li><strong>Client:</strong> Can upload, view, download, and delete their own files</li>
                        <li><strong>Editor:</strong> Can only view and download files</li>
                        <li><strong>Purpose:</strong> Raw materials, source videos, audio, images, documents</li>
                      </ul>
                    </div>
                    <div className="column">
                      <h6 className="subtitle is-6 text-glass">Output Files (Editor)</h6>
                      <ul>
                        <li><strong>Editor:</strong> Can upload, view, download, and delete their own files</li>
                        <li><strong>Client:</strong> Can only view and download files</li>
                        <li><strong>Purpose:</strong> Final deliverables, edited videos, processed content</li>
                      </ul>
                    </div>
                  </div>
                  <div className="notification is-info is-light">
                    <p><strong>Note:</strong> Files are automatically organized by project ticket. 
                    Only users associated with this project ticket can access these files.</p>
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

export default ProjectFiles;