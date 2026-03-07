//importiamo parte di express
const express = require('express');
//utilizziamo parte di express per gestire le rotte
const router = express.Router();

//importiamo relativo controller
const productController = require("../controllers/productController");

//rotta di index
router.get('/', productController.index);

// //rotta di show
// router.get('/:id', productController);



//export rotte
module.exports = router;