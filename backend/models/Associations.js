import Users from "./UsersModel.js";
import Roles from "./RolesModel.js";

// Define associations
Roles.hasMany(Users, {
  sourceKey: "roleId",
  foreignKey: "roleId",
  as: "users",
});

Users.belongsTo(Roles, {
  sourceKey: "roleId",
  foreignKey: "roleId",
  as: "role",
});

export { Users, Roles };
