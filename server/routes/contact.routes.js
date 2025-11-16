import express from "express";
import * as ctrl from "../controllers/contact.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/contacts -> list all contact messages (used by the admin screens).
// POST /api/contacts -> create a new contact entry submitted from the React form.
router.route("/api/contacts")
    .get(requireAuth, ctrl.list) // Authenticated users (e.g., admin dashboard) can read messages.
    .post(ctrl.create); // Public endpoint so the public contact form can submit.

// Individual document operations for Contact (read/update/delete).
router.route("/api/contacts/:id")
    .get(requireAuth, ctrl.read)
    .put(requireAuth, requireAdmin, ctrl.update) // Only admins can modify entries.
    .delete(requireAuth, requireAdmin, ctrl.remove); // Only admins can delete entries.

export default router;
