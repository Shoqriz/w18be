const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const userRoutes = require('./todolist');

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/user', userRoutes);

module.exports = router;