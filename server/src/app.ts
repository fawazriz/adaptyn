import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import authRouter from './routes/auth'
import { requireAuth } from './middleware/auth'
import applicationRouter from './routes/applications'
import profilesRouter from './routes/profiles'
import resumesRouter from './routes/resumes'

dotenv.config()

const app = express()
const frontendOrigin = process.env.FRONT_END_URL

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: frontendOrigin ?? false,
    credentials: true,               // REQUIRED for cookies
  })
);

app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'private, no-store')
  const origin = req.get('Origin')
  const fetchSite = req.get('Sec-Fetch-Site')
  const safeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(req.method)
  if (!safeMethod && (origin ? origin !== frontendOrigin : fetchSite && fetchSite !== 'same-origin')) {
    return res.status(403).json({ error: 'Request origin is not allowed' })
  }
  next()
})

app.use('/api/auth', authRouter)
app.use('/api/applications', requireAuth, applicationRouter)
app.use('/api/profiles', requireAuth, profilesRouter)
app.use('/api/resumes', requireAuth, resumesRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

export default app;
