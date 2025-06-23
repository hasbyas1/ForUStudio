// backend/controllers/ProjectFilesController.js
import ProjectFiles from "../models/ProjectFilesModel.js";
import ProjectTickets from "../models/ProjectTicketsModel.js";
import Users from "../models/UsersModel.js";
import Roles from "../models/RolesModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { projectTicketId } = req.params;
    const { fileCategory } = req.body;
    
    // Create directory structure: uploads/projectId/INPUT or OUTPUT
    const uploadDir = path.join(__dirname, '..', 'uploads', `project_${projectTicketId}`, fileCategory || 'INPUT');
    
    // Create directory if it doesn't exist
    fs.mkdirSync(uploadDir, { recursive: true });
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow common file types for video editing projects
  const allowedTypes = [
    'video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/wmv',
    'audio/mp3', 'audio/wav', 'audio/aac', 'audio/flac',
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp',
    'application/pdf', 'text/plain',
    'application/zip', 'application/rar', 'application/x-7z-compressed'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  }
});

// Helper function to check if user can access project files
const canAccessProjectFiles = async (userId, roleName, projectTicketId) => {
  const ticket = await ProjectTickets.findByPk(projectTicketId);
  if (!ticket) return false;
  
  // Admin can access all files
  if (roleName === 'admin') return true;
  
  // Client can access files of their own project tickets
  if (roleName === 'client' && ticket.clientId === userId) return true;
  
  // Editor can access files of assigned project tickets
  if (roleName === 'editor' && ticket.editorId === userId) return true;
  
  return false;
};

// Helper function to check file permissions
const getFilePermissions = (userRole, fileCategory, isOwner) => {
  const permissions = {
    canView: false,
    canDownload: false,
    canUpload: false,
    canDelete: false
  };
  
  if (userRole === 'admin') {
    // Admin has full access
    permissions.canView = true;
    permissions.canDownload = true;
    permissions.canUpload = true;
    permissions.canDelete = true;
  } else if (userRole === 'client') {
    if (fileCategory === 'INPUT') {
      // Client has full access to INPUT files
      permissions.canView = true;
      permissions.canDownload = true;
      permissions.canUpload = true;
      permissions.canDelete = isOwner;
    } else if (fileCategory === 'OUTPUT') {
      // Client can only view and download OUTPUT files
      permissions.canView = true;
      permissions.canDownload = true;
      permissions.canUpload = false;
      permissions.canDelete = false;
    }
  } else if (userRole === 'editor') {
    if (fileCategory === 'INPUT') {
      // Editor can only view and download INPUT files
      permissions.canView = true;
      permissions.canDownload = true;
      permissions.canUpload = false;
      permissions.canDelete = false;
    } else if (fileCategory === 'OUTPUT') {
      // Editor has full access to OUTPUT files
      permissions.canView = true;
      permissions.canDownload = true;
      permissions.canUpload = true;
      permissions.canDelete = isOwner;
    }
  }
  
  return permissions;
};

// Get all files for a project ticket
export const getProjectFiles = async (req, res) => {
  try {
    const { projectTicketId } = req.params;
    const { userId, roleName } = req.user;
    
    // Check if user can access this project's files
    const canAccess = await canAccessProjectFiles(userId, roleName, projectTicketId);
    if (!canAccess) {
      return res.status(403).json({ message: "Access denied to project files" });
    }
    
    const files = await ProjectFiles.findAll({
      where: { projectTicketId },
      include: [
        {
          model: Users,
          as: "uploader",
          attributes: ["userId", "fullName", "email"],
          include: [{
            model: Roles,
            as: "role",
            attributes: ["roleName"]
          }]
        }
      ],
      order: [['uploadedAt', 'DESC']]
    });
    
    // Add permissions to each file
    const filesWithPermissions = files.map(file => {
      const isOwner = file.uploadedBy === userId;
      const permissions = getFilePermissions(roleName, file.fileCategory, isOwner);
      
      return {
        ...file.toJSON(),
        permissions
      };
    });
    
    // Group files by category
    const groupedFiles = {
      INPUT: filesWithPermissions.filter(file => file.fileCategory === 'INPUT'),
      OUTPUT: filesWithPermissions.filter(file => file.fileCategory === 'OUTPUT')
    };
    
    res.status(200).json(groupedFiles);
  } catch (error) {
    console.error("Error fetching project files:", error);
    res.status(500).json({ message: error.message });
  }
};

// Upload files to project
export const uploadProjectFiles = async (req, res) => {
  try {
    const { projectTicketId } = req.params;
    const { userId, roleName } = req.user;
    const { fileCategory = 'INPUT' } = req.body;
    
    // Check if user can access this project
    const canAccess = await canAccessProjectFiles(userId, roleName, projectTicketId);
    if (!canAccess) {
      return res.status(403).json({ message: "Access denied to project files" });
    }
    
    // Check upload permissions
    const permissions = getFilePermissions(roleName, fileCategory, true);
    if (!permissions.canUpload) {
      return res.status(403).json({ 
        message: `You don't have permission to upload ${fileCategory} files` 
      });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    
    const uploadedFiles = [];
    
    for (const file of req.files) {
      const projectFile = await ProjectFiles.create({
        projectTicketId: parseInt(projectTicketId),
        fileName: file.originalname,
        filePath: file.path,
        fileType: file.mimetype,
        fileSize: file.size,
        fileCategory: fileCategory,
        uploadedBy: userId
      });
      
      const fileWithUploader = await ProjectFiles.findByPk(projectFile.fileId, {
        include: [
          {
            model: Users,
            as: "uploader",
            attributes: ["userId", "fullName", "email"],
            include: [{
              model: Roles,
              as: "role",
              attributes: ["roleName"]
            }]
          }
        ]
      });
      
      uploadedFiles.push(fileWithUploader);
    }
    
    res.status(201).json({
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      files: uploadedFiles
    });
  } catch (error) {
    console.error("Error uploading project files:", error);
    res.status(500).json({ message: error.message });
  }
};

// Download file
export const downloadProjectFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { userId, roleName } = req.user;
    
    const file = await ProjectFiles.findByPk(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    
    // Check if user can access this project
    const canAccess = await canAccessProjectFiles(userId, roleName, file.projectTicketId);
    if (!canAccess) {
      return res.status(403).json({ message: "Access denied to project files" });
    }
    
    // Check download permissions
    const isOwner = file.uploadedBy === userId;
    const permissions = getFilePermissions(roleName, file.fileCategory, isOwner);
    if (!permissions.canDownload) {
      return res.status(403).json({ 
        message: `You don't have permission to download ${file.fileCategory} files` 
      });
    }
    
    // Check if file exists
    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }
    
    // Send file
    res.download(file.filePath, file.fileName);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete file
export const deleteProjectFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { userId, roleName } = req.user;
    
    const file = await ProjectFiles.findByPk(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    
    // Check if user can access this project
    const canAccess = await canAccessProjectFiles(userId, roleName, file.projectTicketId);
    if (!canAccess) {
      return res.status(403).json({ message: "Access denied to project files" });
    }
    
    // Check delete permissions
    const isOwner = file.uploadedBy === userId;
    const permissions = getFilePermissions(roleName, file.fileCategory, isOwner);
    if (!permissions.canDelete) {
      return res.status(403).json({ 
        message: `You don't have permission to delete this file` 
      });
    }
    
    // Delete file from filesystem
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }
    
    // Delete from database
    await file.destroy();
    
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: error.message });
  }
};