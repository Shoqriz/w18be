const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const List = require('../models/List');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post(
  '/tasks',
  authenticateToken,
  [
    body('task').notEmpty().withMessage('Task description is required'),
  ],
  async (req, res) => {
    const { task } = req.body;
    const userId = req.user.userId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newTask = new List({ task, author: userId });

    try {
      await newTask.save();
      res.json({ message: 'Task created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create the task' });
    }
  }
);

router.get('/tasks', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const tasks = await List.find({ author: userId });
  res.json(tasks);
});

router.put('/tasks/:taskId', authenticateToken, async (req, res) => {
  const taskId = req.params.taskId;
  const { task } = req.body;
  const userId = req.user.userId;

  try {
    const taskToUpdate = await List.findOneAndUpdate({ _id: taskId, author: userId }, { task }, { new: true });
    if (!taskToUpdate) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(taskToUpdate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the task' });
  }
});

router.delete('/tasks/:taskId', authenticateToken, async (req, res) => {
  const taskId = req.params.taskId;
  const userId = req.user.userId;

  try {
    const task = await List.findOne({ _id: taskId, author: userId });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or you do not have permission to delete it' });
    }

    await List.findByIdAndDelete(taskId);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the task' });
  }
});

router.put('/tasks/complete/:taskId', authenticateToken, async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const task = await List.findByIdAndUpdate(taskId, { completed: true }, { new: true });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark the task as completed' });
  }
});

module.exports = router;