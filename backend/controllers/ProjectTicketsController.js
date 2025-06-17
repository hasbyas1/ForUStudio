// backend/controllers/ProjectTicketsController.js
import ProjectTickets from "../models/ProjectTicketsModel.js";
import Users from "../models/UsersModel.js";
import Roles from "../models/RolesModel.js";
import { Op } from "sequelize";

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

    // Check permissions
    if (roleName === 'client' && ticket.clientId !== userId) {
      return res.status(403).json({ message: "Access denied. You can only edit your own tickets." });
    }

    const updates = { ...req.body };

    // Role-based field restrictions
    if (roleName === 'client') {
      // Client can edit: subject, budget, description, priority, ticketStatus, projectTitle, deadline
      const allowedFields = ['subject', 'budget', 'description', 'priority', 'ticketStatus', 'projectTitle', 'deadline'];
      Object.keys(updates).forEach(key => {
        if (!allowedFields.includes(key)) {
          delete updates[key];
        }
      });

      // Business logic: Client cannot change ticketStatus to OPEN if projectStatus is IN_PROGRESS
      if (updates.ticketStatus === 'OPEN' && ticket.projectStatus === 'IN_PROGRESS') {
        return res.status(400).json({ 
          message: "Cannot change ticket status to OPEN when project is in progress" 
        });
      }
    } else if (roleName === 'editor' || roleName === 'admin') {
      // Editor can edit: ticketStatus (limited), projectStatus, takenAt, updatedAt
      const allowedFields = ['ticketStatus', 'projectStatus', 'editorId'];
      Object.keys(updates).forEach(key => {
        if (!allowedFields.includes(key)) {
          delete updates[key];
        }
      });

      // Editor ticketStatus restrictions
      if (updates.ticketStatus && !['IN_PROGRESS', 'CLOSED'].includes(updates.ticketStatus)) {
        return res.status(400).json({ 
          message: "Editors can only set ticket status to IN_PROGRESS or CLOSED" 
        });
      }

      // Business logic: Editor cannot change projectStatus back to PENDING if it's IN_PROGRESS
      if (updates.projectStatus === 'PENDING' && ticket.projectStatus === 'IN_PROGRESS') {
        return res.status(400).json({ 
          message: "Cannot change project status back to PENDING once it's in progress" 
        });
      }

      // Auto-assign editor when taking project
      if (updates.projectStatus === 'IN_PROGRESS' && !ticket.editorId) {
        updates.editorId = userId;
      }
    }

    // Set resolvedAt when ticketStatus changes to RESOLVED
    if (updates.ticketStatus === 'RESOLVED') {
      updates.resolvedAt = new Date();
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

// Delete ticket (admin only)
export const deleteProjectTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName } = req.user;

    if (roleName !== 'admin') {
      return res.status(403).json({ message: "Only administrators can delete tickets" });
    }

    const ticket = await ProjectTickets.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: "Project ticket not found" });
    }

    await ticket.destroy();

    res.status(200).json({
      message: "Project ticket deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting project ticket:", error);
    res.status(500).json({ message: error.message });
  }
};