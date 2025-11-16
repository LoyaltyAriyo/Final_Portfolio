import express from "express";
import * as ctrl from "../controllers/project.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/api/projects")
    .get(ctrl.list)
    .post(requireAuth, requireAdmin, ctrl.create)
    .delete(requireAuth, requireAdmin, ctrl.removeAll);

router.route("/api/projects/:id")
    .get(ctrl.read)
    .put(requireAuth, requireAdmin, ctrl.update)
    .delete(requireAuth, requireAdmin, ctrl.remove);

export default router;
