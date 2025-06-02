const connection = require("../data/db");

function post(req, res) {
    const {
        status,
        total_price,
        payment_method,
        first_name,
        last_name,
        address,
        phone_number,
        email
    } = req.body

    const sql =

        `
    INSERT INTO orders (status, total_price, payment_method, first_name, last_name, address, phone_number, email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `

    connection.query(sql,
        [
            status,
            total_price,
            payment_method,
            first_name,
            last_name,
            address,
            phone_number,
            email
        ],

        (err, results) => {
            if (err) {
                return res.status(500).json({ errorMessage: "Errore del database" });
            }
            res.status(200).json(results);
        })
}

module.exports = { post };