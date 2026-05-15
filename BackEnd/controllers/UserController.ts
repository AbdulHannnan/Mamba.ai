import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { prisma } from "../configs/prisma.js";

// Get USER Credits
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    res.status(200).json({ credits: user?.credits });
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

// Get all User Projects
export const getUserProjects = async (req: Request, res: Response) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const projects = await prisma.project.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ projects });
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

// Get project by ID
// Get project by ID
export const getUserProjectById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.auth();
    const id = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ project });
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
// Publish and unpublish project
// Publish and unpublish project
export const toggleProjectStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.auth();
    const projectId = req.params.projectId as string;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        isPublished: !project.isPublished,
      },
    });

    res.status(200).json({ project: updatedProject });
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.code || error.message });
  }
};