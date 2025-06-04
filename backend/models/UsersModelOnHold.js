// import Users from "../models/UsersModel.js";

// const seedUsers = async () => {
//   try {
//     const userCount = await Users.count();

//     if (userCount === 0) {
//       console.log("Seeding users...");

//       const users = [
//         {
//           roleId: 1,
//           email: "admin@example.com",
//           username: "adminGans",
//           password: "admin123",
//           fullName: "Admin User",
//           gender: "laki-laki",
//           isActive: true,
//         },
//         {
//           roleId: 2,
//           email: "editor@example.com",
//           username: "editorGans",
//           password: "editor123",
//           fullName: "Editor User",
//           gender: "laki-laki",
//           isActive: true,
//         },
//         {
//           roleId: 3,
//           email: "client@example.com",
//           username: "clientGans",
//           password: "client123",
//           fullName: "Client User",
//           gender: "laki-laki",
//           isActive: true,
//         },
//         {
//           roleId: 3,
//           email: "client2@example.com",
//           username: "client2Gans",
//           password: "client123",
//           fullName: "Client User 2",
//           gender: "perempuan",
//           isActive: true,
//         },
//       ];

//       // Gunakan create individual untuk trigger hooks (BUKAN bulkCreate)
//       for (const userData of users) {
//         try {
//           console.log(`🔄 Creating user: ${userData.email} with roleId: ${userData.roleId}`);
//           const newUser = await Users.create(userData);
//           console.log(`✅ User created: ${newUser.userId} (${userData.email})`);
//         } catch (userError) {
//           console.error(`❌ Failed to create user ${userData.email}:`, userError.message);
//           console.error("Full error:", userError);
//         }
//       }

//       console.log("✅ Users seeding completed!");
//     } else {
//       console.log("ℹ️ Users already exist, skipping seed.");
//     }
//   } catch (error) {
//     console.error("❌ Error seeding users:", error.message);
//   }
// };

// export default seedUsers;
