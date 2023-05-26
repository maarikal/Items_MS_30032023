import express, {Request, Response} from 'express';
import {handleErrors} from './handleErrors';
import {PrismaClient} from '@prisma/client';
import fs from "fs";

const prisma = new PrismaClient();
const router = express.Router();


// Routes
router.get(
    '/',
    handleErrors(async (req: Request, res: Response) => {
        // get data from file.log from json format
        const data = fs.readFileSync('file.log', 'utf8');
        // parse data to json
        const dataJson = JSON.parse(data);
        console.log(dataJson);
        // return data
        return res.status(200).send(dataJson);


    })
);

export default router;

