// Importa il modulo Express
const express = require('express');
// Crea un'app Express
const app = express();
// Middleware base (puoi aggiungerne altri in futuro)
app.use(express.json());
//importo il router
const snakesRouter = require('./routers/snakesRouter');

app.get('/', (req,res) => {
    res.send('Benvenuto da Sergente Serpente!')
});

app.use('/api/snakes', snakesRouter);

// Messaggio di log per segnalare che l'app è stata configurata
console.log('⚙️ App Express configurata e pronta all’uso');

module.exports = app;
