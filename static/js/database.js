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
const configs = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT,
  connectionLimit: process.env.Conn
};
let pool = mysql.createPool(configs);
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