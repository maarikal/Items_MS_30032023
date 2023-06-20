// https://www.prisma.io/docs/guides/testing/unit-testing

// @ts-ignore
import { Request, Response, NextFunction } from 'express';
import { handleErrors } from '../../backend/routes/handleErrors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import usersRoutes from '../../backend/routes/usersRoutes';
import {expect} from "@jest/globals";

describe('usersRoutes', () => {
    let mockRequest: Request;
    let mockResponse: Response;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {} as Request;
        mockResponse = {} as Response;
        mockNext = jest.fn();
        mockResponse.status = jest.fn().mockReturnThis();
        mockResponse.send = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('handles the check-email route with existing user', async () => {
        mockRequest.body = {
            email: 'test2@test.ee'
        };

        const checkEmailRoute = usersRoutes.stack.find(
            (layer: any) => layer.route?.path === '/check-email'
        );

        if (checkEmailRoute) {
            await checkEmailRoute.route?.stack[0].handle(mockRequest, mockResponse, mockNext);
        }

        expect(mockResponse.status).toHaveBeenCalledWith(409);
        expect(mockResponse.send).toHaveBeenCalledWith({ error: 'Email already exists' });
    });

    it('handles the check-email route with empty e-mail', async () => {
        mockRequest.body = {
            email: ''
        };

        const checkEmailRoute = usersRoutes.stack.find(
            (layer: any) => layer.route?.path === '/check-email'
        );

        if (checkEmailRoute) {
            await checkEmailRoute.route?.stack[0].handle(mockRequest, mockResponse, mockNext);
        }

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.send).toHaveBeenCalledWith({ error: 'Email is required' });
    });

    it('handles the create user route', async () => {
        const randomEmail = Math.random().toString(36).substring(2, 15) + '@test.ee';
        console.log('Random Email:', randomEmail);

        mockRequest.body = {
            email: randomEmail,
            password: 'hashedPassword'
        }

        // Mock the PrismaClient
        const prisma = new PrismaClient();
        prisma.user.create = jest.fn().mockResolvedValue({
            data: {
                email: randomEmail,
                id: 1,
                password: 'hashedPassword'
            }
        });


        // Mock bcrypt
        bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');

        // Mock the handler function
        const handler = handleErrors(
            usersRoutes.stack.find(
                (layer: any) => layer.route?.path === '/'
            )?.route?.stack[0].handle
        );

        // Call the handler function
        await handler(mockRequest, mockResponse, mockNext);

        // Check that the user was created
        expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    email: randomEmail,
                    id: 1
                }
            }
        );

        // Check that the response was sent
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.send).toHaveBeenCalledWith({
                id: 1,
                email: randomEmail,
            }
        );
    });

});