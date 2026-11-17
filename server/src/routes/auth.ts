import { Router } from "express";
import { register, login, logout } from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/session", requireAuth, (_req, res) => res.status(204).end());

export default authRouter;
