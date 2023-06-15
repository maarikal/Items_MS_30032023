import express, {Request, Response} from 'express';
import {handleErrors} from './handleErrors';
import {PrismaClient} from '@prisma/client';
import logger from "../logger";
import {expressWs} from "../index";
import {IRequestWithSession} from "../function";
import authorizeRequest, {sendResponse} from "../functions";

const prisma = new PrismaClient();
const router = express.Router();

// Routes
router.get(
    '/',
    authorizeRequest,
    handleErrors(async (req: IRequestWithSession, res: Response) => {
        // Get all items from database using Prisma
        const items = await prisma.item.findMany();
        // Return items
        //return sendResponse(req, res, 'items', 201)
        return res.status(201).send(items);
    }),
);


router.post(
    '/',
    handleErrors(async (req: IRequestWithSession, res: Response) => {
        // Save item to database using Prisma
        const {name, description, image} = req.body;
        console.log("post req body:", req.body)
        const item = await prisma.item.create({
            data: {
                name,
                description,
                image,
            },
        });
        console.log('post routeris pärast Prismat: ', item)

        // send a 'addItem' event with the new item data
        expressWs.getWss().clients
            .forEach((client: any) => client
                .send(
                    JSON.stringify({
                        type: 'addItem',
                        item: item,
                    })));
        // Log item creation with timestamp
        logger.info('Item created', {item});

        // send a 'addItem' event with the new item data
        expressWs.getWss().clients
            .forEach((client: any) => client
                .send(
                    JSON.stringify({
                        type: 'addItem',
                        item: item,
                    })));
        // return item
        console.log('sendResponse:', item)
        return sendResponse(req, res, item, 201)
    }));


// Add route to update item in database using PUT http://localhost:3000/items?id=71
    router.patch(
        '/',
        handleErrors(async (req: Request, res: Response) => {
            // Update item in database using Prisma
            const {name, description, image} = req.body
            console.log('patch: ', req.body)
            const item = await prisma.item.update({
                where: {
                    id: Number(req.query.id),
                },
                data: {
                    name,
                    description,
                    image,
                },
            });
            // Log item update
            logger.info('Item updated', {item});

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
            return sendResponse(req, res, item, 201)
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
        // Log item deletion
        logger.info('Item deleted', {item});

        // Return item
        return res.status(204).end();
    }));


export default router;
