import express from "express";
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from "../controllers/UsersController.js";

const router = express.Router();

// ✅ GET Routes
router.get("/users", getUsers);
router.get("/users/:id", getUserById);

// ✅ POST Route
router.post("/users", createUser);

// ✅ PATCH Route untuk partial update (recommended)
router.patch("/users/:id", updateUser);

// ✅ PUT Route untuk full update (optional, bisa pakai salah satu)
router.put("/users/:id", updateUser);

// ✅ DELETE Route
router.delete("/users/:id", deleteUser);

export default router;