function notFound(req,res,next){
    res.status(404);
    res.json({
        error: 'Not Found',
        message: 'Serpente non trovato'
    });
};

module.exports = (notFound);