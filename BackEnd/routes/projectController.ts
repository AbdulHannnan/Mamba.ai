import express  from "express";

const projectRouter = express.Router();

import { createProject, createVideo, getAllPublishedProjects, deletProject } from "../controllers/projectController.js";
import { protect } from "../Middlewares/Auth.js";

projectRouter.post("/create", protect , createProject);
projectRouter.post("/create-video", protect, createVideo);
projectRouter.get("/published", getAllPublishedProjects);
projectRouter.delete("/:projectId", protect, deletProject);


export default projectRouter;
