import express, {Request, Response} from 'express';
import {handleErrors} from './handleErrors';
import {PrismaClient} from '@prisma/client';
import {expressWs} from "../index";

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

        // send a 'addItem' event with the new item data
        // @ts-ignore
        expressWs.getWss().clients
            .forEach((client: any) => client
                .send(
                    JSON.stringify({
                        type: 'addItem',
                        item: item,
                    })
                )
            );

        //console.log('backend: ', item)
        // Return item
        return res.status(201).send(item);
    }))

// Add route to update item in database using put PUT http://localhost:3000/items?id=71
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

            // send a 'updateItem' event with the updated item data
            // @ts-ignore
            expressWs.getWss().clients
                .forEach((client: any) => client
                    .send(
                        JSON.stringify({
                            type: 'updateItem',
                            item: item,
                        }
                        )
                    )
                );

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

        // send a 'deleteItem' event with the deleted item id
        // @ts-ignore
        expressWs.getWss().clients
            .forEach((client: any) => client
                .send(
                    JSON.stringify({
                        type: 'deleteItem',
                        id: Number(req.query.id),
                    }
                    )
                )
            );

        // Return item
        return res.status(204).end();
    }));

export default router;
