import express, {NextFunction, Response} from "express";
import {PrismaClient} from '@prisma/client';
import {IRequestWithSession} from 'function.d';

const prisma = new PrismaClient();

// check if authorization header is present (5bi)
async function authorizeRequest(req: IRequestWithSession, res: Response, next: NextFunction) {
    // check if authorization header is present (5bi)
    console.log("auth: ", req.headers.authorization)
    if (!req.headers.authorization) {
        return res.status(401).send('Authorization header is missing')
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

export const verifySession = async (
    req: IRequestWithSession,
    res: express.Response,
    next: express.NextFunction
) => {
    const sessionId = req.headers.authorization;
    console.log('sessionId:', sessionId);
    if (!sessionId) {
        return res.status(401).send('Unauthorized');
    }
    const session = await prisma.session.findUnique({
        where: {id: sessionId.substring(7)},
        select: {userId: true},
    });
    console.log('session:', session);
    if (!session || !session.userId) {
        return res.status(401).send('Unauthorized');
    }
    req.userId = {id: session.userId};
    next();
};

export default authorizeRequest;