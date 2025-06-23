// backend/models/Associations.js (Updated)
import Users from "./UsersModel.js";
import Roles from "./RolesModel.js";
import ProjectTickets from "./ProjectTicketsModel.js";
import ProjectFiles from "./ProjectFilesModel.js";
// import Transactions from "./TransactionsModel.js";      // Akan diimport nanti

// ===== USERS - ROLES ASSOCIATIONS =====
// Many-to-One: Users belongs to Roles (1 User has 1 Role)
Users.belongsTo(Roles, {
  foreignKey: "roleId",
  as: "role"
});

// One-to-Many: Roles has many Users
Roles.hasMany(Users, {
  foreignKey: "roleId",
  as: "users"
});

// ===== PROJECTTICKETS - USERS ASSOCIATIONS =====
// Many-to-One: ProjectTickets belongs to Users (Client)
ProjectTickets.belongsTo(Users, {
  foreignKey: "clientId",
  as: "client"
});

// Many-to-One: ProjectTickets belongs to Users (Editor) - Optional
ProjectTickets.belongsTo(Users, {
  foreignKey: "editorId",
  as: "editor"
});

// One-to-Many: Users has many ProjectTickets as Client
Users.hasMany(ProjectTickets, {
  foreignKey: "clientId",
  as: "clientTickets"
});

// One-to-Many: Users has many ProjectTickets as Editor
Users.hasMany(ProjectTickets, {
  foreignKey: "editorId",
  as: "editorTickets"
});

// ===== PROJECTFILES - PROJECTTICKETS ASSOCIATIONS =====
// Many-to-One: ProjectFiles belongs to ProjectTickets
ProjectFiles.belongsTo(ProjectTickets, {
  foreignKey: "projectTicketId",
  as: "projectTicket"
});

// One-to-Many: ProjectTickets has many ProjectFiles
ProjectTickets.hasMany(ProjectFiles, {
  foreignKey: "projectTicketId",
  as: "projectFiles"
});

// ===== PROJECTFILES - USERS ASSOCIATIONS =====
// Many-to-One: ProjectFiles belongs to Users (Uploader)
ProjectFiles.belongsTo(Users, {
  foreignKey: "uploadedBy",
  as: "uploader"
});

// One-to-Many: Users has many ProjectFiles (as uploader)
Users.hasMany(ProjectFiles, {
  foreignKey: "uploadedBy",
  as: "uploadedFiles"
});

// ===== TRANSACTIONS - PROJECTTICKETS ASSOCIATIONS =====
// Akan diimplementasikan nanti ketika model Transactions dibuat
/*
// Many-to-One: Transactions belongs to ProjectTickets
Transactions.belongsTo(ProjectTickets, {
  foreignKey: "projectTicketId",
  as: "projectTicket"
});

// One-to-Many: ProjectTickets has many Transactions
ProjectTickets.hasMany(Transactions, {
  foreignKey: "projectTicketId",
  as: "transactions"
});
*/

console.log("✅ Database associations have been set up successfully!");
console.log("📋 Current associations:");
console.log("   - Users ↔ Roles (Many-to-One)");
console.log("   - ProjectTickets ↔ Users (Many-to-One for client and editor)");
console.log("   - ProjectFiles ↔ ProjectTickets (Many-to-One)");
console.log("   - ProjectFiles ↔ Users (Many-to-One for uploader)");
console.log("💡 Future associations (when models are created):");
console.log("   - Transactions ↔ ProjectTickets (Many-to-One)");