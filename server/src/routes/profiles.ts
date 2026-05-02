import { Router } from "express";
import { getMyProfile, updateMyProfile, deleteMyProfile } from "../controllers/profilesController";

const profilesRouter = Router();

profilesRouter.get("/", getMyProfile);
profilesRouter.put("/", updateMyProfile);
profilesRouter.delete("/", deleteMyProfile);

export default profilesRouter;