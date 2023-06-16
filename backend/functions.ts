import express, {NextFunction, Request, Response} from "express";
import {PrismaClient} from '@prisma/client';
import {IRequestWithSession} from 'function';
import xml2js, {Builder, parseStringPromise} from 'xml2js';
import itemsRoutes from "./routes/itemsRoutes";
import {js2xml} from "xml-js";

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

export const sendResponse = async (req: IRequestWithSession, res: Response, data: any, status: number) => {
    const acceptHeader = req.headers["content-type"] || '';
    console.log("acceptHeader: ", acceptHeader)
    if (acceptHeader === 'application/json') {
        return res.status(201).json(data);
    } else if (
        acceptHeader.includes('application/xml') ||
        acceptHeader.includes('text/xml') ||
        acceptHeader.includes('application/xhtml+xml')
    ) {
        const data = req.body.head.root[0];
        console.log("data: ", req.body.head.root[0])
        const xml = `
            <?xml version="1.0" encoding="UTF-8"?>
            <item>
                <name>${data.name}</name>
                <description>${data.description}</description>
                <image>${data.image}</image>
            </item>
        `;
        console.log("xml: ", xml)
        res.set('Content-Type', 'application/xml');
        return res.status(201).send(xml);
    } else {
        return res.status(406).send('Not Acceptable');
    }
}

/*export const isXMLHeader = (req: Request) => {
    const acceptHeader = req.headers.accept || '';
    //const items = prisma.item.findMany();
    return acceptHeader.includes('application/xml') || acceptHeader.includes('text/xml');
};*/


export const sendRequest2 = async (req: IRequestWithSession, res: Response, data: any, status: number) => {
    if ((req.headers["content-type"] === 'text/xml') || (req.headers["content-type"] === 'application/xml') || (req.headers["content-type"] === '?xml')) {

        //const convert = require('xml2js').default;
        //const options = {compact: true, ignoreComment: true, spaces: 4};
        /* const xml = convert.json2xml(data, options);*/
        const {name, description, image} = req.body.head.root[0];
        /*const convert = new Builder({ headless: true, rootName: undefined });
        console.log("data: ", req.body)
        const xml = convert.buildObject({name, description, image});
        console.log("xml: ", xml)
        return res.status(status).send(xml)*/
        const convert = new Builder({headless: true});
        const temporaryRootName = 'tempRoot'; // Temporary root element name
        const xml = convert.buildObject({[temporaryRootName]: {name, description, image}});
        const finalXml = xml.replace(`<${temporaryRootName}>`, '').replace(`</${temporaryRootName}>`, ''); // Remove the temporary root element
        console.log('xml: ', finalXml);
        try {
            const jsonData = await parseStringPromise(finalXml, {explicitArray: false}); // Convert finalXml to JSON
            console.log('jsonData: ', jsonData);
            return res.status(status).json(jsonData);
        } catch (error) {
            console.error('Error parsing XML:', error);
            return res.status(status).json(data);
        }
    }
    return res.status(status).json(data)
}

/*export const xmlResponse = (res: Response, data: any, status: number) => {
    const builder = new xml2js.Builder();
    const xml = builder.buildObject(data);
    res.set('Content-Type', 'application/xml');
    res.status(status).send(xml);
};

export const sendRequest = (req: IRequestWithSession, res: Response, data: any, status: number): void | Response<any, Record<string, any>> => {
    const { accept } = req.headers;
    if (accept === 'text/xml' || accept === 'application/xml') {
        const convert = require('xml2js');
        const options = { compact: true, ignoreComment: true, spaces: 4 };
        const xml = convert.json2xml(data, options);
        return xmlResponse(res, xml, status);
    } else {
        return res.status(status).json(data);
    }
};*/

export default authorizeRequest;