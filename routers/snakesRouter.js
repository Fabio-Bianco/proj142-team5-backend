const express = require('express');
//creo router con express
const router = express.Router();

const snakeController = require('../controllers/snakeController');
//index
router.get('/', snakeController.index);
//show
router.get('/:slug/:id', snakeController.show);
//store 
router.post('/', snakeController.store);
//delete
router.delete('/', snakeController.destroy);

module.exports = router;