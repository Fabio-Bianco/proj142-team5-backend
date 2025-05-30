// Importa il modulo Express
const express = require('express');
// Crea un'app Express
const app = express();
//importo il middleware cors
const cors = require('cors');
//registri il middleware cors
app.use(cors({
    origin: process.env.FE_APP
}));
//registro middleware asset statici
app.use(express.static('public'));
//registro middleware body parser
app.use(express.json());
//importo il router
const snakesRouter = require('./routers/snakesRouter');
//importo middleware errorsHandler
const errorsHandler = require('./middlewares/errorsHandler');
//importo middleware notFound
const notFound = require('./middlewares/notFound');


app.get('/', (req, res) => {
    res.send('Benvenuto da Sergente Serpente!')
});
//registro la path del router
app.use('/api/snakes', snakesRouter);
//registro middleware errorsHandler
app.use(errorsHandler);
//registro middleware notFound
app.use(notFound);


// Messaggio di log per segnalare che l'app è stata configurata
console.log('⚙️ App Express configurata e pronta all’uso');

module.exports = app;