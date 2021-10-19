require('dotenv').config(); // this is important!
module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    },
    production: {
        use_env_variable: 'DATABASE_URL'
        // "dialectOptions": {
        //     "ssl": {
        //       "require": false
        //         // "rejectUnauthorized": false
        //     }
        // }
    }
};
