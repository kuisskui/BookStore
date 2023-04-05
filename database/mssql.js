const mssql = require("mssql")
require('dotenv').config()
const config = {
    user: process.env.user,
    password: process.env.password,
    server: process.env.server, // or IP address
    database: process.env.database,
    options: {
        encrypt: true, // for SSL
        trustServerCertificate: true, // Disable SSL verification

    }
};

const databasePool = new mssql.ConnectionPool(config)
databasePool.connect((err) => {
    if (err) {
        console.error(`Error connecting to database: ${err}`);
        return;
    }
    console.log('Connected to database!');
});

module.exports = databasePool