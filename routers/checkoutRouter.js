//importiamo parte di express
const express = require('express');
//utilizziamo parte di express per gestire le rotte
const router = express.Router();
//importo relaivo controller
const checkoutController = require('../controllers/checkoutController')

/*router.post('/', checkoutRouter.createOrder);*/

//definisco rotta post
router.post('/checkout', (req, res) => {
    console.log("--- IL ROUTER FUNZIONA! ---");
    res.send("Il router riceve la chiamata");
});

module.exports = router