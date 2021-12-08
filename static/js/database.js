const mysql = require('mysql');
require("dotenv").config();

const config = {
  host: process.env.host,
  user: process.env.user,     
  password: process.env.password,      
  port: process.env.port,
  database: process.env.database,
  connectionLimit: process.env.connectionLimit
};
// console.log(config)
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
// getConnection((conn) => {
//     var q1 = ""
//     conn.query(
//         q1
//     );
//     conn.release()
// })