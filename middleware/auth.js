const jwt = require('jsonwebtoken');
const { jwtOptions: {secret} } = require('../config/main');
const Token = require('../models/token');

module.exports = async (req, res, next) => {
    let validToken;
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            res.status(401).json({message: 'Отстутствует токен'});
            return
        }
        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, secret);
        validToken = await Token.findOne({where: {
                idToken: payload.idToken
            }})
        if (payload.type !== 'access' || !validToken) {
            res.status(401).json({message: 'Невалидный токен'});
            return
        }
        next()
    }catch(e) {
        if (e instanceof jwt.JsonWebTokenError) {
            res.status(401).json({message: 'Невалидный токен'});
        } else if (e instanceof jwt.TokenExpiredError) {
            validToken.destroy();
            res.status(401).json({message: 'Срок действия токена истек'});
        }
    }
};
