const connection = require("../data/db")

//CRUD
//index
function index(req, res) {

    const sql = `SELECT * FROM product`

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ errorMessage: `Database message error` })
        res.json(results)
    })
}

//show
function show(req, res) {
    return res.json({
        Message: 'sei su show'
    })
};
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