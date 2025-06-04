import express from "express";
import { getRoles, getRoleById, getRoleByName, createRole, updateRole, deleteRole } from "../controllers/RolesController.js";

const router = express.Router();

router.get("/roles", getRoles);
router.get("/roles/:id", getRoleById);
router.get("/roles/name/:roleName", getRoleByName);
router.post("/roles", createRole);
router.put("/roles/:id", updateRole);
router.delete("/roles/:id", deleteRole);

export default router;
