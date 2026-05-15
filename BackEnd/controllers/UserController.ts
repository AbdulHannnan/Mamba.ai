import {Request, Response} from 'express';
import * as Sentry from "@sentry/node";


// Get USER Credits 
export const getUserProfile = async (req: Request, res: Response) => {
     try {
        
    }catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({message: error.code || error.message});
    }
}


// Get all User Projects

export const getUserProjects = async (req: Request, res: Response) => {
     try {
        
    }catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({message: error.code || error.message});
    }
}


// get projects by ID

export const getUserProjectById = async (req: Request, res: Response) => {
     try {
        
    }catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({message: error.code || error.message});
    }
}


// publish and unpublish project
export const toggleProjectStatus = async (req: Request, res: Response) => {
     try {
        
    }catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({message: error.code || error.message});
    }
}