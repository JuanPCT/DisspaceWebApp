const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

class User {
    constructor(userData) {
        this.id = userData.id;
        this.username = userData.username;
        this.email = userData.email;
        this.password = userData.password;
        this.first_name = userData.first_name;
        this.last_name = userData.last_name;
        this.role = userData.role;
        this.created_at = userData.created_at;
        this.updated_at = userData.updated_at;
        this.is_active = userData.is_active;
        this.last_login = userData.last_login;
    }

    // Crear un nuevo usuario
    static async create(userData) {
        try {
            // Hash de la contraseña
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

            const sql = `
                INSERT INTO users (username, email, password, first_name, last_name, role)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            const params = [
                userData.username,
                userData.email,
                hashedPassword,
                userData.first_name,
                userData.last_name,
                userData.role || 'user'
            ];

            const result = await query(sql, params);
            
            // Retornar el usuario creado (sin la contraseña)
            const newUser = await User.findById(result.insertId);
            return newUser;
            
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    // Buscar usuario por ID
    static async findById(id) {
        try {
            const sql = 'SELECT * FROM users WHERE id = ? AND is_active = TRUE';
            const users = await query(sql, [id]);
            
            if (users.length === 0) {
                return null;
            }

            const userData = users[0];
            delete userData.password; // No retornar la contraseña
            return new User(userData);
            
        } catch (error) {
            console.error('Error al buscar usuario por ID:', error);
            throw error;
        }
    }

    // Buscar usuario por email
    static async findByEmail(email) {
        try {
            const sql = 'SELECT * FROM users WHERE email = ? AND is_active = TRUE';
            const users = await query(sql, [email]);
            
            if (users.length === 0) {
                return null;
            }

            return new User(users[0]);
            
        } catch (error) {
            console.error('Error al buscar usuario por email:', error);
            throw error;
        }
    }

    // Buscar usuario por username
    static async findByUsername(username) {
        try {
            const sql = 'SELECT * FROM users WHERE username = ? AND is_active = TRUE';
            const users = await query(sql, [username]);
            
            if (users.length === 0) {
                return null;
            }

            return new User(users[0]);
            
        } catch (error) {
            console.error('Error al buscar usuario por username:', error);
            throw error;
        }
    }

    // Verificar si existe un usuario con el email o username
    static async existsEmailOrUsername(email, username) {
        try {
            const sql = 'SELECT id FROM users WHERE (email = ? OR username = ?) AND is_active = TRUE';
            const users = await query(sql, [email, username]);
            return users.length > 0;
        } catch (error) {
            console.error('Error al verificar existencia de usuario:', error);
            throw error;
        }
    }

    // Validar contraseña
    async validatePassword(password) {
        try {
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            console.error('Error al validar contraseña:', error);
            return false;
        }
    }

    // Actualizar último login
    async updateLastLogin() {
        try {
            const sql = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?';
            await query(sql, [this.id]);
            this.last_login = new Date();
        } catch (error) {
            console.error('Error al actualizar último login:', error);
            throw error;
        }
    }

    // Obtener información del usuario sin contraseña
    getPublicInfo() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            first_name: this.first_name,
            last_name: this.last_name,
            full_name: `${this.first_name} ${this.last_name}`,
            role: this.role,
            created_at: this.created_at,
            last_login: this.last_login
        };
    }

    // Obtener todos los usuarios (para administración)
    static async findAll(limit = 50, offset = 0) {
        try {
            const sql = `
                SELECT id, username, email, first_name, last_name, role, created_at, last_login, is_active
                FROM users
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?
            `;
            const users = await query(sql, [limit, offset]);
            return users.map(user => new User(user));
        } catch (error) {
            console.error('Error al obtener todos los usuarios:', error);
            throw error;
        }
    }

    // Contar total de usuarios
    static async count() {
        try {
            const sql = 'SELECT COUNT(*) as total FROM users WHERE is_active = TRUE';
            const result = await query(sql);
            return result[0].total;
        } catch (error) {
            console.error('Error al contar usuarios:', error);
            throw error;
        }
    }
}

module.exports = User;
