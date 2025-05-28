const connection = require("../data/db");

// GET: Lista serpenti con ordinamento dinamico
function index(req, res) {
  const { sort } = req.query;

  const validSorts = {
    name: "LOWER(common_name) ASC",
    name_desc: "LOWER(common_name) DESC",
    price: "price ASC",
    price_desc: "price DESC"
  };

  let sql = `
    SELECT products.*, habitat, temperament
    FROM products
    JOIN habitats ON habitat_id = habitats.id
    JOIN temperaments ON temperament_id = temperaments.id
    ORDER BY ${validSorts[sort] || "LOWER(common_name) ASC"}
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ errorMessage: "Database message error" });
    }
    res.json(results);
  });
}

// GET: Dettaglio serpente per slug
function show(req, res) {
  const { slug } = req.params;

  const sql = `
    SELECT products.*, habitat, temperament
    FROM products
    JOIN habitats ON habitat_id = habitats.id
    JOIN temperaments ON temperament_id = temperaments.id
    WHERE products.slug = ?
  `;

  connection.query(sql, [slug], (err, results) => {
    if (err) {
      return res.status(500).json({ errorMessage: "Database message error" });
    }
    res.json(results[0] || {});
  });
}

module.exports = {
  index,
  show
};
