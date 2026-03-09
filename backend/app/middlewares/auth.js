require('dotenv').config()
const secret = process.env.JWT_TOKEN
const jwt = require('jsonwebtoken');
const UsersModel = require('../model/users');


const WithAuth = async (req, res, next) => {

    const token = req.headers['x-acess-token']

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized token' })
    } else {

        try {
            // faz a verificação e  faz a engenharia reversa e manda o decoded
            const decoded = jwt.verify(token, secret)

            // o email é mandado aqui
            req.email = decoded.email
            /// pega os valores do usuário pelo email decodificado
            const user = await UsersModel.FindUser(decoded.email)
            // passa o user para a requisição
            req.user = user


            return next()

        } catch (error) {
            return res.status(401).json({ error: 'Unauthorized token' })
        }

    }

}


module.exports = WithAuth