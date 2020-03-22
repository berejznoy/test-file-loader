const User = require('../models/user');
const _ = require('lodash');
const Token = require('../models/token');
const jwt = require('jsonwebtoken');
const bCrypt = require('bcrypt');
const log = require('../utils/log')(module);
const { jwtOptions: {secretTwo} } = require('../config/main');
const authHelper = require('../helpers/auth');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { validationResult } = require('express-validator');


const updateTokens = async (userId) => {
    const accessToken = authHelper.generateAccessToken(userId);
    const refreshToken = authHelper.generateRefreshToken();
    await authHelper.writeTokenToDB(accessToken.id, refreshToken.id, userId);
    return {
        id: accessToken.id,
        accessToken: accessToken.token,
        refreshToken: refreshToken.token
    }
};

exports.authorization = async (req, res) => {
    try {
        const { id, password} = req.body;
        const user = await User.findOne({where: {
                id
            }});
        if(!user) {
            res.status(401).json({message: 'Пользователь не существует'});
            return
        }
        const isValidPassword = await bCrypt.compare(password, user.password);
        if(isValidPassword) {
            const tokens = await updateTokens(id);
            res.status(200).json({
                ...tokens
            })
        } else {
            res.status(401).json({message: 'Неправильное логин или пароль'});
        }
    } catch(err) {
        log.error('Internal error(%d): %s',res.statusCode,err.message);
        res.status(500).json({message: 'Server error'});
    }
};

exports.refreshToken = async (req, res) => {
    const {refreshToken} = req.body;
    let payload;
    try {
        payload = jwt.verify(refreshToken, secretTwo);
        if(payload.type !== 'refresh') {
            res.status(400).json({message: 'Неверный токен'});
            return
        }
        const token = await Token.findOne({where: {idRefreshToken: payload.id}});
        if (!token) {
            res.status(400).json({message: 'Неверный токен'});
            return
        }
        const tokens = await updateTokens(token.idUser);
        await token.destroy();
        res.status(200).json(tokens);
    } catch (e) {
        if(e instanceof jwt.TokenExpiredError) {
            res.status(400).json({message: 'Срок действия токена истек'});
        } else if(e instanceof jwt.JsonWebTokenError) {
            res.status(400).json({message: 'Неверный токен'});
        } else {
            log.error('Internal error(%d): %s',res.statusCode,e.message);
            res.status(500).json({message: 'Server error'});
        }
    }

};
exports.user_info = async (req, res) => {
    const token = req.get('Authorization').split(' ')[1];
    const tokenInfo = jwt.decode(token);
    res.status(200).json({id: tokenInfo.id});
};
exports.user_logout = async (req, res) => {
    const token = req.get('Authorization').split(' ')[1];
    const tokenInfo = jwt.decode(token);
    const invalidToken = await Token.findOne({where: {
            idToken: tokenInfo.idToken
        }});
    if (invalidToken) {
        await invalidToken.destroy();
    }
    res.status(200).json();
};
exports.user_signup = async (req, res) => {
    try {
        validationResult(req).throw();
        const {id, password} = req.body;
        const cryptoPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.findOne({
            where: {
                id
            }
        });
        if (user) {
            res.status(400).json({message: 'Данный логин уже используется'});
            return
        }
        await User.create({id, password: cryptoPassword});
        const tokens = await updateTokens(id);
        res.status(200).json({
            ...tokens
        });
    } catch (e) {
        const error = _.get(e, 'errors[0].nestedErrors[0].msg');
        log.error('Internal error(%d): %s',res.statusCode,e.message);
        res.status(500).json({message: error || 'Server error'});
    }
};
