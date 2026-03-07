const express = require('express');
const app = express();
const port = process.env.PORT;

//import del router dei prodotti
const productRouter = require('./routers/productRouter');
//import del router delle regioni
const regionRouter = require('./routers/regionRouter');

//import del middelware di gestione errore interno 500
const errorsHandler = require("./middlewares/errorsHandler");
//import del middelware di gestione di rotta inesistente
const notFound = require("./middlewares/notFound");
//import middelware di gestione path img
const imagePath = require('./middlewares/imagePath');

//import middelware CORS
const cors = require("cors");

//attivazione CORS
app.use(cors({
    origin: "http://localhost:5173"
}));

//attivazione della cartella public per uso file statici
app.use(express.static('public'));

//rotta home APP
app.get('/api', (req, res) => {
    res.send("<h1>Questa sarà la HomePage della pagina</h1>")
})

//rotte relative al router dei prodotti
app.use('/api/product', imagePath('product-images'), productRouter);

//rotte relative al router delle regioni
app.use('/api/regions', imagePath('regions-images'), regionRouter);

//registriamo middelware di gestione err 500
app.use(errorsHandler);

//registriamo middelware di gestione rotta inesistente
app.use(notFound);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})