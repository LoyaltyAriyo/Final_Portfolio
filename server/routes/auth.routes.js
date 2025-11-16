import express from "express";
import authCtrl from "../controllers/auth.controller.js";
const router = express.Router();

router
  .route("/auth/signin")
  .post(authCtrl.signin); // Handles POST /auth/signin by delegating to the controller logic.

router
  .route("/auth/signout")
  .get(authCtrl.signout); // GET /auth/signout clears the cookie and tells the client to drop its stored JWT.
export default router;
