import express from 'express'
import logger from './middlewares/logger'
import taskRoutes from './routes/task'
import errorHandler from './middlewares/error-handler'

const app = express()
const port = process.env.APP_PORT || 3001

app.use(logger)
app.use(express.json())

app.use('/api/task', taskRoutes)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})