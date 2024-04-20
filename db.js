const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: '1111',
  port :3306,
  database: 'hongstagram'
});
module.exports = connection;