// Importa l'app configurata da app.js
const app = require('../app');
// Porta di ascolto 
const PORT = process.env.PORT || 3000;
// Avvio server
app.listen(PORT, () => {
  console.log(`🪖🐍 Sergente-Serpente attivo sulla porta ${PORT}`);
});
