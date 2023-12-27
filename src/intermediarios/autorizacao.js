const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJwt');
const pool = require('../conexao');

const verificacao = async (req, res,next) => {
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(401).json({mensagem: "Não autorizado"})
    }
    const token = authorization.split(' ')[1];
    try {
        const {id} = jwt.verify(token, senhaJwt)
        const {rows} = await pool.query(
            'select * from usuario where id = $1',
            [id]
            )
        req.usuario = rows[0];
        next()
    } catch (error) {
        return res.status(401).json({mensagem: "Não autorizado"})
    }
}

module.exports = verificacao