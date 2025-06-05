import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./config/Database.js";
import UsersRoute from "./routes/UsersRoutes.js";
import RolesRoute from "./routes/RolesRoutes.js";
import AuthRoute from "./routes/AuthRoutes.js"; // ← Tambah import ini

import seedUsers from "./seeders/UsersSeeder.js";
import seedRoles from "./seeders/RolesSeeder.js";

import "./models/Associations.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(RolesRoute);
app.use(UsersRoute);
app.use(AuthRoute); // ← Tambah auth routes

// Default route
app.get("/", (req, res) => {
  res.json({ 
    message: "User Management API Server is running!",
    endpoints: {
      auth: "/auth/login, /auth/register, /auth/verify",
      users: "/users",
      roles: "/roles"
    }
  });
});

// Database sync dan seeding
(async () => {
  try {
    await db.sync(); // Sync database dan buat table
    console.log("✅ Database synchronized successfully!");
    
    // Jalankan seeder roles terlebih dahulu
    await seedRoles();
    console.log("✅ Roles seeded successfully!");
    
    // Jalankan seeder users setelah roles
    await seedUsers();
    console.log("✅ Users seeded successfully!");
    
  } catch (error) {
    console.error("❌ Database error:", error.message);
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}`);
  console.log(`🔐 Test with: admin@example.com / admin123`);
});