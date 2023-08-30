// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from 'express';
import { PrismaClient } from '@prisma/client';
import itemsRoutes from '../../backend/routes/itemsRoutes';
import { handleErrors } from '../../backend/routes/handleErrors';
import { expect } from "@jest/globals";

describe('itemsRoutes', () => {

    const prisma = new PrismaClient();
    let app: express.Application;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/items', itemsRoutes);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('handles fetching all items', async () => {
        // Create sample items in the database if needed
        const items = await prisma.item.createMany({
            data: [
                { name: 'Item 1', description: 'Description 1', image: 'image1.jpg' },
                { name: 'Item 2', description: 'Description 2', image: 'image2.jpg' },
            ],
        });

        const response = await request(app)
            .get('/items')
            .expect(201);

        expect(response.body).toEqual(items);
    });

    it('handles adding a new item', async () => {
        const newItem = {
            name: 'New Item',
            description: 'New Description',
            image: 'new-image.jpg',
        };

        const response = await request(app)
            .post('/items')
            .send(newItem)
            .expect(201);

        expect(response.body.name).toBe(newItem.name);
        expect(response.body.description).toBe(newItem.description);
        expect(response.body.image).toBe(newItem.image);

        // Check if the item was created in the database
        const createdItem = await prisma.item.findUnique({
            where: { id: response.body.id },
        });
        expect(createdItem).toBeTruthy();
    });

    it('handles updating an item', async () => {
        // Create an item for updating
        const createdItem = await prisma.item.create({
            data: {
                name: 'Initial Item',
                description: 'Initial Description',
                image: 'initial-image.jpg',
            },
        });

        const updatedItem = {
            id: createdItem.id,
            name: 'Updated Item',
            description: 'Updated Description',
            image: 'updated-image.jpg',
        };

        const response = await request(app)
            .patch('/items')
            .query({ id: updatedItem.id })
            .send(updatedItem)
            .expect(201);

        expect(response.body.name).toBe(updatedItem.name);
        expect(response.body.description).toBe(updatedItem.description);
        expect(response.body.image).toBe(updatedItem.image);

        // Check if the item was updated in the database
        const fetchedItem = await prisma.item.findUnique({
            where: { id: updatedItem.id },
        });
        expect(fetchedItem).toEqual(expect.objectContaining(updatedItem));
    });

    it('handles deleting an item', async () => {
        // Create an item for deletion
        const createdItem = await prisma.item.create({
            data: {
                name: 'Item to Delete',
                description: 'Description to Delete',
                image: 'image-to-delete.jpg',
            },
        });

        await request(app)
            .delete('/items')
            .query({ id: createdItem.id })
            .expect(204);

        // Check if the item was deleted from the database
        const deletedItem = await prisma.item.findUnique({
            where: { id: createdItem.id },
        });
        expect(deletedItem).toBeNull();
    });

    // Clean up the database after each test
    afterEach(async () => {
        await prisma.item.deleteMany();
    });

});
