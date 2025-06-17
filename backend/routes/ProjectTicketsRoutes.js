// backend/routes/ProjectTicketsRoutes.js
import express from "express";
import { 
  getDashboardStats,
  getProjectTickets, 
  getProjectTicketById, 
  createProjectTicket, 
  updateProjectTicket, 
  deleteProjectTicket 
} from "../controllers/ProjectTicketsController.js";
import { authenticateToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Dashboard stats (available to all authenticated users)
router.get("/dashboard/stats", getDashboardStats);

// GET Routes
router.get("/project-tickets", getProjectTickets);
router.get("/project-tickets/:id", getProjectTicketById);

// POST Route (create new ticket)
router.post("/project-tickets", createProjectTicket);

// PATCH Route (update ticket)
router.patch("/project-tickets/:id", updateProjectTicket);

// DELETE Route (admin only - handled in controller)
router.delete("/project-tickets/:id", deleteProjectTicket);

export default router;