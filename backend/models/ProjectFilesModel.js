// backend/models/ProjectFilesModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const ProjectFiles = db.define('projectFiles', {
  fileId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  projectTicketId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projectTickets',
      key: 'projectTicketId'
    }
  },
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  fileType: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  fileSize: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  fileCategory: {
    type: DataTypes.ENUM('INPUT', 'OUTPUT'),
    allowNull: false,
    defaultValue: 'INPUT'
  },
  uploadedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'userId'
    }
  },
  uploadedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'uploadedAt',
  updatedAt: false
});

export default ProjectFiles;