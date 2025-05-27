// Importa l'app configurata da app.js
const app = require('../app');
// Porta di ascolto 
const port = process.env.PORT || 3000;
// Avvio server
app.listen(port, () => {
  console.log(`🪖🐍 Sergente-Serpente attivo sulla porta ${port}`);
});