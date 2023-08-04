// https://www.prisma.io/docs/guides/testing/unit-testing

// @ts-ignore
import { Request, Response, NextFunction } from 'express';
import { handleErrors } from '../../backend/routes/handleErrors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import usersRoutes, {requireValidEmail} from '../../backend/routes/usersRoutes';
import {expect} from "@jest/globals";
import { createUser } from './prismaMock/functions-without-context'
import { prismaMock } from './prismaMock/singleton'

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

        console.log('Mock Response:', mockResponse.status.mock.calls);
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

/*    it('handles the create user route', async () => {

        mockRequest.body = {
            email: 'test222222222222@test.ee',
            password: 'hashedPassword',
        }
        // Call the handler function
        await requireValidEmail(mockRequest, mockResponse, mockNext);

        // Assert that `next` was called
        expect(mockNext).toHaveBeenCalled();
        
        const randomEmail = Math.random().toString(36).substring(2, 15) + '@test.ee';

        mockRequest.body = {
            email: randomEmail,
            password: 'hashedPassword',
        }

        // Mock the PrismaClient
        const user = {
            id: 1,
            email: randomEmail,
            password: 'hashedPassword',
        }

        // Mock the behavior of the create function
        prismaMock.user.create.mockResolvedValue(user)

        await expect(createUser(user)).resolves.toEqual({
            id: 1,
            email: randomEmail,
            password: 'hashedPassword',
        })
        
        // Mock bcrypt
        bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
        // Call the handler function
        await usersRoutes.stack[1].route.stack[0].handle(mockRequest, mockResponse, mockNext)
        
        console.log('Handler function for create user route called with usersRoutes.stack[1].route.stack[1]: ', usersRoutes.stack[1].route.stack[0]);

        // What was sent to handler function?
        console.log('Handler function for create user route called with user: ', mockRequest.body);

        // Wait for the response to be sent
        await new Promise(resolve => setImmediate(resolve));
        
        // Check that the user was created
        expect(prismaMock.user.create).toHaveBeenCalledWith({
            data: {
                email: randomEmail,
                id: 1,
                password: 'hashedPassword',
            }
        });

        // Check that the response was sent
        // console log the response status code
        //console.log('Handler function for create user route called with mockResponse.status: ', mockResponse.status.mock.calls[0][0]);
        
        console.log('Mock Response calls:', mockResponse.status.mock.calls);
        console.log('Mock Response results:', mockResponse.send.mock.results);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.send).toHaveBeenCalledWith({
            id: 1,
            email: randomEmail,
        });

    });*/

});