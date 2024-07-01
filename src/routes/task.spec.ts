import request from 'supertest';
import express from 'express';
import router from './task';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        task: {
            findMany: jest.fn(),
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }
    }
    return { PrismaClient: jest.fn(() => mockPrisma) }
})

const prisma = new PrismaClient()
const app = express()
app.use(express.json());
app.use('/api/task', router);

describe('Task API', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('GET /api/task - should return tasks', async () => {
        const tasks = [{ id: 'cly2g5xxo0000gj9lw7n5wmox', name: 'Test' }];
        (prisma.task.findMany as jest.Mock).mockResolvedValue(tasks);

        const response = await request(app).get('/api/task')
        expect(response.status).toBe(200)
        expect(response.body).toEqual(tasks)
    })

    test('POST /api/task - should create a task', async () => {
        const newTask = { id: 'cly2g5xxo0000gj9lw7n5wmo2', name: 'new task' };
        (prisma.task.create as jest.Mock).mockResolvedValue(newTask);

        const response = await request(app).post('/api/task').send({ name: 'new task' });
        expect(response.status).toBe(201)
        expect(response.body).toEqual(newTask)
    })

    test('GET /:id - should return a task', async () => {
        const task = { id: 'cly2g5xxo0000gj9lw7n5wmo2', name: 'new task' };
        (prisma.task.findUnique as jest.Mock).mockResolvedValue(task);

        const response = await request(app).get('/api/task/cly2g5xxo0000gj9lw7n5wmo2')
        expect(response.status).toBe(200);
        expect(response.body).toEqual(task);
    })

    test('PATCH /:id - should update a task', async () => {
        const updatedTask = { id: 'cly2g5xxo0000gj9lw7n5wmo2', name: 'Updated Task' };
        (prisma.task.findUnique as jest.Mock).mockResolvedValue(updatedTask);
        (prisma.task.update as jest.Mock).mockResolvedValue(updatedTask);

        const response = await request(app).patch('/api/task/cly2g5xxo0000gj9lw7n5wmo2').send({ name: 'Updated Task' });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedTask);
    })

    test('DELETE /:id - should delete a task', async () => {
        const deletedTask = { id: 'cly2g5xxo0000gj9lw7n5wmo2', name: 'Task' };
        (prisma.task.findUnique as jest.Mock).mockResolvedValue(deletedTask);
        (prisma.task.delete as jest.Mock).mockResolvedValue(deletedTask);

        const response = await request(app).delete('/api/task/cly2g5xxo0000gj9lw7n5wmo2')
        expect(response.status).toBe(200);
        expect(response.body).toEqual(deletedTask);
    })

    test('GET /:id - should return 404 if task not found', async () => {
        (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);

        const response = await request(app).get('/api/task/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Task not found' });
    })

    test('PATCH /:id - should return 404 if task not found', async () => {
        (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);

        const response = await request(app).patch('/api/task/999').send({ name: 'Non-existent Task' });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Task not found' });
    });

    test('DELETE /:id - should return 404 if task not found', async () => {
        (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);

        const response = await request(app).delete('/api/task/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Task not found' });
    });
})

