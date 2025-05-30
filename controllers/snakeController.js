const connection = require("../data/db");

function index(req, res) {
  const { sort, habitat, temperament, discount, morph, search } = req.query;

  const validSorts = {
    name: "LOWER(common_name) ASC",
    name_desc: "LOWER(common_name) DESC",
    price: "price ASC",
    price_desc: "price DESC",
    birth: "birth DESC LIMIT 6"
  };

  let sql = `
    SELECT products.*, habitats.habitat, temperaments.temperament
    FROM products
    JOIN habitats ON products.habitat_id = habitats.id
    JOIN temperaments ON products.temperament_id = temperaments.id
    WHERE 1
  `;

  const params = [];

  // 🔍 Filtro di ricerca istantanea sul nome comune
  if (search) {
    sql += " AND LOWER(products.common_name) LIKE ?";
    params.push(`%${search.toLowerCase()}%`);
  }

  // filtro per morph
  if (morph === "true") {
    sql += " AND morph != 'normal'";
  } else if (morph === "false") {
    sql += " AND morph = 'normal'";
  }

  // filtro sconto
  if (discount === "true") {
    sql += " AND products.discount > 0";
  } else if (discount === "false") {
    sql += " AND products.discount = 0";
  }

  // filtro habitat
  if (habitat) {
    sql += " AND habitats.habitat = ?";
    params.push(habitat);
  }

  // filtro temperamento
  if (temperament) {
    sql += " AND temperaments.temperament = ?";
    params.push(temperament);
  }

  // ordinamento
  sql += validSorts[sort] ? ` ORDER BY ${validSorts[sort]}` : ` ORDER BY LOWER(common_name) ASC`;

  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error("Errore DB:", err);
      return res.status(500).json({ errorMessage: "Errore del database" });
    }
    res.json(results);
  });
}

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
