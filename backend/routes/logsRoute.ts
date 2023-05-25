import express, {NextFunction, Request, Response} from 'express';
import {handleErrors} from './handleErrors';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

/*
// Routes
router.get(
    '/',
    handleErrors(async (req: Request, res: Response) => {
        // Get all logs from database using Prisma
        const logs = await prisma.log.findMany();

        // Return logs
        return res.status(200).send(logs);
    })
);

router.post(
    '/',
    handleErrors(async (req: Request, res: Response) => {
        console.log("Läks router-post triggeris")
        // If anything changes in Item table then add a new log entry
        // Save log to database using Prisma
        const log = await prisma.log.create({
            data: {
                itemId: req.body.itemId,
                action: req.body.action,
                userId: req.body.userId,
                createdAt: new Date(),
            },
        });
            return res.status(201).send(log);
        }
    ));

import logger from '../logger';

/!*async function createUser(name: string, email: string, password: string) {
    try {
        const user = await prisma.item.create({
            data: {
                name: name,
                email: email,
                password: password,
            }
        });

        logger.info('User created', { user });
    } catch (error) {
        logger.error('Error creating user', { error });
    }
}*!/


// Create event listeners for before and after database actions
// @ts-ignore
prisma.$on("before", (event) => {
    // @ts-ignore
    logger.info(`Before ${event.model}.${event.action}`, { data: event.args.data });
});

// @ts-ignore
prisma.$on('after', (event) => {
    // @ts-ignore
    logger.info(`After ${event.model}.${event.action}`, { data: event.result });
});
*/

export default router;

