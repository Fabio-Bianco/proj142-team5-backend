const connection = require("../data/db");

function index(req, res) {
  const { sort, habitat, temperament, discount, morph } = req.query;

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

  //filtro per morph
  if (morph === "true") {
    sql += " AND morph != 'normal'"
  } else if (discount === "false") {
    sql += " AND MORPH = 'normal'"
  }


  //filtro sconto
  if (discount === "true") {
    sql += " AND products.discount > 0";
  } else if (discount === "false") {
    sql += " AND products.discount = 0";
  }

  if (habitat) {
    sql += " AND habitats.habitat = ?";
    params.push(habitat);
  }

  if (temperament) {
    sql += " AND temperaments.temperament = ?";
    params.push(temperament);
  }

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
