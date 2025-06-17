// backend/models/ProjectTicketsModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UsersModel.js";

const { DataTypes } = Sequelize;

const ProjectTickets = db.define(
  "ProjectTickets",
  {
    projectTicketId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.INTEGER, // ← Changed from STRING to INTEGER
      allowNull: false,
      references: {
        model: Users,
        key: 'userId'
      }
    },
    editorId: {
      type: DataTypes.INTEGER, // ← Changed from STRING to INTEGER
      allowNull: true,
      references: {
        model: Users,
        key: 'userId'
      }
    },
    subject: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ticketStatus: {
      type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'),
      allowNull: false,
      defaultValue: 'OPEN'
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
      allowNull: false,
      defaultValue: 'MEDIUM'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    projectTitle: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    takenAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    projectStatus: {
      type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: true, // This will handle createdAt and updatedAt automatically
    hooks: {
      beforeUpdate: async (ticket, options) => {
        // Auto update ticketStatus when projectStatus changes
        if (ticket.changed('projectStatus')) {
          if (ticket.projectStatus === 'PENDING' && ticket.ticketStatus !== 'OPEN') {
            ticket.ticketStatus = 'OPEN';
          } else if (ticket.projectStatus === 'IN_PROGRESS' && ticket.ticketStatus !== 'IN_PROGRESS') {
            ticket.ticketStatus = 'IN_PROGRESS';
          } else if (ticket.projectStatus === 'COMPLETED') {
            ticket.ticketStatus = 'CLOSED';
          }
        }

        // Auto update projectStatus when ticketStatus changes to OPEN
        if (ticket.changed('ticketStatus') && ticket.ticketStatus === 'OPEN') {
          ticket.projectStatus = 'PENDING';
        }

        // Set takenAt when projectStatus changes to IN_PROGRESS
        if (ticket.changed('projectStatus') && ticket.projectStatus === 'IN_PROGRESS' && !ticket.takenAt) {
          ticket.takenAt = new Date();
        }

        // Set resolvedAt when ticketStatus changes to RESOLVED
        if (ticket.changed('ticketStatus') && ticket.ticketStatus === 'RESOLVED' && !ticket.resolvedAt) {
          ticket.resolvedAt = new Date();
        }
      }
    }
  }
);

export default ProjectTickets;