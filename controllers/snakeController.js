//CRUD
//index
function index(req, res) {
    return res.json({
        Message: 'sei su index'
    })
};
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