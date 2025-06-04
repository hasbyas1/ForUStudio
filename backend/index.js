import express from "express";
import cors from "cors";

import db from "./config/Database.js";
import UsersRoute from "./routes/UsersRoutes.js";
import RolesRoute from "./routes/RolesRoutes.js";

import seedUsers from "./seeders/UsersSeeder.js";
import seedRoles from "./seeders/RolesSeeder.js";

import "./models/Associations.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(RolesRoute);
app.use(UsersRoute);

// Database sync dan seeding
(async () => {
  try {
    await db.sync(); // Sync database dan buat table
    await seedRoles(); // Jalankan seeder roles
    console.log("Database synchronized and Roles seeded successfully!");
  } catch (error) {
    console.error("Database error:", error.message);
  }

  try {
    await db.sync(); // Sync database dan buat table
    await seedUsers(); // Jalankan seeder roles
    console.log("Database synchronized and Users seeded successfully!");
  } catch (error) {
    console.error("Database error:", error.message);
  }
})();

app.listen(5000, () => console.log("Server is running on port 5000"));
