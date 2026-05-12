import './configs/instrument.mjs';
import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import { clerkMiddleware } from '@clerk/express'
import clerkwebhook from "./controllers/clerk.js";

import * as Sentry from "@sentry/node"

const app = express();

// Middleware
app.use(cors())

app.post('/api/clerk',  express.raw({ type: 'application/json' }), clerkwebhook)

app.use(express.json());
app.use(clerkMiddleware()); 

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});


// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});