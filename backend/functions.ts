import {NextFunction, Response} from "express";
import {PrismaClient} from '@prisma/client';
import {IRequestWithSession} from 'function';
import xml2js from 'xml2js';

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
        const data = req.body.root
        /*        const xml = xmlTemplate(data);*/

        const xmlBuilder = new xml2js.Builder({rootName: 'root'})
        // const xmlData = xmlBuilder.buildObject({items: data})
        const xmlData = xmlBuilder.buildObject({
            items: {
                name: data.name[0] || '', // Provide default value if name is null or undefined
                description: data.description[0] || '', // Provide default value if description is null or undefined
                image: data.image[0] || '', // Provide default value if image is null or undefined
            }
        });
        console.log("xml: ", xmlData)
        console.log("name: ", data.name[0])
        res.set('Content-Type', 'application/xml');
        return res.status(201).send(xmlData);
    } else {
        return res.status(406).send('Not Acceptable');
    }
}

export default authorizeRequest;