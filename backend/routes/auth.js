const express = require('express');
const authMiddleware = require('../middleware/auth');
const { login, logout, me, register, getStats, updateProfile } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, me);
router.get('/stats', authMiddleware, getStats);
router.patch('/profile', authMiddleware, updateProfile);

module.exports = router;
