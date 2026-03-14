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

<<<<<<< HEAD
=======
//rotta di show
router.get('/:id', productController.showProductById);



>>>>>>> 0796a8735d6e9a0295ac1f60ced59e4a8072be6d
//rotta di show
router.get('/:id', productController.showProductById);

//export rotte
module.exports = router;