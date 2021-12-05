const mysql = require("mysql");
require("dotenv").config();
// const dbConfig = require("./dbconfig.json");

let con = mysql.createConnection({ //대소문자 구분해야됨
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});



console.log(con);
// let con = mysql.createConnection(dbConfig);

    con.connect(function(err){
    if(err) throw err;
    console.log("Database Connected!");
    
    let sQuery = "Select * from Admin";
    con.query(sQuery, (err, result, fields)=>{
        if(err) console.error(err); //throw err;
        console.log(result);
        // console.log(fields);
    });
    con.end();
});

// con.end();