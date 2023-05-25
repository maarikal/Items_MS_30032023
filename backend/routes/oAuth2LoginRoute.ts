import express, {NextFunction, Request, Response} from 'express';

const router = express.Router();
// Google sign-in
import {OAuth2Client} from 'google-auth-library';
//const googleOAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleOAuth2Client = new OAuth2Client('668250301704-q7j4t8tnkmk88j3d6jsrkujt74311unb.apps.googleusercontent.com');

// Google sign-in route
/*import express, {Request, Response} from "express";*/

// Google sign-in route
router.post(
    '/',
    async (req: Request, res: Response) => {
        // Did we get here?
        console.log("oAuth2Login", `req.body.token: ${req.body.token}`);
        const sessionId = req.body.token;
        const payload = await getDataFromGoogleJwt(sessionId);
        // console log payload
        console.log("oAuth2Login", `payload: ${payload}`);
        if (payload) {
            res.status(200).send(payload);
        } else {
            res.status(401).send('Unauthorized');
        }
    })

// middleware to verify the JWT token
// function getDataFromGoogleJwt
async function getDataFromGoogleJwt(sessionId: string) {
    try {
        const ticket = await googleOAuth2Client.verifyIdToken({
            idToken: sessionId,
            audience: '668250301704-q7j4t8tnkmk88j3d6jsrkujt74311unb.apps.googleusercontent.com',
        });
        const payload = ticket.getPayload();
        return payload;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default router;