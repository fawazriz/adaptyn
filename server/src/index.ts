import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import supabase from './db/supabase-client'
import authRouter from './routes/auth'
import { requireAuth } from './middleware/auth'
import applicationRouter from './routes/applications'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(morgan('dev'))
app.use(express.json())
app.use(cors());

app.use('/api/auth', authRouter)
app.use('/api/applications', requireAuth, applicationRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})