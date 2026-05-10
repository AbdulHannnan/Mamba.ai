import {request , response} from "express";

declare global {
    namespace Express {
        interface Request {
            auth: () => {userId: string | null ; has: (permission: any)=> boolean};
            plan?: string;
            file: any;
        }
}
}