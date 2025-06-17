const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/authController');
const { requireGuest } = require('../middleware/auth');

// Validaciones
const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
        .isLength({ min: 1 })
        .withMessage('La contraseña no puede estar vacía')
];

const registerValidation = [
    body('username')
        .isLength({ min: 3, max: 50 })
        .withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        }),
    body('first_name')
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres')
        .trim(),
    body('last_name')
        .isLength({ min: 2, max: 50 })
        .withMessage('El apellido debe tener entre 2 y 50 caracteres')
        .trim()
];

// Rutas de autenticación
router.get('/login', requireGuest, authController.showLogin);
router.post('/login', requireGuest, loginValidation, authController.processLogin);

router.get('/register', requireGuest, authController.showRegister);
router.post('/register', requireGuest, registerValidation, authController.processRegister);

router.post('/logout', authController.logout);

module.exports = router;
