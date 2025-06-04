import { Sequelize } from "sequelize";

const db = new Sequelize("crud_forustudio", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
