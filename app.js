import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session'
import bcrypt from 'bcryptjs'
import { connectDB } from './config/db.js'

const app = express();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configura EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: false }))
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
  })
)

// Sirve archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.render('index', { titulo: 'Hola desde EJS' });
});

// Vista de login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const connection = await connectDB()
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    )
    await connection.end()
    if (rows.length && (await bcrypt.compare(password, rows[0].password))) {
      req.session.userId = rows[0].id
      return res.redirect('/')
    }
    res.render('login', { error: 'Credenciales inválidas' })
  } catch (err) {
    console.error(err)
    res.render('login', { error: 'Error al iniciar sesión' })
  }
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', async (req, res) => {
  const { email, password } = req.body
  try {
    const hashed = await bcrypt.hash(password, 10)
    const connection = await connectDB()
    await connection.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashed]
    )
    await connection.end()
    res.redirect('/login')
  } catch (err) {
    console.error(err)
    res.render('register', { error: 'Error al registrarse' })
  }
})

export default app;

