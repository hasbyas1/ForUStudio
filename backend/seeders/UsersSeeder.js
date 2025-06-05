import Users from "../models/UsersModel.js";

const seedUsers = async () => {
  try {
    const userCount = await Users.count();

    if (userCount === 0) {
      console.log("Seeding users...");

      const users = [
        { roleId: 1, email: "admin@example.com", username: "adminGans", password: "admin123", fullName: "mr.Admin" },
        { roleId: 2, email: "editor@example.com", username: "editorGans", password: "editor123", fullName: "mr.Editor" },
        { roleId: 3, email: "client@example.com", username: "clientGans", password: "client123", fullName: "mr.Client" },
      ];

      await Users.bulkCreate(users);
      console.log("✅ Users seeded successfully!");
    } else {
      console.log("ℹ️ Users already exist, skipping seed.");
    }
  } catch (error) {
    console.error("❌ Error seeding users:", error.message);
  }
};

export default seedUsers;
