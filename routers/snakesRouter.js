const express = require('express');
//creo router con express
const router = express.Router();

const snakeController = require('../controllers/snakeController');
//index
router.get('/', snakeController.index);
//show
router.get('/:slug', snakeController.show);
//store 
router.post('/', snakeController.store);
//patch
router.patch('/:id', snakeController.patch);


module.exports = router;