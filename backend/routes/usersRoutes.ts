import express, {NextFunction, Request, Response} from 'express';
import {handleErrors} from './handleErrors';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import logger from "../logger";
import {parseRequestData, sendResponse} from "../functions";

const verifier = require('@gradeup/email-verify');

const prisma = new PrismaClient();
const router = express.Router();


// Routes
router.post(
    '/check-email',
    requireValidEmail,
    handleErrors(async (req: Request, res: Response) => {
        return res.status(200).send({message: 'Email is valid'});
    })
);

router.post(
    '/',
    requireValidEmail,
    handleErrors(async (req: Request, res: Response) => {
        const data = parseRequestData(req)
        // Validate password
        if (!data.password) {
            return res.status(401).send({error: 'Password is required'});
        }

        // Check if the password is correct
        if (data.password.length < 8) {
            return res
                .status(401)
                .send({error: 'Password must be at least 8 characters long'});
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        console.log("post useris enne Prismat: ", data)

        // Save user to database using Prisma
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
            },
        });
        console.log('post routeris pärast Prismat: ', user)

        // Copy the user object
        const userCopy: any = {...user};

        // Remove the password from the user object
        delete userCopy.password;

        // Log user creation
        logger.info('User created', {user});

        // Return user and use sendResponse function
        return sendResponse(req, res, userCopy, 201);
    })
);

// Middleware
async function requireValidEmail(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const data = parseRequestData(req)

    // Validate email
    if (!data.email) {
        return res.status(401).send({error: 'Email is required'});
    }

    try {
        /*const result = await verifyEmail(data.email);
        if (!result.success) {
            return res.status(400).send({error: result.info});
        } */

        // Check if user already exists
        const userExists = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        if (userExists) {
            return res.status(409).send({error: 'Email already exists'});
        }
    } catch (error: any) {
        const errorObject = tryToParseJson(error);
        if (errorObject && errorObject.info) {
            return res.status(400).send({error: errorObject.info});
        }
        return res.status(400).send({error: error});
    }
    next();
}

// Utility functions
async function verifyEmail(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
        verifier.verify(email, (err: any, info: any) => {
            if (err) {
                reject(JSON.stringify(info));
            } else {
                resolve(info);
            }
        });
    });
}

export function tryToParseJson(jsonString: string): any {
    try {
        let o = JSON.parse(jsonString);
        if (o && typeof o === 'object') {
            return o;
        }
    } catch (e) {
    }
    return false;
}

export default router;
