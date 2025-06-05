import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME || "crud_forustudio",
  process.env.DB_USER || "root", 
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: process.env.NODE_ENV === 'development' ? console.log : false, // Show SQL queries in development
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test connection
(async () => {
  try {
    await db.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
  }
})();

export default db;