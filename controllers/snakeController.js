const connection = require("../data/db")

//CRUD
//index
function index(req, res) {

    const sql =

        `
    SELECT products.*, habitat, temperament
    FROM products
    JOIN habitats ON habitat_id = habitats.id
    JOIN temperaments ON temperament_id = temperaments.id
    `


    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ errorMessage: `Database message error` })
        res.json(results)
    })
}

//show
function show(req, res) {

    const { slug } = req.params

    const sql =

    `
    SELECT products.*, habitat, temperament
    FROM products
    JOIN habitats ON habitat_id = habitats.id
    JOIN temperaments ON temperament_id = temperaments.id
    WHERE products.slug = ?
    `

    connection.query(sql, [slug], (err, results) => {
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


// CHIAMATA PER MODIFICARE "AVAILABLE" CHE ATTUALMENTE NON SERVE

//patch
// function patch(req, res) {

//     const { id } = req.params

//     const sql = ""



//     connection.query(sql, [id], (err, results) => {
//         if (err) return res.status(500).json({ errorMessage: `Database message error` })
//         res.status(200).json({ Message: "Data changed successfully, stock updated!" })
//     })

// } 





module.exports = { index, show, store };