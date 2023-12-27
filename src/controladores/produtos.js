const pool = require('../conexao');
const jwt = require('jsonwebtoken');
const senhaJwt = require('../senhaJwt');

const cadastrar = async (req, res) =>{
    const {nome, quantidade, preco, categoria, descricao, imagem} = req.body;
    
    if (!nome){
        return res.status(400).json({mensagem: "Nome é obrigatório"});
    }
    if (!quantidade){
        return res.status(400).json({mensagem: "Quantidade é obrigatória"});
    }
    if (quantidade < 1){
        return res.status(400).json({mensagem: "Quantidade Insuficiente para cadastro"})
    }
    if (!preco){
        return res.status(400).json({mensagem: "Preço é obrigatório"});
    }
    if (!descricao){
        return res.status(400).json({mensagem: "Descrição é obrigatória"});
    }
    
    const query = 
    `insert into produtos
    (usuario_id,nome, quantidade, categoria, preco, descricao, imagem)
    values
    ($1,$2,$3,$4,$5,$6,$7)`
    const params = [req.usuario.id,nome, quantidade,categoria, preco, descricao, imagem]
    try {
        const {} = await pool.query(query, params)
        return res.status(201).json()
        
    } catch (error) {
        return res.status(500).json({mensagem: 'Erro interno do servidor'})
    }

} 

const listar = async (req,res) => {
    try {
        const produtos = await pool.query(
            `select * from produtos where usuario_id = $1`,
            [req.usuario.id]
        )
        if (produtos.rows < 1){
            return res.status(404).json({mensagem: "Nenhum produto cadastrado"})
        }
        else{
            return res.status(200).json(produtos.rows)
        }
        
    } catch (error) {
        return res.status(500).json({mensagem: 'Erro interno do servidor'})
    }
}

const produto_por_id = async (req, res) => {
    const {id} = req.params
    try {
        const produto = await pool.query(
            `select * from produtos where id = $1 and usuario_id = $2`,
            [id,req.usuario.id]
        )
        if (produto.rows < 1){
            return res.status(404).json({mensagem: "O produto não foi encontrado"})
        }
        return res.status(200).json(produto.rows[0])
    } catch (error) {
        return res.status(404).json({mensagem: "Produto não encontrado"})
    } 
}

const atualizar = async (req, res) => {
    const {id} = req.params
    const {nome, quantidade,categoria, preco, descricao, imagem} = req.body
    const params = [nome, quantidade,categoria, preco, descricao, imagem, id]
    
    if (!nome){
        return res.status(400).json({mensagem: "Nome é obrigatório"});
    }
    if (!quantidade){
        return res.status(400).json({mensagem: "Quantidade é obrigatória"});
    }
    if (quantidade < 1){
        return res.status(400).json({mensagem: "Quantidade Insuficiente para cadastro"})
    }
    if (!preco){
        return res.status(400).json({mensagem: "Preço é obrigatório"});
    }
    if (!descricao){
        return res.status(400).json({mensagem: "Descrição é obrigatória"});
    }
    
    try {
        const atualizado = await pool.query(
            `update produtos
            set
            nome = $1,
            quantidade = $2,
            categoria = $3,
            preco = $4,
            descricao = $5,
            imagem = $6
            where id = $7`,
            params
        )
        if (atualizado.rowCount != 1){
            return res.status(404).json({mensagem: "Produto não encontrado"})
        }
        return res.status(200).json()
    } catch (error) {
        return res.status(404).json({mensagem: "Produto não encontrado"})
    }
}

const deletar = async (req, res) => {
    const {id} = req.params
    try {
        const deletado = await pool.query(
            `delete from produtos where id = $1 and usuario_id = $2 `,
            [id, req.usuario.id]
        )
        if (deletado.rowCount != 1){
            return res.status(404).json({mensagem: "Produto não encontrado"})
        }
        return res.status(202).json()
    } catch (error) {
        return res.status(500).json({mensagem: "Erro interno do servidor"})
    }
}
module.exports = {
    cadastrar,
    listar,
    produto_por_id,
    atualizar,
    deletar
}