// backend/routes/ProjectFilesRoutes.js
import express from "express";
import { 
  getProjectFiles,
  uploadProjectFiles,
  downloadProjectFile,
  deleteProjectFile,
  upload
} from "../controllers/ProjectFilesController.js";
import { authenticateToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET all files for a project ticket
router.get("/project-tickets/:projectTicketId/files", getProjectFiles);

// POST upload files to a project ticket
router.post("/project-tickets/:projectTicketId/files", 
  upload.array('files', 10), // Allow up to 10 files at once
  uploadProjectFiles
);

// GET download a specific file
router.get("/project-files/:fileId/download", downloadProjectFile);

// DELETE a specific file
router.delete("/project-files/:fileId", deleteProjectFile);

export default router;