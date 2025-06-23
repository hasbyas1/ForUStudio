// backend/routes/ProjectTicketsRoutes.js (Updated with file upload)
import express from "express";
import { 
  getDashboardStats,
  getProjectTickets, 
  getProjectTicketById, 
  createProjectTicket, 
  updateProjectTicket, 
  deleteProjectTicket,
  uploadForTicketCreation
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

// POST Route (create new ticket with optional file upload)
router.post("/project-tickets", 
  uploadForTicketCreation.array('files', 10), // Allow up to 10 files
  createProjectTicket
);

// PATCH Route (update ticket)
router.patch("/project-tickets/:id", updateProjectTicket);

// DELETE Route (admin/client - handled in controller)
router.delete("/project-tickets/:id", deleteProjectTicket);

export default router;