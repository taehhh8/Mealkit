const mysql = require('mysql');
require("dotenv").config();
// # Data base host
//     HOST=0.0.0.0
// # Database User Id
//     USER=root
// # Database User Password
//     PASSWORD=qweqwe123
// # Database 
//     DATABASE=mealkit
// # Conn Limit
// 	Conn = 30
// # Port
// 	PORT=3306

const config = {
	host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
	port: process.env.PORT,
	connectionLimit: process.env.Conn
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

// module.exports = getConnection;
getConnection((conn) => {
    var q1 = ""
    conn.query(
        q1
    );
    conn.release()
})