const connection = require("../data/db");

// GET: Lista serpenti con ordinamento e filtri dinamici
function index(req, res) {
  const { sort, habitat, temperament, discount } = req.query;

  // Mapping valori validi per l'ordinamento
  const validSorts = {
    name: "LOWER(common_name) ASC",
    name_desc: "LOWER(common_name) DESC",
    price: "price ASC",
    price_desc: "price DESC"
  };

  let sql = `
    SELECT products.*, habitats.habitat, temperaments.temperament
    FROM products
    JOIN habitats ON products.habitat_id = habitats.id
    JOIN temperaments ON products.temperament_id = temperaments.id
    WHERE 1
  `;

  const params = [];

  // filtro sconto
  if (discount) {
    sql += " AND discount != 0"
    params.push(discount)
  }

  // Filtro habitat
  if (habitat) {
    sql += " AND habitats.habitat = ?";
    params.push(habitat);
  }

  // Filtro temperamento
  if (temperament) {
    sql += " AND temperaments.temperament = ?";
    params.push(temperament);
  }

  // Aggiungi ordinamento se valido
  if (validSorts[sort]) {
    sql += ` ORDER BY ${validSorts[sort]}`;
  } else {
    sql += ` ORDER BY LOWER(common_name) ASC`; // default
  }

  // Esegui la query
  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error("Errore DB:", err);
      return res.status(500).json({ errorMessage: "Errore del database" });
    }
    res.json(results);
  });
}

// GET: Dettaglio serpente per slug
function show(req, res) {
  const { slug } = req.params;

  const sql = `
    SELECT products.*, habitats.habitat, temperaments.temperament
    FROM products
    JOIN habitats ON products.habitat_id = habitats.id
    JOIN temperaments ON products.temperament_id = temperaments.id
    WHERE products.slug = ?
  `;

  connection.query(sql, [slug], (err, results) => {
    if (err) {
      console.error("Errore DB:", err);
      return res.status(500).json({ errorMessage: "Errore del database" });
    }
    res.json(results[0] || {});
  });
}

module.exports = { index, show };
