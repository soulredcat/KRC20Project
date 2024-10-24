const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'karangkobar',
    database: 'kasdata',
};

const createConnection = async () => {
    return await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
    });
};

const pool = mysql.createPool(dbConfig);

module.exports = {
    pool,
    createConnection,
    dbConfig
};
