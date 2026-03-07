const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

//rotta di index per regioni
router.get('/', productController.indexRegions);

module.exports = router;