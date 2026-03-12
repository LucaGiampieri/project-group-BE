//importiamo la connessione del DB
const connection = require('../data/db');

//funzione di index per i prodotti
function indexProducts(req, res) {

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

//funzione di index per le regioni
function indexRegions(req, res) {

    //prepariamo la query
    const sql = 'SELECT * FROM regions';

    //eseguiamo la query!
    connection.query(sql, (err, results) => {
        if (err)
            return res.status(500).json({ error: 'Database query failed' });

        //creo una copia dei risultati con modifica path imgs
        const regions = results.map(region => {
            return {
                ...region,
                image: req.imagePath + region.image
            }
        })

        res.json(regions);
    });
}

//funzione di show
function showProductById(req, res) {

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

function showProductBySlug(req, res) {

    //prendiamo lo slug dalla route
    const productSlug = req.params.slug;

    //prepariamo la query parametrizzata
    const sql = 'SELECT * FROM products WHERE slug = ?';

    //eseguiamo la query
    connection.query(sql, [productSlug], (err, results) => {
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

//Funzione prodotti favoriti 

function getFavorites(req, res) {


    const sql = `
        SELECT *
        FROM products
        WHERE favorites = 1
        ORDER BY RAND()
        LIMIT 6
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }

        const products = results.map(product => {
            return {
                ...product,
                image: req.imagePath + product.image
            };
        });

        res.json(products);
    });
}

// funzione tavola degli oli 

function getOils(req, res) {

    const sql = `
        SELECT *
        FROM products
        WHERE category_id = 23
        ORDER BY RAND()
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }

        const products = results.map(product => {
            return {
                ...product,
                image: req.imagePath + product.image
            };
        });

        res.json(products);
    });
}

// Funzione prodottti random 

function getRandomProducts(req, res) {

    const sql = `
        SELECT *
        FROM products
        ORDER BY RAND()
        LIMIT 12
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }

        const products = results.map(product => {
            return {
                ...product,
                image: req.imagePath + product.image
            };
        });

        res.json(products);
    });
}

// funzione per prodotti regione
function getProductsByRegionName(req, res) {

    const regionName = req.params.name;

    const sql = `
        SELECT products.*
        FROM products
        JOIN regions ON products.region_id = regions.id
        WHERE regions.name = ?
    `;

    connection.query(sql, [regionName], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }

        const products = results.map(product => {
            return {
                ...product,
                image: `http://localhost:3000/images/product-images/${product.image}`
            };
        });

        res.json(products);
    });
}


//export controller
module.exports = { indexProducts, indexRegions, showProductById, showProductBySlug, getFavorites, getOils, getRandomProducts, getProductsByRegionName }
