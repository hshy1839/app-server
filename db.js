const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'database-1.c768mmwqgs2t.ap-northeast-2.rds.amazonaws.com',
  user: 'admin',
  password: '11111111',
  port :3306,
  database: 'webdatabase_test'
});
module.exports = connection;