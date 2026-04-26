import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import supabase from './db/supabase-client'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})