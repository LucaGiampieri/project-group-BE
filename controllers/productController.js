//importiamo la connessione del DB
const connection = require('../data/db');

//funzione di index per i prodotti
function indexProducts(req, res) {
    //leggo il parametro di ricerca passato nella query string
    const search = req.query.search;

    let sql; //varaibile per memorizare la query che deve cambiare dinamicamente 

    if (search) {
        //se search esiste eseguo la logica di ricerca prodotto
        const searchPattern = `%${search}%`; //creo un pattern che nel preaprare la query di ricerca con LIKE mi restituisce aad esempio '%vino%'

        //preparo query parametrizzata
        sql = 'SELECT * FROM products WHERE name LIKE ?';

        // eseguo la query passando il parametro parametrizzato [searchPattern]
        connection.query(sql, [searchPattern], (err, results) => {
            if (err)
                return res.status(500).json({ error: 'Database query failed' }); // errore database

            //modifica il path delle immagini per ogni prodotto
            const products = results.map(product => ({
                ...product,
                image: req.imagePath + product.image
            }));

            //restituisco il json dei prodotti cercati/filtrati
            res.json({
                totals: products.length,
                results: products,
            }
            );
        });
    } else {
        //se search non esiste...
        sql = 'SELECT * FROM products'; //preparo la query che mi restitusce tutti iprodotti

        connection.query(sql, (err, results) => {
            if (err)
                return res.status(500).json({ error: 'Database query failed' }); // errore database

            //modifica il path delle immagini per ogni prodotto
            const products = results.map(product => ({
                ...product,
                image: req.imagePath + product.image
            }));

            //restituisco jsn di tutti i prodotti
            res.json(products);
        });
    }
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

//funzione di show per id
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

//funzione di show per slug
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

//funzione di show per regione
function showProductsByRegionName(req, res) {

    //prendiamo il nome dalla regione
    const regionName = req.params.name;

    //prepariamo la query parametrizzata
    const sql = `
        SELECT products.*
        FROM products 
        JOIN regions  ON products.region_id = regions.id
        WHERE LOWER(regions.name) = LOWER(?)
    `;

    //eseguiamo la query
    connection.query(sql, [regionName], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });


        //creo una copia del prodotto con path immagine modificato
        const products = results.map(product => ({
            ...product,
            image: req.imagePath + product.image
        }));

        res.json(products);
    });
}


//export controller
module.exports = { indexProducts, indexRegions, showProductById, showProductBySlug, showProductsByRegionName }
