// backend/index.js (Updated with ProjectFiles)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

import db from "./config/Database.js";
import UsersRoute from "./routes/UsersRoutes.js";
import RolesRoute from "./routes/RolesRoutes.js";
import AuthRoute from "./routes/AuthRoutes.js";
import ProjectTicketsRoute from "./routes/ProjectTicketsRoutes.js";
import ProjectFilesRoute from "./routes/ProjectFilesRoutes.js"; // ← Add import

import seedUsers from "./seeders/UsersSeeder.js";
import seedRoles from "./seeders/RolesSeeder.js";
import seedProjectTickets from "./seeders/ProjectTicketsSeeder.js";

import "./models/Associations.js"; // ← This will include ProjectFiles associations

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files middleware for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use(RolesRoute);
app.use(UsersRoute);
app.use(AuthRoute);
app.use(ProjectTicketsRoute);
app.use(ProjectFilesRoute); // ← Add project files routes

// Default route
app.get("/", (req, res) => {
  res.json({ 
    message: "ForUStudio API Server is running!",
    endpoints: {
      auth: "/auth/login, /auth/register, /auth/verify",
      users: "/users",
      roles: "/roles",
      projects: "/project-tickets, /dashboard/stats",
      files: "/project-tickets/:id/files, /project-files/:id/download"
    }
  });
});

// Database sync dan seeding
(async () => {
  try {
    // Sync all models including ProjectFiles
    await db.sync({ alter: true }); // Use alter: true to modify existing tables
    console.log("✅ Database synchronized successfully!");
    
    // Jalankan seeder roles terlebih dahulu
    await seedRoles();
    console.log("✅ Roles seeded successfully!");
    
    // Jalankan seeder users setelah roles
    await seedUsers();
    console.log("✅ Users seeded successfully!");
    
    // Jalankan seeder project tickets setelah users
    await seedProjectTickets();
    console.log("✅ Project tickets seeded successfully!");
    
    console.log("🎯 All database tables and sample data are ready!");
    console.log("📁 Project files system is ready!");
    
  } catch (error) {
    console.error("❌ Database error:", error.message);
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}`);
  console.log(`🔐 Test with: admin@example.com / admin123`);
  console.log(`📊 Dashboard available at: http://localhost:3000/dashboard`);
  console.log(`📋 Projects available at: http://localhost:3000/projects`);
  console.log(`📁 Files upload available at: http://localhost:3000/projects/:id/files`);
});