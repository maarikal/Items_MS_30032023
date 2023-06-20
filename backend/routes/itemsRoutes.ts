import express, {Request, Response} from 'express';
import {handleErrors} from './handleErrors';
import {PrismaClient} from '@prisma/client';
import logger from "../logger";
import {expressWs} from "../index";
import {IRequestWithSession} from "../function";
import authorizeRequest, {sendResponse} from "../functions";

const prisma = new PrismaClient();
const router = express.Router();

let data;

// Routes
router.get(
    '/',
    authorizeRequest,
    handleErrors(async (req: IRequestWithSession, res: Response) => {
        // Get all items from database using Prisma
        const items = await prisma.item.findMany();
        return res.status(201).send(items);
    }),
);


router.post(
    '/',
    authorizeRequest,
    handleErrors(async (req: IRequestWithSession, res: Response) => {
        const acceptHeader = req.headers["content-type"] || '';

        if (acceptHeader === 'application/json') {
            data = req.body;
        } else if (
            acceptHeader.includes('application/xml') ||
            acceptHeader.includes('text/xml') ||
            acceptHeader.includes('application/xhtml+xml')) {
            data = req.body.root;
        } else {
            // Handle unsupported content types or return an error response
            return sendResponse(req, res, {error: 'Unsupported content type'}, 400);
        }
        // Save item to database using Prisma
        const {name, description, image} = data;
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
    authorizeRequest,
    handleErrors(async (req: Request, res: Response) => {
        const acceptHeader = req.headers["content-type"] || '';

        if (acceptHeader === 'application/json') {
            data = req.body;
        } else if (
            acceptHeader.includes('application/xml') ||
            acceptHeader.includes('text/xml') ||
            acceptHeader.includes('application/xhtml+xml')) {
            data = req.body.root;
        } else {
            // Handle unsupported content types or return an error response
            return sendResponse(req, res, {error: 'Unsupported content type'}, 400);
        }
        // Update item in database using Prisma
        const {name, description, image} = data
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
    authorizeRequest,
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
