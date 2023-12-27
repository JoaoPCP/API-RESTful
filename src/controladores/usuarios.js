const pool = require('../conexao');
const jwt = require('jsonwebtoken');
const senhaJwt = require('../senhaJwt');
const bcrypt = require('bcrypt');

const cadastro = async (req, res) => {
    const {nome, email, senha, nome_loja} = req.body;
    
    const query = `insert into usuario (nome, email, senha, nome_loja) values ($1,$2,$3,$4)`

    if (!nome){
        return res.status(400).json({mensagem: "Nome é obrigatório"});
    }
    if (!email){
        return res.status(400).json({mensagem: "email é obrigatório"});
    }
    if (!senha){
        return res.status(400).json({mensagem: "senha é obrigatório"});
    }
    if (!nome_loja){
        return res.status(400).json({mensagem: "senha é obrigatório"});
    }
    const repEmail = await pool.query(`select email from usuario where email = $1`, [email])
    if (repEmail.rowCount != 0) {
      res.status(400).json({"mensagem": "Ja existe usuário cadastraado com o email informado"})
    }
    else{
        try{
        const criptoSenha = await bcrypt.hash(senha,10)
        const {} = await pool.query(query, [nome, email,criptoSenha, nome_loja]);
        res.status(201).json();
            
        }catch(error){
            res.status(500).json({mensagem: " Erro interno do servidor."})
        }
    }
}

const login = async (req, res) => {
    const {email, senha} = req.body
    
    if (!email){
        return res.status(400).json({mensagem: "email é obrigatório"});
    }
    if (!senha){
        return res.status(400).json({mensagem: "senha é obrigatório"});
    }

    try {
        const user = await pool.query(
            `select * from usuario where email = $1`,
            [email]
            );


        if (user.rowCount != 1){
            return res.status(404).json({mensagem: "Usuario ou senha inválidos"})
        }

        const senhaValida = await bcrypt.compare(senha,user.rows[0].senha)
        
        if(!senhaValida){
            return res.status(404).json({mensagem: "Usuario ou senha inválidos"})
        }
        else{
            const token = jwt.sign({id: user.rows[0].id}, senhaJwt,{
                expiresIn: '8h'
            })
            return res.status(200).json({token})
        }
        
    } catch (error) {
        res.status(500).json({mensagem: "Erro interno no servidor"})
    }
}

const conta = async (req, res) => {
    return res.json(req.usuario)      
}

const alterarDados = async (req, res) => {
    const {nome, email, senha, nome_loja} = req.body;
    const query = 
    `update usuario 
    set 
    nome = $1,
    email = $2,
    senha = $3,
    nome_loja = $4
    where id = $5`

    if (!nome){
        return res.status(400).json({mensagem: "Nome é obrigatório"});
    }
    if (!email){
        return res.status(400).json({mensagem: "email é obrigatório"});
    }
    if (!senha){
        return res.status(400).json({mensagem: "senha é obrigatório"});
    }
    if (!nome_loja){
        return res.status(400).json({mensagem: "senha é obrigatório"});
    }
    const repEmail = await pool.query(
        `select email from usuario where email = $1`, 
        [email]
    )
    if (repEmail.rowCount != 0) {
      res.status(400).json({"mensagem": "Ja existe usuário cadastrado com o email informado"})
    }
    else{
        try{
        const criptoSenha = await bcrypt.hash(senha,10)
        const {} = await pool.query(query,[nome, email,criptoSenha, nome_loja, req.usuario.id]);
        
        return res.status(200).json();
            
        }catch(error){
            res.status(401).json({mensagem: " Não autorizado"})
        }
    }
}
module.exports = {
    cadastro,
    login,
    conta,
    alterarDados
}