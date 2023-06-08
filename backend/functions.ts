import express, {NextFunction, Request, Response} from "express";
import {PrismaClient} from '@prisma/client';
import {IRequestWithSession} from 'function';
import xml2js from 'xml2js';
import itemsRoutes from "./routes/itemsRoutes";

const prisma = new PrismaClient();

// check if authorization header is present (5bi)
async function authorizeRequest(req: IRequestWithSession, res: Response, next: NextFunction) {
    // check if authorization header is present (5bi)
    console.log("auth: ", req.headers.authorization)
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized')
    }

    // check if authorization header is in Bearer XXX format (5bii)
    if (!req.headers.authorization.startsWith('Bearer') || req.headers.authorization.split(' ').length !== 2) {
        return res.status(401).send('Authorization header is not in Bearer XXX format')
    }

    // check if session id is valid (5biii)
    const sessionId = req.headers.authorization.split(' ')[1]
    const session = await prisma.session.findUnique({
        where: {
            id: sessionId
        }
    })

    if (!session) {
        return res.status(401).send('Session not found')
    }

    // check if the user account exists in database (5biv)
    let user = await prisma.user.findUnique({
        where: {
            id: session.userId
        }
    })

    // Validate user
    if (!user) {
        return res.status(401).send('User not found')
    }

    // Add user and sessionToken to request
    req.userId = user.id
    req.sessionId = sessionId

    next()
}

function sendResponse(req: IRequestWithSession, res: Response, data: any) {
    const acceptHeader = req.headers.accept || '';
    if (acceptHeader === 'application/json') {
        return res.status(201).json(data);
    } else if (acceptHeader === 'text/html') {
        return res.status(201).send(`<h1>${data.name}</h1><p>${data.description}</p>`);
    } else if (acceptHeader === 'application/xml') {
        const xml = `
            <item>
                <name>${data.name}</name>
                <description>${data.description}</description>
                <image>${data.image}</image>
            </item>
        `;
        return res.status(201).send(xml);
    } else {
        return res.status(406).send('Not Acceptable');
    }
}


export const xmlResponse = (res: Response, object: any, status: number) => {
    const builder = new xml2js.Builder();
    const xml = builder.buildObject(object);
    res.set('Content-Type', 'application/xml');
    res.status(status).send(xml);
};

export const isXMLHeader = (req: Request) => {
    const acceptHeader = req.headers.accept || '';
    //const items = prisma.item.findMany();
    return acceptHeader.includes('application/xml') || acceptHeader.includes('text/xml');
};

export const sendRequest = (req: IRequestWithSession, res: Response, data: any, status: number) => {
    if (req.headers.accept === 'text/xml') {

        const convert = require('xml2js');
        const options = {compact: true, ignoreComment: true, spaces: 4};
        const xml = convert.json2xml(data, options);
        return res.status(status).send(xml)
    }
    return res.status(status).json(data)
}


export default authorizeRequest;