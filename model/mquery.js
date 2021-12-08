
function query(sQuery){
    this.query = sQuery;
    const mysql = require("mysql");
    const upload = require("multer");
    const logger = require("morgan");
    require("dotenv").config();


    let con = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASS,
        database: process.env.DATABASE,
        port: process.env.PORT,
        connectionLimit: process.env.Conn
    });

    
    con.connect((err)=>{
        if(err) throw err; console.log("Database Connected");
        con.query(this.query, (err, result)=>{
            console.log(result);
            return result;
        });
        con.end();
    });
    
}
// console.log(query());


exports.query = query; 