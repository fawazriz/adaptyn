import { Router } from "express";
import { createResume, deleteResume, getAllResumes, getResumeById, updateResume } from "../controllers/resumesController";

const resumesRouter = Router();

resumesRouter.get("/", getAllResumes);
resumesRouter.get("/:id", getResumeById);
resumesRouter.post("/", createResume);
resumesRouter.put("/:id", updateResume);
resumesRouter.delete("/:id", deleteResume);

export default resumesRouter;