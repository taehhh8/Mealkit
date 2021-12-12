//쿼리문
// conn, req, res, result
const mysql = require("mysql");
require("dotenv").config();


class crud{
    constructor(sQuery){
        this.query = sQuery;       
    }
    go(sQuery){
        let con = mysql.createConnection({ //대소문자 구분해야됨
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
        });
        console.log(this.con);
        con.connect((err)=>{
           if(err) throw err;
            console.log("database Connected!")
        
            con.query(this.query, (err, result)=>{
               if(err) console.error(err);
                console.log(result);
            });
            con.end();
        });
    }
}


// let sQuery = "select * from Admin";
// let query = new crud(sQuery);
// query.go();




exports.crud = crud;
