// backend/controllers/ProjectTicketsController.js
import ProjectTickets from "../models/ProjectTicketsModel.js";
import Users from "../models/UsersModel.js";
import Roles from "../models/RolesModel.js";
import { Op } from "sequelize";

// Helper function to check if ticket/project is final state
const isFinalState = (ticket) => {
  return ticket.projectStatus === 'COMPLETED' || ticket.ticketStatus === 'CLOSED';
};

// Helper function to check if client can edit ticket
const canClientEdit = (ticket) => {
  // Client cannot edit if ticket is in final state (COMPLETED/CLOSED)
  if (isFinalState(ticket)) return false;
  
  // Client can edit when ticket is OPEN or when project is REVIEW and ticket is not CLOSED
  return ticket.ticketStatus === 'OPEN' || 
         (ticket.projectStatus === 'REVIEW' && ticket.ticketStatus !== 'CLOSED');
};

// Helper function to check if client can delete ticket
const canClientDelete = (ticket) => {
  // Client can only delete when ticket status is OPEN
  return ticket.ticketStatus === 'OPEN';
};

// Helper function to check if editor can edit
const canEditorEdit = (ticket) => {
  // Editor cannot edit if ticket is in final state
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
    console.error("Error deleting project ticket:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all tickets based on user role
export const getProjectTickets = async (req, res) => {
  try {
    const { userId, roleName } = req.user;
    let whereClause = {};

    // Filter based on role
    if (roleName === 'client') {
      whereClause.clientId = userId;
    }
    // Admin and editor can see all tickets

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
        }
      ]
    });

    if (!ticket) {
      return res.status(404).json({ message: "Project ticket not found" });
    }

    // Check access permissions
    if (roleName === 'client' && ticket.clientId !== userId) {
      return res.status(403).json({ message: "Access denied. You can only view your own tickets." });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching project ticket:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create new ticket (client only)
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
        }
      ]
    });

    res.status(201).json({
      message: "Project ticket created successfully",
      ticket: ticketWithAssociations
    });
  } catch (error) {
    console.error("Error creating project ticket:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update ticket
export const updateProjectTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, roleName } = req.user;

    const ticket = await ProjectTickets.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: "Project ticket not found" });
    }

    // Check if ticket is in final state - nobody can edit
    if (isFinalState(ticket)) {
      return res.status(400).json({ 
        message: "Cannot modify ticket. Project is completed or ticket is closed." 
      });
    }

    // Check permissions
    const isClient = roleName === 'client' && ticket.clientId === userId;
    const isEditor = roleName === 'editor' || roleName === 'admin';

    if (!isClient && !isEditor) {
      return res.status(403).json({ message: "Access denied." });
    }

    const updates = { ...req.body };

    // CLIENT LOGIC
    if (isClient) {
      if (!canClientEdit(ticket)) {
        return res.status(400).json({ 
          message: "You cannot edit this ticket in its current state." 
        });
      }

      // When ticket status is OPEN, client can edit basic fields
      if (ticket.ticketStatus === 'OPEN') {
        const allowedFields = ['subject', 'budget', 'description', 'priority', 'projectTitle', 'deadline'];
        Object.keys(updates).forEach(key => {
          if (!allowedFields.includes(key)) {
            delete updates[key];
          }
        });
      }
      
      // When project is REVIEW and ticket is IN_PROGRESS, client can change ticket status to RESOLVED
      else if (ticket.projectStatus === 'REVIEW' && ticket.ticketStatus === 'IN_PROGRESS') {
        // Client can only change ticketStatus to RESOLVED in this case
        const allowedFields = ['ticketStatus'];
        Object.keys(updates).forEach(key => {
          if (!allowedFields.includes(key)) {
            delete updates[key];
          }
        });
        
        // Validate that ticketStatus change is to RESOLVED
        if (updates.ticketStatus && updates.ticketStatus !== 'RESOLVED') {
          return res.status(400).json({ 
            message: "You can only mark ticket as RESOLVED when project is in review." 
          });
        }
      }
      
      // In any other state, client cannot make changes
      else {
        return res.status(400).json({ 
          message: "You cannot edit this ticket in its current state." 
        });
      }
    }

    // EDITOR LOGIC
    if (isEditor) {
      if (!canEditorEdit(ticket)) {
        return res.status(400).json({ 
          message: "Cannot edit ticket in final state." 
        });
      }

      // Editor can only edit projectStatus and editorId
      const allowedFields = ['projectStatus', 'editorId'];
      Object.keys(updates).forEach(key => {
        if (!allowedFields.includes(key)) {
          delete updates[key];
        }
      });

      // Editor projectStatus change validations
      if (updates.projectStatus) {
        const currentProjectStatus = ticket.projectStatus;
        const newProjectStatus = updates.projectStatus;

        // Cannot go back to PENDING once project has started
        if (newProjectStatus === 'PENDING' && currentProjectStatus !== 'PENDING') {
          return res.status(400).json({ 
            message: "Cannot change project status back to PENDING once project has started." 
          });
        }

        // Can only take project (PENDING -> IN_PROGRESS) if not assigned to another editor
        if (currentProjectStatus === 'PENDING' && newProjectStatus === 'IN_PROGRESS') {
          if (ticket.editorId && ticket.editorId !== userId) {
            return res.status(400).json({ 
              message: "This project is already assigned to another editor." 
            });
          }
          // Auto-assign editor when taking project
          updates.editorId = userId;
        }

        // IN_PROGRESS can go to REVIEW
        if (currentProjectStatus === 'IN_PROGRESS' && newProjectStatus === 'REVIEW') {
          // Allowed
        }

        // REVIEW can go back to IN_PROGRESS (for revisions)
        if (currentProjectStatus === 'REVIEW' && newProjectStatus === 'IN_PROGRESS') {
          // Allowed
        }

        // REVIEW can go to COMPLETED only if ticketStatus is RESOLVED
        if (currentProjectStatus === 'REVIEW' && newProjectStatus === 'COMPLETED') {
          if (ticket.ticketStatus !== 'RESOLVED') {
            return res.status(400).json({ 
              message: "Cannot complete project until client marks ticket as resolved." 
            });
          }
        }

        // Validate valid transitions
        const validTransitions = {
          'PENDING': ['IN_PROGRESS'],
          'IN_PROGRESS': ['REVIEW'],
          'REVIEW': ['IN_PROGRESS', 'COMPLETED'],
          'COMPLETED': [] // Cannot change from completed
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

    // Admin can always delete
    if (roleName === 'admin') {
      await ticket.destroy();
      return res.status(200).json({
        message: "Project ticket deleted successfully"
      });
    }

    // Client can only delete their own tickets and only when status is OPEN
    if (roleName === 'client' && ticket.clientId === userId) {
      if (!canClientDelete(ticket)) {
        return res.status(400).json({ 
          message: "You can only delete tickets with OPEN status." 
        });
      }
      
      await ticket.destroy();
      return res.status(200).json({
        message: "Project ticket deleted successfully"
      });
    }

    // Editor cannot delete tickets
    return res.status(403).json({ 
      message: "You don't have permission to delete this ticket." 
    });

  } catch (error) {
    console.error("Error deleting project ticket:", error);
    res.status(500).json({ message: error.message });
  }
};