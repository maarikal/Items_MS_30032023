import express, {Request, Response} from 'express';
import {handleErrors} from './handleErrors';
import {PrismaClient} from '@prisma/client';
import logger from "../logger";

const prisma = new PrismaClient();
const router = express.Router();

// Routes
router.get(
    '/',
    handleErrors(async (req: Request, res: Response) => {
        // Get all items from database using Prisma
        const items = await prisma.item.findMany();

        // Return items
        return res.status(200).send(items);
    })
);

router.post(
    '/',
    handleErrors(async (req: Request, res: Response) => {
        // Save item to database using Prisma
        const item = await prisma.item.create({
            data: {
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
            },
        });
        console.log('backend: ', item)

        // Log item creation
        logger.info('Item created', {item});

        // Return item
        return res.status(201).send(item);
    }))

// Add route to update item in database using PUT http://localhost:3000/items?id=71
router.put(
    '/',
    handleErrors(async (req: Request, res: Response) => {
            // Update item in database using Prisma
            const item = await prisma.item.update({
                where: {
                    id: Number(req.query.id),
                },
                data: {
                    name: req.body.name,
                    description: req.body.description,
                    image: req.body.image,
                },
            });
            // Log item update
            logger.info('Item updated', {item});

            // Return item
            return res.status(200).send(item);
        }
    ));

// add route to delete item from database
router.delete(
    '/',
    handleErrors(async (req: Request, res: Response) => {
        // Delete item from database using Prisma
        const item = await prisma.item.delete({
            where: {
                id: Number(req.query.id),
            },
        });
        // Log item deletion
        logger.info('Item deleted', {item});

        // Return item
        return res.status(200).send(item);
    }));

export default router;
