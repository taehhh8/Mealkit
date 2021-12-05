const mysql = require('mysql');
const config = {
  host: 'localhost', 
  user: 'root',     
  password: 'pwd',      
  port: '3306',
  database: 'sikdan',
  connectionLimit: 30
};

let pool = mysql.createPool(config);
function getConnection(callback) {
  pool.getConnection(function (err, conn) {
    if(err) throw err;
    if(!err) {
      callback(conn);
      console.log("db pool connected")
    }
  });
}

module.exports = getConnection;