// build your `/api/tasks` router here
const express = require('express');
const Task = require('./model');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const task = await Task.getAll();
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
