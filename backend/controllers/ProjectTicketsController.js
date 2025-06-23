// backend/controllers/ProjectTicketsController.js (Updated with file upload)
import ProjectTickets from "../models/ProjectTicketsModel.js";
import ProjectFiles from "../models/ProjectFilesModel.js";
import Users from "../models/UsersModel.js";
import Roles from "../models/RolesModel.js";
import { Op } from "sequelize";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for project ticket creation with files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // We'll create the directory after getting the project ticket ID
    const tempDir = path.join(__dirname, '..', 'uploads', 'temp');
    fs.mkdirSync(tempDir, { recursive: true });
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
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

export const uploadForTicketCreation = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  }
});

// Helper function to move files from temp to project folder
const moveFilesToProjectFolder = async (tempFiles, projectTicketId, userId) => {
  const projectDir = path.join(__dirname, '..', 'uploads', `project_${projectTicketId}`, 'INPUT');
  fs.mkdirSync(projectDir, { recursive: true });
  
  const movedFiles = [];
  
  for (const file of tempFiles) {
    const newFilePath = path.join(projectDir, file.filename);
    
    // Move file from temp to project folder
    fs.renameSync(file.path, newFilePath);
    
    // Create database record
    const projectFile = await ProjectFiles.create({
      projectTicketId: projectTicketId,
      fileName: file.originalname,
      filePath: newFilePath,
      fileType: file.mimetype,
      fileSize: file.size,
      fileCategory: 'INPUT',
      uploadedBy: userId
    });
    
    movedFiles.push(projectFile);
  }
  
  return movedFiles;
};

// Helper function to check if ticket/project is final state
const isFinalState = (ticket) => {
  return ticket.projectStatus === 'COMPLETED' || ticket.ticketStatus === 'CLOSED';
};

// Helper function to check if client can edit ticket
const canClientEdit = (ticket) => {
  if (isFinalState(ticket)) return false;
  return ticket.ticketStatus === 'OPEN' || 
         (ticket.projectStatus === 'REVIEW' && ticket.ticketStatus !== 'CLOSED');
};

// Helper function to check if client can delete ticket
const canClientDelete = (ticket) => {
  return ticket.ticketStatus === 'OPEN';
};

// Helper function to check if editor can edit
const canEditorEdit = (ticket) => {
  return !isFinalState(ticket);
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const stats = await ProjectTickets.findAll({
      attributes: [
        'projectStatus',
        [ProjectTickets.sequelize.fn('COUNT', ProjectTickets.sequelize.col('projectStatus')), 'count']
      ],
      group: ['projectStatus']
    });

    const formattedStats = {
      PENDING: 0,
      IN_PROGRESS: 0,
      REVIEW: 0,
      COMPLETED: 0
    };

    stats.forEach(stat => {
      formattedStats[stat.projectStatus] = parseInt(stat.dataValues.count);
    });

    res.status(200).json(formattedStats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all tickets based on user role
export const getProjectTickets = async (req, res) => {
  try {
    const { userId, roleName } = req.user;
    let whereClause = {};

    if (roleName === 'client') {
      whereClause.clientId = userId;
    }

    const tickets = await ProjectTickets.findAll({
      where: whereClause,
      include: [
        {
          model: Users,
          as: "client",
          attributes: ["userId", "fullName", "email"],
          include: [{
            model: Roles,
            as: "role",
            attributes: ["roleName"]
          }]
        },
        {
          model: Users,
          as: "editor",
          attributes: ["userId", "fullName", "email"],
          include: [{
            model: Roles,
            as: "role",
            attributes: ["roleName"]
          }]
        },
        {
          model: ProjectFiles,
          as: "projectFiles",
          attributes: ["fileId", "fileName", "fileCategory", "uploadedAt"]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching project tickets:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single ticket by ID
export const getProjectTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, roleName } = req.user;

    const ticket = await ProjectTickets.findByPk(id, {
      include: [
        {
          model: Users,
          as: "client",
          attributes: ["userId", "fullName", "email"],
          include: [{
            model: Roles,
            as: "role",
            attributes: ["roleName"]
          }]
        },
        {
          model: Users,
          as: "editor",
          attributes: ["userId", "fullName", "email"],
          include: [{
            model: Roles,
            as: "role",
            attributes: ["roleName"]
          }]
        },
        {
          model: ProjectFiles,
          as: "projectFiles",
          include: [{
            model: Users,
            as: "uploader",
            attributes: ["userId", "fullName", "email"]
          }]
        }
      ]
    });

    if (!ticket) {
      return res.status(404).json({ message: "Project ticket not found" });
    }

    if (roleName === 'client' && ticket.clientId !== userId) {
      return res.status(403).json({ message: "Access denied. You can only view your own tickets." });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching project ticket:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create new ticket (client only) with optional file upload
export const createProjectTicket = async (req, res) => {
  try {
    const { userId, roleName } = req.user;

    if (roleName !== 'client') {
      return res.status(403).json({ message: "Only clients can create tickets" });
    }

    const { subject, budget, description, priority, projectTitle, deadline } = req.body;

    if (!subject || !budget || !description || !projectTitle) {
      return res.status(400).json({ 
        message: "Subject, budget, description, and project title are required" 
      });
    }

    // Create the project ticket first
    const newTicket = await ProjectTickets.create({
      clientId: userId,
      subject,
      budget,
      description,
      priority: priority || 'MEDIUM',
      projectTitle,
      deadline: deadline || null,
      ticketStatus: 'OPEN',
      projectStatus: 'PENDING'
    });

    // If files were uploaded, move them to the project folder and create records
    let uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      uploadedFiles = await moveFilesToProjectFolder(req.files, newTicket.projectTicketId, userId);
    }

    // Fetch the complete ticket with associations
    const ticketWithAssociations = await ProjectTickets.findByPk(newTicket.projectTicketId, {
      include: [
        {
          model: Users,
          as: "client",
          attributes: ["userId", "fullName", "email"],
          include: [{
            model: Roles,
            as: "role",
            attributes: ["roleName"]
          }]
        },
        {
          model: ProjectFiles,
          as: "projectFiles",
          include: [{
            model: Users,
            as: "uploader",
            attributes: ["userId", "fullName", "email"]
          }]
        }
      ]
    });

    res.status(201).json({
      message: "Project ticket created successfully",
      ticket: ticketWithAssociations,
      filesUploaded: uploadedFiles.length
    });
  } catch (error) {
    console.error("Error creating project ticket:", error);
    
    // Clean up temp files if ticket creation failed
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    res.status(500).json({ message: error.message });
  }
};

// Update ticket (existing function remains the same)
export const updateProjectTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, roleName } = req.user;

    const ticket = await ProjectTickets.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: "Project ticket not found" });
    }

    if (isFinalState(ticket)) {
      return res.status(400).json({ 
        message: "Cannot modify ticket. Project is completed or ticket is closed." 
      });
    }

    const isClient = roleName === 'client' && ticket.clientId === userId;
    const isEditor = roleName === 'editor' || roleName === 'admin';

    if (!isClient && !isEditor) {
      return res.status(403).json({ message: "Access denied." });
    }

    const updates = { ...req.body };

    if (isClient) {
      if (!canClientEdit(ticket)) {
        return res.status(400).json({ 
          message: "You cannot edit this ticket in its current state." 
        });
      }

      if (ticket.ticketStatus === 'OPEN') {
        const allowedFields = ['subject', 'budget', 'description', 'priority', 'projectTitle', 'deadline'];
        Object.keys(updates).forEach(key => {
          if (!allowedFields.includes(key)) {
            delete updates[key];
          }
        });
      } else if (ticket.projectStatus === 'REVIEW' && ticket.ticketStatus === 'IN_PROGRESS') {
        const allowedFields = ['ticketStatus'];
        Object.keys(updates).forEach(key => {
          if (!allowedFields.includes(key)) {
            delete updates[key];
          }
        });
        
        if (updates.ticketStatus && updates.ticketStatus !== 'RESOLVED') {
          return res.status(400).json({ 
            message: "You can only mark ticket as RESOLVED when project is in review." 
          });
        }
      } else {
        return res.status(400).json({ 
          message: "You cannot edit this ticket in its current state." 
        });
      }
    }

    if (isEditor) {
      if (!canEditorEdit(ticket)) {
        return res.status(400).json({ 
          message: "Cannot edit ticket in final state." 
        });
      }

      const allowedFields = ['projectStatus', 'editorId'];
      Object.keys(updates).forEach(key => {
        if (!allowedFields.includes(key)) {
          delete updates[key];
        }
      });

      if (updates.projectStatus) {
        const currentProjectStatus = ticket.projectStatus;
        const newProjectStatus = updates.projectStatus;

        if (newProjectStatus === 'PENDING' && currentProjectStatus !== 'PENDING') {
          return res.status(400).json({ 
            message: "Cannot change project status back to PENDING once project has started." 
          });
        }

        const validTransitions = {
          'PENDING': ['IN_PROGRESS'],
          'IN_PROGRESS': ['REVIEW'],
          'REVIEW': ['IN_PROGRESS', 'COMPLETED'],
          'COMPLETED': []
        };

        if (!validTransitions[currentProjectStatus].includes(newProjectStatus)) {
          return res.status(400).json({ 
            message: `Invalid project status transition from ${currentProjectStatus} to ${newProjectStatus}.` 
          });
        }
      }
    }

    await ticket.update(updates);

    const updatedTicket = await ProjectTickets.findByPk(id, {
      include: [
        {
          model: Users,
          as: "client",
          attributes: ["userId", "fullName", "email"],
          include: [{
            model: Roles,
            as: "role",
            attributes: ["roleName"]
          }]
        },
        {
          model: Users,
          as: "editor",
          attributes: ["userId", "fullName", "email"],
          include: [{
            model: Roles,
            as: "role",
            attributes: ["roleName"]
          }]
        }
      ]
    });

    res.status(200).json({
      message: "Project ticket updated successfully",
      ticket: updatedTicket
    });
  } catch (error) {
    console.error("Error updating project ticket:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete ticket
export const deleteProjectTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, roleName } = req.user;

    const ticket = await ProjectTickets.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: "Project ticket not found" });
    }

    if (roleName === 'admin') {
      // Admin can delete and should also clean up files
      const projectFiles = await ProjectFiles.findAll({
        where: { projectTicketId: id }
      });

      // Delete all files from filesystem
      for (const file of projectFiles) {
        if (fs.existsSync(file.filePath)) {
          fs.unlinkSync(file.filePath);
        }
      }

      // Delete project directory
      const projectDir = path.join(__dirname, '..', 'uploads', `project_${id}`);
      if (fs.existsSync(projectDir)) {
        fs.rmSync(projectDir, { recursive: true, force: true });
      }

      await ticket.destroy();
      return res.status(200).json({
        message: "Project ticket and all associated files deleted successfully"
      });
    }

    if (roleName === 'client' && ticket.clientId === userId) {
      if (!canClientDelete(ticket)) {
        return res.status(400).json({ 
          message: "You can only delete tickets with OPEN status." 
        });
      }
      
      // Client can also delete files when deleting ticket
      const projectFiles = await ProjectFiles.findAll({
        where: { projectTicketId: id }
      });

      for (const file of projectFiles) {
        if (fs.existsSync(file.filePath)) {
          fs.unlinkSync(file.filePath);
        }
      }

      const projectDir = path.join(__dirname, '..', 'uploads', `project_${id}`);
      if (fs.existsSync(projectDir)) {
        fs.rmSync(projectDir, { recursive: true, force: true });
      }
      
      await ticket.destroy();
      return res.status(200).json({
        message: "Project ticket and all associated files deleted successfully"
      });
    }

    return res.status(403).json({ 
      message: "You don't have permission to delete this ticket." 
    });

  } catch (error) {
    console.error("Error deleting project ticket:", error);
    res.status(500).json({ message: error.message });
  }
};