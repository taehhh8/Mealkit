function mquery(sQuery, renderpage, value){
    
        // this.query = sQuery;       
    
    
        const mysql = require("mysql");
        require("dotenv").config();
        let con = mysql.createConnection({ //대소문자 구분해야됨
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
        });
        
        con.connect((err, req, res)=>{
           if(err) throw err;
            console.log("database Connected!")
        
            con.query(this.query, (err, result)=>{
               if(err) console.error(err);
                console.log(result);
                res.render(renderpage, result)
                return result;
            });
            con.end();
        });
    
}

// let sQuery = "select * from Admin";
// mquery(sQuery, "index", "result");

module.exports.mquery = mquery;