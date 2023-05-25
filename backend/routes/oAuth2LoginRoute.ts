import express, {NextFunction, Request, Response} from 'express';
const router = express.Router();
// Google sign-in
import {OAuth2Client} from 'google-auth-library';
//const googleOAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleOAuth2Client = new OAuth2Client('668250301704-q7j4t8tnkmk88j3d6jsrkujt74311unb.apps.googleusercontent.com');

// Google sign-in route
/*import express, {Request, Response} from "express";*/

router.post('/oAuth2Login', async (req, res) => {
    try {
        const dataFromGoogleJwt = await getDataFromGoogleJwt(req.body.credential)
        if (dataFromGoogleJwt) {
/*            let user = users.findBy('sub', dataFromGoogleJwt.sub);
            if (!user) {
                user = createUser(dataFromGoogleJwt.email, null, dataFromGoogleJwt.sub)
            }
            login(user, req);
            log("oAuth2Login", `${dataFromGoogleJwt.name} (${dataFromGoogleJwt.email}) logged in with Google OAuth2 as user ${user.email}`);
            let clientBookedTimes = times.filter((time) => time.userId === user.id);*/
            res.status(201).send({
                sessionId: '1234'
            })
        }
    } catch (err) {
        return res.status(400).send({error: 'Login unsuccessful'});
    }
});

// middleware to verify the JWT token
// function getDataFromGoogleJwt
async function getDataFromGoogleJwt(token: string) {
    try {
        const ticket = await googleOAuth2Client.verifyIdToken({
            idToken: token,
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