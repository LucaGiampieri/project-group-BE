//importiamo parte di express
const express = require('express');
//utilizziamo parte di express per gestire le rotte
const router = express.Router();

//importiamo relativo controller
const productController = require("../controllers/productController");

//rotta di index per prodotti
router.get('/', productController.indexProducts);

//  rotta preferiti
router.get('/favorites', productController.getFavorites);

// rotta per gli oli 
router.get("/oils", productController.getOils);

// rotta prodotti random
router.get('/random', productController.getRandomProducts);


//rotta si show by slug
router.get('/slug/:slug', productController.showProductBySlug);

//rotta di show
router.get('/:id', productController.showProductById);



//export rotte
module.exports = router;