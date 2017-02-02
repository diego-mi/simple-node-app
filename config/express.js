var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

module.exports = function () {

    var app = express();
    /** set public path */
    app.use(express.static('./app/public'));
    /** set view engine */
    app.set('view engine', 'ejs');
    /** set view path - path relativo a app.js */
    app.set('views', './app/views');
    /** body parser para captura de parametros de post */
    app.use(bodyParser.urlencoded({extended: true}));
    /** body parser para aceitar comandos por terminal recebendo json */
    app.use(bodyParser.json());
    /** validator */
    app.use(expressValidator());

    /** carrega as rotas e as dependencias*/
    load('routes', {cwd:'app'}).then('infra').into(app);

    /** middleware para erros 404 */
    app.use(function(req,res,next){
        res.status(404).render('erros/404');
        next();
    });

    /** middleware para erros 500 */
    app.use(function(error, req,res,next){
        if(process.env.NODE_ENV == 'production') {
            res.status(500).render('erros/500', {erro: {}});
            return;
        }
        next(error);
    });

    return app;
};