const express = require('express');
const router = express.Router();
const User = require('../models/User');
const List = require('../models/List');
const { hasRole, authenticateToken } = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.get('/users', hasRole('admin'), async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get('/users/:userId/lists', hasRole('admin'), async (req, res) => {
  const userId = req.params.userId;
  const lists = await List.find({ author: userId });
  res.json(lists);
});

router.delete('/users/:userId', hasRole('admin'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndRemove(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ message: 'User successfully deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the user.' });
  }
});

module.exports = router;