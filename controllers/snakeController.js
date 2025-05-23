const connection = require("../data/db")

//CRUD
//index
function index(req, res) {

    const sql =

        `
    SELECT *, snakes.id as snakes_id
    FROM products
    JOIN snakes ON products_id = products.id
    `


    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ errorMessage: `Database message error` })
        res.json(results)
    })
}

//show
function show(req, res) {

    const { slug, id } = req.params

    const sql =

    `
    SELECT *, snakes.id as snakes_id
    FROM products
    JOIN snakes ON product_id = products.id
    WHERE products.slug = ? AND snakes.id = ?
    `

    connection.query(sql, [slug, id], (err, results) => {
        if (err) return res.status(500).json({ errorMessage: `Database message error` })
        res.json(results)
    })
}

//store
function store(req, res) {
    return res.json({
        Message: 'serpente aggiunto'
    })
};
//delete 
function destroy(req, res) {
    return res.json({
        Message: 'serpente rimosso'
    })
};

module.exports = { index, show, store, destroy };