const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

//rotta di index per regioni
router.get('/', productController.indexRegions);

//rotta di show per regione
router.get("/name/:name/products", productController.showProductsByRegionName);

module.exports = router;