import { Router } from "express";
import { getProfileById, updateProfile, deleteProfile } from "../controllers/profilesController";

const profilesRouter = Router();

profilesRouter.get("/:id", getProfileById);
profilesRouter.put("/:id", updateProfile);
profilesRouter.delete("/:id", deleteProfile);

export default profilesRouter;