const express = require('express');

const router = express.Router();

const snakeController = require('../controllers/snakeController');
//index
router.get('/', snakeController.index);

module.exports = router;