import Roles from "../models/RolesModel.js";

const seedRoles = async () => {
  try {
    const roleCount = await Roles.count();

    if (roleCount === 0) {
      console.log("Seeding roles...");

      const roles = [
        { roleName: "admin", description: "System administrator" },
        { roleName: "editor", description: "Content Editor" },
        { roleName: "client", description: "Regular client user" },
      ];

      await Roles.bulkCreate(roles);
      console.log("✅ Roles seeded successfully!");
    } else {
      console.log("ℹ️ Roles already exist, skipping seed.");
    }
  } catch (error) {
    console.error("❌ Error seeding roles:", error.message);
  }
};

export default seedRoles;
