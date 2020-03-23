const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const {jwtOptions: {tokens, secret, secretTwo} } = require('../config/main');
const Token = require('../models/token');
const log = require('../utils/log')(module);

const generateAccessToken = (id) => {
    const payload = {
        id,
        idToken: uuid(),
        type: tokens.access.type
    };
    const options = {expiresIn: tokens.access.expiresIn};
    return {
        id: payload.idToken,
        token: jwt.sign(payload, secret, options)
    }
};
const generateRefreshToken = () => {
    const payload = {
        id: uuid(),
        type: tokens.refresh.type
    };
    const options = {expiresIn: tokens.refresh.expiresIn};
    return {
        id: payload.id,
        token: jwt.sign(payload, secretTwo, options)
    }
};

const writeTokenToDB = async (idToken, idRefreshToken, idUser) => {
    try {
        const token = await Token.findOne({where: { idToken }});
        if (token) await token.destroy();
        const newToken = { idToken, idRefreshToken, idUser };
        await Token.create(newToken)
    } catch (e) {
        log.error('Ошибка при обновлении рефреш токена',  e.message);
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    writeTokenToDB
};
