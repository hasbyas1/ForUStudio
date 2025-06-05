import bcrypt from "bcryptjs";
import Users from "../models/UsersModel.js";

const seedUsers = async () => {
  try {
    const userCount = await Users.count();

    if (userCount === 0) {
      console.log("Seeding users...");

      // Hash passwords untuk semua users
      const hashedAdminPassword = await bcrypt.hash("admin123", 10);
      const hashedEditorPassword = await bcrypt.hash("editor123", 10);
      const hashedClientPassword = await bcrypt.hash("client123", 10);

      const users = [
        { 
          roleId: 1, 
          email: "admin@example.com", 
          username: "adminGans", 
          password: hashedAdminPassword, 
          fullName: "mr.Admin",
          gender: "-",
          isActive: true
        },
        { 
          roleId: 2, 
          email: "editor@example.com", 
          username: "editorGans", 
          password: hashedEditorPassword, 
          fullName: "mr.Editor",
          gender: "-",
          isActive: true
        },
        { 
          roleId: 3, 
          email: "client@example.com", 
          username: "clientGans", 
          password: hashedClientPassword, 
          fullName: "mr.Client",
          gender: "-",
          isActive: true
        },
      ];

      await Users.bulkCreate(users);
      console.log("✅ Users seeded successfully!");
      console.log("📧 Test users created:");
      console.log("   Admin: admin@example.com / admin123");
      console.log("   Editor: editor@example.com / editor123");
      console.log("   Client: client@example.com / client123");
    } else {
      console.log("ℹ️ Users already exist, skipping seed.");
    }
  } catch (error) {
    console.error("❌ Error seeding users:", error.message);
  }
};

export default seedUsers;