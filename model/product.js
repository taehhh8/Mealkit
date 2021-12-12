const mysql = require("mysql");
require("dotenv").config();
// const dbConfig = require("./dbconfig.json");

let con = mysql.createConnection({ //대소문자 구분해야됨
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

// let con = mysql.createConnection(dbConfig);



//상품 조회
module.exports = con.connect(function(err){
        if(err) throw err;
        console.log("Database Connected!");
    
        let sQuery = "Select * from Products";
        con.query(sQuery, (err, result, fields)=>{
            if(err) console.error(err); //throw err;
            console.log(result);
            // console.log(fields);
        });
    con.end();
    });


const router = express.Router();
function auth(req, res, next){
    console.log("접속자 권한확인")
    let auth =""
    // if(!auth){res.redirect("/")}
    next();
}
module.exports = router.get("/productlist",auth, (req, res)=>{
    let sQuery = "select * from Product";
    con.query(sQuery, (err, result, fields)=>{
        if(err) console.error(err);
        console.log(result);
        // res.render("index", {products: result })
    });
    
});

//상품 등록
con.connect(function(err){
        if(err) throw err;
        console.log("Database Connected!");
    
        let sQuery = `INSERT INTO Product
                        (Product_id, 
                        Category_id, 
                        Name, 
                        Price, 
                        Created_time, 
                        Updated_time, 
                        Content, 
                        Product_imageUrl, 
                        Quantity)
                    VALUES
                        ('Product_id 1', 
                        'Category_id 1', 
                        'Name 1', 
                        'Price 1', 
                        'Created_time 1', 
                        'Updated_time 1', 
                        'Content 1', 
                        'Product_imageUrl 1', 
                        'Quantity 1')`;
        con.query(sQuery, (err, result, fields)=>{
            if(err) console.error(err); //throw err;
            console.log(result);
            // console.log(fields);
        });
    con.end();
    });









// con.end();