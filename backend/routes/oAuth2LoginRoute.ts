// Websocket
// https://fjolt.com/article/vue-how-to-set-up-a-websocket-server
// https://medium.com/developer-rants/implementing-https-and-wss-support-in-express-with-typescript-of-course-f36006c77bab
// oAuth2 Google
// https://developers.google.com/identity/gsi/web/reference/js-reference
// https://codevoweb.com/google-oauth-authentication-vue-and-node/
// https://yobaji.github.io/vue3-google-login/#using-google-sdk
// https://github.com/yobaji/vue3-google-login/

import express, {NextFunction, Request, Response} from 'express';

const router = express.Router();
// Google sign-in
import {OAuth2Client} from 'google-auth-library';

const googleOAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// Prisma
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
// uuid
import {v4 as uuid} from 'uuid';
import bcrypt from "bcrypt";
import logger from "../logger";

// Google sign-in route
/*import express, {Request, Response} from "express";*/

// Google sign-in route
router.post(
    '/',
    async (req: Request, res: Response) => {
        try {
            const token = req.body.token;
            const payload = await getDataFromGoogleJwt(token);

            // If the payload exists,
            // take the email from the payload and check if user with this email exists in the database
            // If the user exists, create session for the user
            // If the user exists, and the session exists, return session id
            // If the user does not exist, create user and session for the user
            // Return session id
            // If the payload does not exist, return unauthorized
            if (payload) {
                const userEmail = await prisma.user.findUnique({
                    where: {email: payload.email},
                });
                if (userEmail) {
                    // If the user exists, and the session exists, return session id
                    const session = await prisma.session.findUnique({
                        where: {userId: userEmail.id},
                    });
                    if (session) {
                        return res.status(201).send({sessionId: session.id});
                    } else {
                        const session = await prisma.session.create({
                            data: {userId: userEmail.id, id: uuid()}
                        });
                        logger.info('User logged in', {user: userEmail});
                        return res.status(201).send({sessionId: session.id});
                    }
                } else {
                    const hashedPassword = await bcrypt.hash(payload.sub, 10);
                    const user = await prisma.user.create({
                        data: {
                            email: payload.email,
                            password: hashedPassword,
                        }
                    });
                    const session = await prisma.session.create({
                        data: {userId: user.id, id: uuid()}
                    });
                    return res.status(201).send({sessionId: session.id});
                }
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);


// middleware to verify the JWT token
// function getDataFromGoogleJwt
async function getDataFromGoogleJwt(token: string) {
    try {
        const ticket = await googleOAuth2Client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default router;