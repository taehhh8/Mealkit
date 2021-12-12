// bin/maria.js

const mysql = require("mysql");
// 설치한 모듈인 mysql을 사용하기 위해 불러왔습니다.

const config = {
  host: "52.78.162.166", // 이건 localhost또는 127.0.0.1 로 설정하시면 됩니다.
  port: 55314, // port는 mariadb 설치시에 딱히 건드리게 없다면 해당 포트가 맞습니다.
  user: "block4s", // 계정이름
  password: "mealkits", // 계정비밀번호
  database: "mealkit", // DB명
};

var pool = mysql.createPool(config);

function getConnection(callback) {
  pool.getConnection(function (err, conn) {
    if(err) throw err;
    if(!err) {
      callback(conn);
      console.log("database connected")
    }
  });
}

// 연결하기 전에 정보를 설정해야 합니다.
// 위에서 제가 DB에 관한 내용을 다시 복기한 이유가 있습니다. 잘 적어주셔야 합니다.

module.exports = getConnection;
// 그리고 해당 js파일이 모듈로 사용될 때 conn을 담습니다.


// var query = "SELECT * FROM notice"
// conn.query(query, (err, datas) => {
//     console.log(datas)  
// })