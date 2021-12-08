const mysql = require('mysql');
const config = {
  host: '52.78.162.166', 
  user: 'block4s',     
  password: 'mealkits',      
  port: '55314',
  database: 'mealkit',
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