import express, {NextFunction, Request, Response} from 'express';
import {handleErrors} from './handleErrors';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid';
import {exists} from "fs";


const verifier = require('@gradeup/email-verify');

const prisma = new PrismaClient();
const router = express.Router();

// Routes
router.post(
    '/',
    handleErrors(async (req: Request, res: Response) => {
        // Validate that user email and password exist (3a)
        if (!req.body.email) {
            return res.status(400).send({error: 'Email is required'});
        }

        if (!req.body.password) {
            return res.status(400).send({error: 'Password is required'});
        }

        // Find the user by email from database (3b)
        const userEmail = await prisma.user.findUnique({
            where: {email: req.body.email},
        });
        // Check that the user email is correct
        if (!userEmail) {
            return res.status(401).send({error: 'Invalid email or password'});
        }

        // Check that the user password matches with database password (3c)
        const userPassword = await bcrypt.compare(
            req.body.password,
            userEmail?.password || ''
        );

        if (!userPassword) {
            return res.status(401).send({error: 'Invalid email or password'});
        }


        // if sessionId exists for user who is signing in, direct to the item list page, if not, create new session for user and direct to the item list page (3d)
        const session = await prisma.session.findUnique({
                where: {userId: userEmail.id},
            }
        );
        if (session) {
            return res.status(201).send({sessionId: session.id});
        } else {
            const session = await prisma.session.create({
                data: {userId: userEmail.id, id: uuid()}
            });
            // Send response with new session if (3e)
            return res.status(201).send({sessionId: session.id});
            console.log(session.id)
        }
    }));


// DELETE /sessions end-point (5c)
router.delete('/', authorizeRequest, async (req, res) => {
    // Did we get heere?
    console.log('delete sessions');
    try {
        // Delete session from database
        const deletedSession = await prisma.session.delete({
            where: {id: req.body.sessionId}
        });
        console.log(deletedSession);

        // Send response
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});


// check if authorization header is present (5bi)
function authorizeRequest(req: Request, res: Response, next: NextFunction) {
    console.log(2);
    if (!req.headers.authorization) {
        return res.status(400).send({error: 'Authorization header is missing'});
    }
    // check if authorization header is in Bearer XXX format (5bii)
    const authHeaderParts = req.headers.authorization.split(' ');
    if (authHeaderParts.length !== 2) {
        return res.status(401).send({error: 'Authorization header is not in Bearer XXX format'});
    }
    // check if session id is valid (5biii)
    const sessionId = authHeaderParts[1];
    const session = prisma.session.findUnique({
        where: {id: sessionId}
    });
    console.log('sessionRoutes', sessionId);
    if (!session) {
        return res.status(401).send({error: 'Session not found'});
    }
    console.log('session: ', session);
    // check if the user account exists in database (5biv)
    const user = prisma.user.findUnique({
        where: {id: req.body.userId}
    });
    console.log("5b punkt", user);

    if (!user) {
        return res.status(404).send({error: 'User not found'});
    }

    next();
}


export default router;