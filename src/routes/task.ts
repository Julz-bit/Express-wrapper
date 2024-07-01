import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'

const prisma = new PrismaClient()
const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
    try {
        const tasks = await prisma.task.findMany()
        res.json(tasks)
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'something went wrong'
        res.status(500).json({ message: message })
    }
})

router.post('/', async (req: Request, res: Response) => {
    try {
        const body = req.body
        const result = await prisma.task.create({
            data: body
        })
        res.status(201).json(result)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'something went wrong'
        res.status(500).json({ message: message })
    }
})

const findTask = async (id: string) => {
    return await prisma.task.findUnique({
        where: { id }
    })
}

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const task = await findTask(id);
        if (!task) return res.status(404).json({ message: 'Task not found' })
        res.json(task)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'something went wrong'
        res.status(500).json({ message: message })
    }
})

router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const body = req.body
        const task = await findTask(id);
        if (!task) return res.status(404).json({ message: 'Task not found' })
        const result = await prisma.task.update({
            where: { id },
            data: body
        })
        res.json(result)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'something went wrong'
        res.status(500).json({ message: message })
    }
})

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const task = await findTask(id);
        if (!task) return res.status(404).json({ message: 'Task not found' })
        const result = await prisma.task.delete({
            where: { id }
        })
        res.json(result)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'something went wrong'
        res.status(500).json({ message: message })
    }
})

export default router