const mysql = require('mysql');
require("dotenv").config()
// const config = {
//   host: '52.78.162.166', 
//   user: 'block4s',     
//   password: 'mealkits',      
//   port: '55314',
//   database: 'mealkit',
//   connectionLimit: 30
// };
const config = {
  host: process.env.host,
  user: process.env.user,     
  password: process.env.password,      
  port: process.env.port,
  database: process.env.database,
  connectionLimit: process.env.connectionLimit
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
// getConnection((conn) => {
//   var q1 = ""
//   conn.query(
//       q1
//   );
//   conn.release()

// })