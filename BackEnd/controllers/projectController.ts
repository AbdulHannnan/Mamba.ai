import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { prisma } from "../configs/prisma.js"; 

export const createProject = async (req: Request, res: Response) => {

    let projectTemplate: string;
    const { userId } = req.auth();
    let isCreditDeducted = false;

    const {name="Untitled Project", productName, productDescription, userPrompt , aspectRatio , targetLeangth = 5 } = req.body;

    const images: any  = req.files;
    if (images && images.length > 2 || !productName) {
        return res.status(400).json({ message: "Please provide a product name and up to 2 images." });
 }

 const user = await prisma.user.findUnique({ where: { id: userId } });
 if (!user || user.credits < 5) {
    return res.status(401).json({ message: "User not found or insufficient credits." });
 }else{
    // deduct creadit for user generateion
        await prisma.user.update({
            where: { id: userId },
            data: { credits: user.credits - 5 }
        }).then(() => {
            isCreditDeducted = true
        });
 }
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