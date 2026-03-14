//importiamo la connessione del DB
const connection = require('../data/db');

function checkout(req, res) {

    //prendiamo dal body della richiesta i dati necessari al checkout
    const { shippingData, billingData, products, shipping_price, discount_code } = req.body;

    //creiamo una variabile per l'inserimento dati spedizione
    const shippingSql = `
        INSERT INTO shipping_datas
        (name,surname,country,email,phone,region,province,city,postal_code,street)
        VALUES (?,?,?,?,?,?,?,?,?,?)
    `;

    //eseguiamo la query di inserimento spedizione
    connection.query(
        shippingSql,
        [
            shippingData.name,
            shippingData.surname,
            shippingData.country,
            shippingData.email,
            shippingData.phone,
            shippingData.region,
            shippingData.province,
            shippingData.city,
            shippingData.postal_code,
            shippingData.street
        ],
        (err, shippingResult) => {

            //se errore DB ritorno subito
            if (err) return res.status(500).json(err);

            //salviamo id spedizione appena creata
            const shippingId = shippingResult.insertId;

            //creiamo una varibile per l'inserimento dati fatturazione
            const billingSql = `
            INSERT INTO billing_datas
            (name,surname,country,email,phone,region,province,city,postal_code,street)
            VALUES (?,?,?,?,?,?,?,?,?,?)
        `;

            connection.query(
                billingSql,
                [
                    billingData.name,
                    billingData.surname,
                    billingData.country,
                    billingData.email,
                    billingData.phone,
                    billingData.region,
                    billingData.province,
                    billingData.city,
                    billingData.postal_code,
                    billingData.street
                ],
                (err, billingResult) => {

                    //se errore DB fatturazione
                    if (err) return res.status(500).json(err);

                    //salviamo id fatturazione
                    const billingId = billingResult.insertId;

                    //gestione sconto
                    //valore sconto di default
                    let discountAmount = 0;

                    //id codice sconto di default
                    let discountId = null; // ora possiamo usare null se la colonna lo permette

                    //creiamo una funzione per creare l'ordine e associare i prodotti
                    const createOrder = () => {

                        //calcolo totale prodotti (price * quantity)
                        const totalProducts = (products || []).reduce((sum, p) => sum + p.price * p.quantity, 0);

                        //calcolo totale ordine = prodotti + spedizione - sconto
                        const totalAmount = totalProducts + shipping_price - discountAmount;

                        //creiamo una variabile per l'inserimento ordine nella tabella orders
                        const orderSql = `
                    INSERT INTO orders
                    (shipping_data_id,billing_data_id,total_amount,order_date,shipping_price,applided_discount_code,discount_amount)
                    VALUES (?,?,?,?,?,?,?)
                `;

                        //se la colonna permette NULL, passa null se non c'è codice sconto
                        connection.query(orderSql, [
                            shippingId,
                            billingId,
                            totalAmount,
                            new Date(),
                            shipping_price,
                            discountId, // null se nessuno sconto
                            discountAmount
                        ], (err, orderResult) => {

                            //errore DB ordine
                            if (err) return res.status(500).json(err);

                            //salviamo id ordine
                            const orderId = orderResult.insertId;

                            //inserimento prodotti associati all'ordine
                            //prepariamo array [[orderId, productId, price, quantity], ...]
                            const orderProducts = products.map(p => [orderId, p.id, p.price, p.quantity]);

                            const orderProductSql = `
                        INSERT INTO order_product (order_id, product_id, price, quantity)
                        VALUES ?
                    `;

                            connection.query(orderProductSql, [orderProducts], (err) => {

                                //errore DB prodotti ordine
                                if (err) return res.status(500).json(err);

                                // se tutto ok, ritorno successo al client con dati ordine
                                res.json({
                                    success: true,
                                    order: {
                                        id: orderId,
                                        shippingData,
                                        billingData,
                                        products,
                                        shipping_price,
                                        discount_code,
                                        discountAmount,
                                        totalAmount
                                    }
                                });

                            });

                        });
                    };

                    //se c'è codice sconto, controllo validità
                    if (discount_code) {

                        const discountSql = `
                    SELECT * FROM discount_codes
                    WHERE code = ? AND expires_at > NOW()
                `;

                        connection.query(discountSql, [discount_code], (err, result) => {

                            //errore DB sconto
                            if (err) return res.status(500).json(err);

                            //se codice valido aggiorniamo id e amount dello sconto
                            if (result.length > 0) {
                                discountId = result[0].id;
                                discountAmount = result[0].percentage;
                            }

                            //creaimo ordine dopo aver gestito sconto
                            createOrder();

                        });

                    } else {

                        //se nessun codice sconto, creiamo subito l'ordine
                        createOrder();

                    }

                });
        });

}

module.exports = { checkout };