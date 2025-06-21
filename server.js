import app from './app.js'
import { connectDB } from './config/db.js'
import dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.PORT ?? 5000

// Conectar a la base de datos
connectDB()

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
