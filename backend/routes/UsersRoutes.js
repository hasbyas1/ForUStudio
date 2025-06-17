// backend/routes/UsersRoutes.js (Updated)
import express from "express";
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from "../controllers/UsersController.js";
import { 
  authenticateToken, 
  requireAdmin, 
  requireOwnerOrAdmin 
} from "../middleware/AuthMiddleware.js";

const router = express.Router();

// ✅ GET Routes
router.get("/users", authenticateToken, getUsers);
router.get("/users/:id", authenticateToken, requireOwnerOrAdmin, getUserById);

// ✅ POST Route (Admin only for creating users)
router.post("/users", authenticateToken, requireAdmin, createUser);

// ✅ PATCH Route untuk partial update (Owner or Admin)
router.patch("/users/:id", authenticateToken, requireOwnerOrAdmin, updateUser);

// ✅ PUT Route untuk full update (Owner or Admin)
router.put("/users/:id", authenticateToken, requireOwnerOrAdmin, updateUser);

// ✅ DELETE Route (Admin only)
router.delete("/users/:id", authenticateToken, requireAdmin, deleteUser);

export default router;