import express  from "express";

const projectRouter = express.Router();

import { createProject, createVideo, getAllPublishedProjects, deletProject } from "../controllers/projectController.js";
import { protect } from "../Middlewares/Auth.js";
import upload from "../configs/Multer.js";

projectRouter.post("/create", protect, upload.array("images", 2), createProject);
projectRouter.post("/video", protect, createVideo);
projectRouter.get("/published", getAllPublishedProjects);
projectRouter.delete("/:projectId", protect, deletProject);


export default projectRouter;
