const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la conexión
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'disspace_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para inicializar la base de datos
async function initializeDatabase() {
    try {
        // Crear la base de datos si no existe
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });

        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        await connection.end();

        console.log(`📊 Base de datos '${dbConfig.database}' creada/verificada`);

        // Crear tablas
        await createTables();
        
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        throw error;
    }
}

// Función para crear las tablas necesarias
async function createTables() {
    try {
        // Tabla de usuarios
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE,
                last_login TIMESTAMP NULL,
                INDEX idx_username (username),
                INDEX idx_email (email)
            )
        `;

        await pool.execute(createUsersTable);
        console.log('✅ Tabla users creada/verificada');

        // Tabla de sesiones (opcional, para persistencia de sesiones)
        const createSessionsTable = `
            CREATE TABLE IF NOT EXISTS sessions (
                session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
                expires INT(11) UNSIGNED NOT NULL,
                data MEDIUMTEXT COLLATE utf8mb4_bin,
                PRIMARY KEY (session_id)
            )
        `;

        await pool.execute(createSessionsTable);
        console.log('✅ Tabla sessions creada/verificada');

    } catch (error) {
        console.error('Error al crear las tablas:', error);
        throw error;
    }
}

// Función para ejecutar consultas
async function query(sql, params = []) {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Error en la consulta:', error);
        throw error;
    }
}

// Función para cerrar el pool de conexiones
async function closePool() {
    try {
        await pool.end();
        console.log('🔒 Pool de conexiones cerrado');
    } catch (error) {
        console.error('Error al cerrar el pool:', error);
    }
}

module.exports = {
    pool,
    query,
    initializeDatabase,
    closePool
};
