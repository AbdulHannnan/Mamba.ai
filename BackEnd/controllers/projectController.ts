import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { prisma } from "../configs/prisma.js";

export const createProject = async (req: Request, res: Response) => {
    try {

    }catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.code || error.message });
    }
}


export const createVideo = async (req: Request, res: Response) => {
    try {

    }catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.code || error.message });
    }
}

export const getAllPublishedProjects = async (req: Request, res: Response) => {
    try {

    }catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.code || error.message });
    }
}

export const deletProject = async (req: Request, res: Response) => {
    try {

    }catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.code || error.message });
    }
}