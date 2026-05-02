import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import supabase from './db/supabase-client'
import authRouter from './routes/auth'
import { requireAuth } from './middleware/auth'
import applicationRouter from './routes/applications'
import profilesRouter from './routes/profiles'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3005

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.FRONT_END_URL, // EXACT frontend URL
    credentials: true,               // REQUIRED for cookies
  })
);

app.use('/api/auth', authRouter)
app.use('/api/applications', requireAuth, applicationRouter)
app.use('/api/profiles', requireAuth, profilesRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})