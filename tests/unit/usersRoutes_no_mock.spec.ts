// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import {expect} from "@jest/globals";
import usersRoutes, { requireValidEmail } from '../../backend/routes/usersRoutes';
import { handleErrors } from '../../backend/routes/handleErrors';

describe('usersRoutes', () => {
    const prisma = new PrismaClient();
    let app: express.Application;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/users', usersRoutes);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('handles the check-email route with existing user', async () => {

        // Get list of existing users from the Prisma database and pick the first one and use its email in the request body
        const existingUser = await prisma.user.findFirst();
        const existingUserEmail = existingUser?.email;

        // Send a real HTTP request using supertest and app with request body email: existingUserEmail
        const response = await request(app)
            .post('/users')
            .send({ email: existingUserEmail, password: 'password' });

        // Assert the response status and content
        expect(response.status).toBe(409);
        expect(response.body).toEqual({ error: 'Email already exists' });
    });

    it('handles the check-email route with empty e-mail', async () => {
        // Send a real HTTP request using supertest and app
        const response = await request(app)
            .post('/users')
            .send({ email: '' });

        // Assert the response status and content
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: 'Email is required' });
    });

    it('handles the create user route', async () => {
        // Generate random email
        const randomEmail = '_random_' + Math.random().toString(36).substring(7) + '@example.com';

        // Prepare request data
        const requestPayload = {
            email: randomEmail,
            password: 'password',
        };

        // Send a real HTTP request using supertest and app
        const response = await request(app)
            .post('/users')
            .send(requestPayload);

        // Assert the response status and content
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            userCopy: {
                id: expect.any(Number),
                email: randomEmail,
            },
        });
        // Assert the data in the Prisma database
        const createdUser = await prisma.user.findUnique({
            where: { email: response.body.userCopy.email },
        });

        expect(createdUser).toBeTruthy();
        expect(createdUser?.email).toBe(randomEmail);

        // Clean up the database
        await prisma.user.delete({
            where: { email: randomEmail },
        });
    });

});
