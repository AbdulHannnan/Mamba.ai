import express from 'express';
import { getUserProfile, getUserProjects, getUserProjectById, toggleProjectStatus } from '../controllers/UserController.js';
import { protect } from '../Middlewares/Auth.js';
import upload from '../configs/Multer.js';

const router = express.Router();

router.get('/credits', upload.array('images', 2), protect, getUserProfile);
router.get('/projects', protect, getUserProjects);
router.get('/projects/:id', protect, getUserProjectById);
router.post('/publish/:projectId', protect, toggleProjectStatus);

export default router;