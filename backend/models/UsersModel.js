import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define(
  "users",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto increment for userId
    },

    // Tambahkan field roleId sebagai foreign key
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roles", // nama table roles
        key: "roleId", // primary key di table roles
      },
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true, // Validate that the email is in a valid format
        len: [6, 100], // Email must be between 6 and 100 characters
        notEmpty: true, // Email cannot be empty
      },
    },

    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: [3, 50], // Username must be between 3 and 50 characters
        notEmpty: true, // Username cannot be empty
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100], // Password must be between 6 and 100 characters
        notEmpty: true, // Password cannot be empty
      },
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 100], // Full name must be between 3 and 100 characters
        notEmpty: true, // Full name cannot be empty
      },
    },

    gender: {
      type: DataTypes.ENUM("laki-laki", "perempuan", "-"),
      defaultValue: "-", // Default value is "-"
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[0-9]+$/, // Phone must contain only numbers
        len: [10, 13], // Phone must be between 10 and 13 characters
      },
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Default value is true
    },
  },
  {
    freezeTableName: true,
  }
);

export default Users;

(async () => {
  await db.sync();
})();
