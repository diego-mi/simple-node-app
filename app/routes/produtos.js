module.exports = function (app) {
    app.get('/produtos', function (req, res, next) {
        var connection = app.infra.connectionFactory();
        var produtosDAO = new app.infra.ProdutosDAO(connection);

        produtosDAO.lista(function(erros, resultados){

            if (erros) {
                return next(erros);
            }

            res.format({
                html: function(){
                    res.render("produtos/lista",{lista:resultados});
                },
                json: function(){
                    res.json(resultados);
                }
            });

        });

        connection.end();
    });

    app.get('/produtos/form', function (req, res) {
        res.render('produtos/form', {validationErrors:{},produto:{}});
    });

    app.post("/produtos",function(req,res) {
        var produto = req.body;

        var connection = app.infra.connectionFactory();
        var produtosDAO = new app.infra.ProdutosDAO(connection);

        req.assert('titulo', 'Titulo deve ser preenchido').notEmpty();
        req.assert('preco','Preco deve ser um número').isFloat();

        var errors = req.validationErrors();
        if(errors){
            res.format({
                html: function(){
                    res.status(400).render("produtos/form",{validationErrors:errors,produto:produto});
                },
                json: function(){
                    res.status(400).send(errors);
                }
            });
            return;
        }

        produtosDAO.salva(produto,function(erros,resultado){
            res.redirect("/produtos");
        });

        connection.end();

    });
};