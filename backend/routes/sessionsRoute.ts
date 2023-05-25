import express, {NextFunction, Request, Response} from 'express';
import {handleErrors} from './handleErrors';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid';
import logger from "../logger";
import authorizeRequest from '../functions';
import {IRequestWithSession} from "../function";


const verifier = require('@gradeup/email-verify');
const prisma = new PrismaClient();
const router = express.Router();

// Routes
router.post(
    '/',
    handleErrors(async (req: IRequestWithSession, res: Response) => {
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
            // Log user login
            logger.info('User logged in', {user: userEmail});

            // Send response with new session if (3e)
            return res.status(201).send({sessionId: session.id});
            console.log(session.id)
        }
    }));


// DELETE /sessions end-point (5c)
router.delete('/', authorizeRequest, (req, res) => {
    console.log(1);
    // Log user logout
    logger.info('User logged out', {user: req.body.userId});

    res.status(204).send();
});


export default router;