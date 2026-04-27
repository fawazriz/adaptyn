import { Router } from "express";
import {
    getAllApplications,
    getApplicationById,
    getApplicationByCategory,
    createApplication,
    updateApplication,
    deleteApplication,
} from "../controllers/applicationsController";

const applicationRouter = Router();

applicationRouter.get("/", getAllApplications);
applicationRouter.get("/:id", getApplicationById);
applicationRouter.get("/category/:category", getApplicationByCategory);
applicationRouter.post("/", createApplication);
applicationRouter.put("/:id", updateApplication);
applicationRouter.delete("/:id", deleteApplication);

export default applicationRouter;