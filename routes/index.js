const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const { requireAuth } = require('../middleware/auth');

// Rutas públicas
router.get('/', homeController.home);

// Rutas protegidas (requieren autenticación)
router.get('/dashboard', requireAuth, homeController.dashboard);
router.get('/profile', requireAuth, homeController.profile);

module.exports = router;
