//importiamo la connessione del DB
const connection = require('../data/db');

//funzione di index
function index(req, res) {

    //prepariamo la query
    const sql = 'SELECT * FROM products';

    //eseguiamo la query!
    connection.query(sql, (err, results) => {
        if (err)
            return res.status(500).json({ error: 'Database query failed' });

        //creo una copia dei risultati con modifica path imgs
        const products = results.map(product => {
            return {
                ...product,
                image: req.imagePath + product.image
            }
        })

        res.json(products);
    });
}




//export controller
module.exports = { index }