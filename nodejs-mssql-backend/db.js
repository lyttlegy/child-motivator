//const mssql = require('mssql');
const mssql = require('./db-driver')

const config = {
    //user: '',
    //password: '',
    server: 'DESKTOP-KI7AIAU\\SQLEXPRESS',
    database: 'ChildMotivator',
	options: {
		trustedConnection: true,
		trustServerCertificate: true
	}
};
const pool = new mssql.ConnectionPool(config);

pool.on('error', (err) => {
    console.error('Database connection error:', err);
});

module.exports = pool;