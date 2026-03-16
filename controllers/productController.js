//importiamo la connessione del DB
const connection = require('../data/db');

//funzione di index per i prodotti
function indexProducts(req, res) {
    //leggo il parametro di ricerca passato nella query string
    const { search, category, region } = req.query;
    //preparo la query con la join per le categorie where 1=1 per aggiungere gli and a cascata
    let sql = `
        SELECT products.*, 
        categories.name AS nomi_categorie,
        regions.name AS nomi_regioni
        FROM products
        JOIN categories ON products.category_id = categories.id
        JOIN regions ON products.region_id = regions.id
        WHERE 1=1
    `;
    const params = [] //array vuoto dove a cascata verrano inserito cio che mi serve per preparare la query parametrizzata

    if (search) { //aggiungo filtro search se esiste

        //preparo query parametrizzata e pusho cio che viene cercato come ... per evitare sql injectio
        sql += ' AND products.name LIKE ?';
        params.push(`%${search}%`);
    }

    if (category) {//aggiungo filtro categoria se esiste
        sql += " AND categories.name = ?";
        params.push(category);
    }

    if (region) {//aggiungo filtro regione se esiste
        sql += " AND regions.name = ?";
        params.push(region)
    }

    // eseguo unica query passando il array parametrizzato params
    connection.query(sql, params, (err, results) => {
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
    /*} else {
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
    }*/
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

//funzione rotta prodotti correlati
function relatedProducts(req, res) {

    //estraiamo l'id del prodotto dalla URL
    const { id } = req.params;


    //query SQL per recuperare i prodotti correlati
    const sql = `
        SELECT DISTINCT p2.*
        FROM products p1
        JOIN products p2
        ON (
            p1.category_id = p2.category_id
            OR
            p1.region_id = p2.region_id
        )
        WHERE p1.id = ?
        AND p2.id != ?
        ORDER BY RAND()
        LIMIT 4
    `;

    //eseguiamo la query
    connection.query(sql, [id, id], (err, results) => {

        //gestione errore database
        if (err) {
            return res.status(500).json({
                error: "Errore nel recupero dei prodotti correlati"
            });
        }

        // aggiungi l'immagine completa
        const data = results.map(p => ({
            ...p,
            image: req.imagePath + p.image
        }));

        //restituiamo i risultati in formato JSON
        res.json(data);

    });

}

//funzione di index per le categorie
function indexCategories(req, res) {
    //preparo la query
    const sql = 'select * from categories'
    //eseguo la query
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' })
        res.json(results)
    });
}

//export controller
module.exports = {
    indexProducts,
    indexRegions,
    showProductById,
    showProductBySlug,
    getProductsByRegionName,
    getFavorites,
    getOils,
    getRandomProducts,
    relatedProducts,
    indexCategories
};