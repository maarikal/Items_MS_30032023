import express, {Request, Response} from 'express';
import {handleErrors} from './handleErrors';
import {PrismaClient} from '@prisma/client';
import fs from "fs";
import {IRequestWithSession} from "../function";

const prisma = new PrismaClient();
const router = express.Router();


function line() {
    return JSON.stringify({
        timestamp: new Date().toISOString(),
        message: 'hello world'
    })
}

// Routes
router.get(
    '/',
    // logs get using handleErrors with IRequest and data is in file.log
    (async (req: Request, res: Response) => {
        const logs = fs.readFileSync('file.log', 'utf8');
        const data = logs
            .split('\n')
            .filter(Boolean)
        res.status(200).json({data});
    })
);
// res.status(200).json({data});

export default router;

