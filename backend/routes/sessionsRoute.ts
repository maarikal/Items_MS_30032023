import express, {NextFunction, Request, Response} from 'express';
import {handleErrors} from './handleErrors';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid';


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

        // Create new session for user (3d)
        const session = await prisma.session.create({
            data: {userId: userEmail.id, id: uuid()}
        });
        // Send response with new session if (3e)
        return res.status(201).send({sessionId: session.id});
        console.log(session.id)
    })
);


export default router;