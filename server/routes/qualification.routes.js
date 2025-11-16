import express from "express";
import * as ctrl from "../controllers/qualification.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/qualifications -> fetch all education entries for the admin view.
// POST /api/qualifications -> add a new entry (used by the EducationForm).
router.route("/api/qualifications")
    .get(requireAuth, ctrl.list) // Any authenticated user can view education entries.
    .post(requireAuth, requireAdmin, ctrl.create); // Admin only: create new entry.

// Operations on a single qualification document (edit/delete from the frontend list).
router.route("/api/qualifications/:id")
    .get(requireAuth, ctrl.read) // Authenticated read for a single entry.
    .put(requireAuth, requireAdmin, ctrl.update) // Only admins can update.
    .delete(requireAuth, requireAdmin, ctrl.remove); // Only admins can delete.

export default router;
