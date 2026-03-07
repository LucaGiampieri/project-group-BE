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

//funzione di show
function show(req, res) {

    //prendiamo l'id dalla route
    const productId = req.params.id;

    //prepariamo la query parametrizzata
    const sql = 'SELECT * FROM products WHERE id = ?';

    //eseguiamo la query
    connection.query(sql, [productId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        //creo una copia del prodotto con path immagine modificato
        const product = {
            ...results[0],
            image: req.imagePath + results[0].image
        };

        res.json(product);
    });
}



//export controller
module.exports = { index, show }