import Users from "../models/UsersModelOnHold.js";

const seedUsers = async () => {
  try {
    const userCount = await Users.count();

    if (userCount === 0) {
      console.log("🌱 Starting users seeding...");

      const users = [
        {
          roleId: 1,
          email: "admin@example.com",
          username: "adminGans",
          password: "admin123",
          fullName: "mr.Admin",
          isActive: true,
        },
        {
          roleId: 2,
          email: "editor@example.com",
          username: "editorGans",
          password: "editor123",
          fullName: "mr.Editor",
          isActive: true,
        },
        {
          roleId: 3,
          email: "client@example.com",
          username: "clientGans",
          password: "client123",
          fullName: "mr.Client",
          isActive: true,
        },
      ];

      // Create users satu per satu untuk trigger hooks
      for (const userData of users) {
        try {
          console.log(`\n🔄 Creating user: ${userData.email} with roleId: ${userData.roleId}`);
          
          // Buat user baru (jangan include userId, biar auto-generate)
          const newUser = await Users.create({
            roleId: userData.roleId,
            email: userData.email,
            username: userData.username,
            password: userData.password,
            fullName: userData.fullName,
            isActive: userData.isActive
          });
          
          console.log(`✅ User created successfully:`);
          console.log(`   - userId: ${newUser.userId}`);
          console.log(`   - email: ${newUser.email}`);
          console.log(`   - roleId: ${newUser.roleId}`);
          
        } catch (userError) {
          console.error(`\n❌ Failed to create user ${userData.email}:`);
          console.error(`   Error: ${userError.message}`);
          
          // Debug: Print validation errors jika ada
          if (userError.errors) {
            console.error(`   Validation errors:`);
            userError.errors.forEach(err => {
              console.error(`   - ${err.path}: ${err.message}`);
            });
          }
          
          // Debug: Print stack trace untuk error detail
          if (process.env.NODE_ENV === 'development') {
            console.error(`   Stack trace:`, userError.stack);
          }
        }
      }

      console.log("\n✅ Users seeding completed!");
      
      // Tampilkan hasil seeding
      const createdUsers = await Users.findAll({
        attributes: ['userId', 'email', 'roleId', 'username'],
        raw: true
      });
      
      console.log("\n📊 Created users summary:");
      console.table(createdUsers);
      
    } else {
      console.log("ℹ️ Users already exist, skipping seed.");
      
      // Tampilkan existing users
      const existingUsers = await Users.findAll({
        attributes: ['userId', 'email', 'roleId', 'username'],
        raw: true
      });
      
      console.log("\n📊 Existing users:");
      console.table(existingUsers);
    }
  } catch (error) {
    console.error("❌ Error seeding users:", error.message);
    console.error("Stack trace:", error.stack);
  }
};

export default seedUsers;