const express = require('express');
const app = express();
const port = process.env.PORT;

//import middelware CORS
const cors = require("cors");

//attivazione della cartella public per uso file statici
app.use(express.static('public'));

//rotta home APP
app.get('/api', (req, res) => {
    res.send("<h1>Questa sarà la HomePage della pagina</h1>")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})