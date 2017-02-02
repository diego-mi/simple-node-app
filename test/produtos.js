var express = require('../config/express')();
var request = require('supertest')(express);

/** set environment */
process.env.NODE_ENV = 'test';

beforeEach(function(done) {
    var connection = express.infra.connectionFactory();
    connection.query("delete from livros", function(ex,result){
        if(!ex){
            done();
        }
    });
});

describe('ProdutosController', function () {
    it('listagem json', function (done) {
        request.get('/produtos')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('#cadastro de novo produto com dados invalidos', function (done) {
        request.post('/produtos')
            .send({titulo: "", descricao: "novo livro"})
            .expect(400, done);

    });

    it('#cadastro de novo produto com dados invalidos', function (done) {
        request.post('/produtos')
            .send({titulo: "titulo", descricao: "novo livro", preco: 20.50})
            .expect(302, done);

    });
});