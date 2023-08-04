// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
// @ts-ignore
import { v4 as uuid } from 'uuid';
import sessionsRoutes from '../../backend/routes/sessionsRoute';
import { handleErrors } from '../../backend/routes/handleErrors';
import { expect } from "@jest/globals";

describe('sessionsRoutes', () => {
    const prisma = new PrismaClient();
    let app: express.Application;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/sessions', sessionsRoutes);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    afterEach(async () => {
        await cleanupDatabase();
    });

    it('handles user login and session creation', async () => {
        // Generate a random email for testing
        const randomEmail = `${uuid()}@example.com`;
        const password = await bcrypt.hash('password123', 10);
        const user = await prisma.user.create({
            data: {
                email: randomEmail,
                password: password,
            },
        });

        const response = await request(app)
            .post('/sessions')
            .send({ email: randomEmail, password: 'password123' });

        expect(response.status).toBe(201);
        expect(response.body.sessionId).toBeTruthy();

        // Check if the session was created in the database
        const session = await prisma.session.findUnique({
            where: { id: response.body.sessionId },
        });
        expect(session).toBeTruthy();
    });

    it('handles user logout and session deletion', async () => {
        // Generate a random email for testing
        const randomEmail = `${uuid()}@example.com`;
        const password = await bcrypt.hash('password123', 10);
        const user = await prisma.user.create({
            data: {
                email: randomEmail,
                password: password,
            },
        });

        const session = await prisma.session.create({
            data: { userId: user.id, id: 'test-session-id' },
        });

        const response = await request(app)
            .delete('/sessions')
            .set('Authorization', `Bearer ${session.id}`)
            .expect(204);

        // Check if the session was deleted from the database
        const deletedSession = await prisma.session.findUnique({
            where: { id: session.id },
        });
        expect(deletedSession).toBeNull();

    });

    it('handles user login with invalid credentials', async () => {
        // Generate a random email for testing
        const randomEmail = `_random_${uuid()}@example.com`;
        const password = await bcrypt.hash('password123', 10);
        const user = await prisma.user.create({
            data: {
                email: randomEmail,
                password: password,
            },
        });

        const response = await request(app)
            .post('/sessions')
            .send({ email: randomEmail, password: 'wrong-password' });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: 'Invalid email or password' });
    });


    // Create function for cleaning up the database from test users created during the tests
    async function cleanupDatabase() {
         await prisma.user.deleteMany({
             where: {
                 email: {
                     contains: '_random_',
                 },
             },
         });
    // Check if the users were deleted from the database
            const deletedUsers = await prisma.user.findMany({
                where: {
                    email: {
                        contains: '_random_',
                    }
                }
            });
            expect(deletedUsers).toEqual([]);
    }

});