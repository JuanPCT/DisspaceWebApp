import app from './app.js'
import { connectDB } from './config/db.js'
import dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.PORT ?? 5000

// Conectar a la base de datos y luego iniciar el servidor
connectDB().then((conn) => conn && conn.end())

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
