require('dotenv').config();

const jwtOptions = {
    tokens: {
        access: {
            type: "access",
            expiresIn: process.env.TOKEN_EXPIRE || '10m'
        },
        refresh: {
            type: "refresh",
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '20m'
        }
    },
    secret: process.env.SECRET_ONE,
    secretTwo: process.env.SECRET_TWO
};

const dbConnection = {
    dbName: process.env.DBNAME,
    userName: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    dialect: 'mysql',
    logging: false
};

module.exports = {
    jwtOptions,
    dbConnection
};
