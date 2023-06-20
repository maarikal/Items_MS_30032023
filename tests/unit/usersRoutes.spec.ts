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
            password: 'qwerty1234'
        }
        
        const createUserRoute = usersRoutes.stack.find(
            (layer: any) => layer.route?.path === '/'
        );

        console.log('Create User Route:', createUserRoute);
        if (createUserRoute) {
            await createUserRoute.route?.stack[0].handle(mockRequest, mockResponse, mockNext);
        }

        await new Promise(resolve => setTimeout(resolve, 100)); // Add a small delay to allow the database to update

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        
        mockResponse.body = {
            // id: integer,
            id: expect.any(Number),
            email: randomEmail,
        }
        console.log('Mock Response:', mockResponse.body);
        expect(mockResponse.send).toHaveBeenCalledWith(mockResponse.body);

    });
});