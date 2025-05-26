const connection = require("../data/db")

//CRUD
//index
function index(req, res) {

    const sql =

        `
    SELECT *, snakes.id as snakes_id
    FROM products
    JOIN snakes ON product_id = products.id
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
    WHERE products.product_slug = ? AND snakes.id = ?
    `

    connection.query(sql, [slug, id], (err, results) => {
        if (err) return res.status(500).json({ errorMessage: `Database message error` })
        res.json(results)
    })
}

//store
function store(req, res) {

    const { status, total_price, payment_method, first_name, last_name, address, phone_number, email } = req.body

    const sql =

        `
    INSERT INTO orders (status, total_price, payment_method, first_name, last_name, address, phone_number, email) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    connection.query(sql, [status, total_price, payment_method, first_name, last_name, address, phone_number, email], (err, results) => {
        if (err) return res.status(500).json({ errorMessage: `Database message error` })
        res.status(201).json({ Message: "Order placed!" })
    })

};

//patch
function patch(req, res) {

    const { id } = req.params

    const sql = 

    `
    UPDATE products
    JOIN snakes ON snakes.product_id = products.id
    SET products.stock = (products.stock-1), snakes.available = 0
    WHERE snakes.id = ?;

    `

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ errorMessage: `Database message error` })
        res.status(200).json({ Message: "Data changed successfully, stock updated!" })
    })

}



module.exports = { index, show, store, patch };