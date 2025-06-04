import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import bcrypt from "bcrypt";

const { DataTypes, Op } = Sequelize;

const Users = db.define(
  "users",
  {
    userId: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
      unique: true,
      // Tambahkan default value generator
      defaultValue: async function() {
        // Ini akan dipanggil jika userId tidak disediakan
        return null; // Return null agar hook bisa handle
      }
    },

    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      references: {
        model: "roles",
        key: "roleId",
      },
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        len: [6, 100],
        notEmpty: true,
      },
    },

    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: [3, 50],
        notEmpty: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100],
        notEmpty: true,
      },
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 100],
        notEmpty: true,
      },
    },

    gender: {
      type: DataTypes.ENUM("laki-laki", "perempuan", "-"),
      defaultValue: "-",
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[0-9]+$/,
        len: [10, 13],
      },
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
    hooks: {
      beforeValidate: async (user, options) => {
        console.log("🔧 beforeValidate hook triggered for user:", user.email);
        
        // Generate userId sebelum validasi
        if (!user.userId) {
          try {
            // Set default roleId jika tidak ada
            if (!user.roleId) {
              user.roleId = 3;
            }

            console.log("🔄 Generating userId for roleId:", user.roleId);
            
            // 1. Tentukan prefix berdasarkan roleId
            const getRolePrefix = (roleId) => {
              switch (parseInt(roleId)) {
                case 1:
                  return "A"; // Admin
                case 2:
                  return "E"; // Editor
                case 3:
                  return "C"; // Client
                default:
                  return "C"; // Default ke client
              }
            };

            const prefix = getRolePrefix(user.roleId);
            console.log("🏷️ Using prefix:", prefix);

            // 2. Cari user terakhir dengan prefix yang sama
            const lastUser = await Users.findOne({
              where: {
                userId: {
                  [Op.like]: `${prefix}-%`
                }
              },
              order: [["userId", "DESC"]],
              attributes: ["userId"],
              raw: true
            });

            let nextNumber = 1;

            // 3. Extract number dari userId terakhir
            if (lastUser && lastUser.userId) {
              console.log("📋 Last user found:", lastUser.userId);
              const parts = lastUser.userId.split("-");
              if (parts.length === 2) {
                const lastNumber = parseInt(parts[1]);
                if (!isNaN(lastNumber)) {
                  nextNumber = lastNumber + 1;
                }
              }
            } else {
              console.log("📋 No previous user found with prefix:", prefix);
            }

            // 4. Generate userId dengan format: PREFIX-0001
            user.userId = `${prefix}-${nextNumber.toString().padStart(4, "0")}`;
            
            console.log(`✅ Generated userId: ${user.userId} for roleId: ${user.roleId}`);

          } catch (error) {
            console.error("❌ Error generating userId:", error);
            // Fallback: generate random userId jika ada error
            const randomId = Math.floor(Math.random() * 9999) + 1;
            const fallbackPrefix = user.roleId === 1 ? "A" : user.roleId === 2 ? "E" : "C";
            user.userId = `${fallbackPrefix}-${randomId.toString().padStart(4, "0")}`;
            console.log(`🔄 Fallback userId generated: ${user.userId}`);
          }
        }
      },
      
      beforeCreate: async (user, options) => {
        console.log("🔐 beforeCreate hook - hashing password for:", user.email);
        
        // Hash password sebelum save
        if (user.password && !user.password.startsWith('$2b$')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          console.log("✅ Password hashed successfully");
        }
      },
      
      beforeUpdate: async (user, options) => {
        // Hash password jika berubah
        if (user.changed('password') && !user.password.startsWith('$2b$')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    },
  }
);

export default Users;

// Sync database
(async () => {
  try {
    await db.sync();
    console.log("✅ Users table synchronized");
  } catch (error) {
    console.error("❌ Error syncing Users table:", error);
  }
})();