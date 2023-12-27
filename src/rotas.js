//const app = require('./servidor');
//const rotas = app;
const express = require('express');
const rotas = express();
const pool = require('./conexao');
const verificacao = require('./intermediarios/autorizacao')

const usuarios = require('./controladores/usuarios');
const produtos = require('./controladores/produtos');

rotas.post('/usuario', usuarios.cadastro)
rotas.post('/login', usuarios.login)

rotas.use(verificacao)

rotas.get('/usuario', usuarios.conta)
rotas.put ('/usuario',usuarios.alterarDados)
rotas.get('/produtos', produtos.listar)
rotas.get('/produtos/:id', produtos.produto_por_id)
rotas.post('/produtos', produtos.cadastrar)
rotas.put('/produtos/:id', produtos.atualizar)
rotas.delete('/produtos/:id', produtos.deletar)

module.exports = rotas;