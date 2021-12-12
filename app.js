const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt-nodejs');
const session = require("express-session")
const getConnection = require("./model/database.js")
const member = require("./routes/member.js")
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const usersRouter = require('./routes/users');
const boardRouter = require('./routes/board');
const orderRouter = require("./routes/order/order");
const productRouter = require("./routes/products/product");

require("dotenv").config
// const FileStore = require('session-file-store')(session)
// require("dotenv").config();
// const upload = require("multer")
// const logger = require("morgan");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/users', usersRouter);
app.use('/board', boardRouter);
app.use("/order", orderRouter);
app.use("/product", productRouter);
// getConnection((conn) => {
//     var q1 = ""
//     conn.query(
//         q1
//     );
//     conn.release()
// })

// const personalQueryRouter= require('./routes/board/personalQuery');
//routes
// const membership = require("./routes/membership");
// const common = require("./routes/common");
// app.use("/membership", membership);
// app.use("/common", common);
// const db = require("./model");

app.use(express.static('./views'))
app.use(express.static('./static'))
app.use(express.static(__dirname+"./static"))



// app.use('/board/personalQuery', personalQueryRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(upload.array())

app.use(session({
    secret: "my secret",
    store: false,
    secure: false,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: (1000 * 60 * 100) //miliseconds
    }
}));

var Users = [];
app.set('view engine', 'pug');
app.set("views", './views');

app.get('/board/order', (req, res) => {
    res.render('order', )

})

const port = process.env.appPort
const host = process.env.appHost

app.get('/', (req, res) => {
    getConnection((conn)=>{
        let query = "select * from Product";
        conn.query( query, (err, result)=>{
            conn.release();
            if (req.session.valid) {
                res.render('careFood/sikdan', {breadcrumbList: ["HOME"], product:result, sessionValid: req.session.valid, user: req.session.user.Id})
                // console.log("user: ", req.session.user.Id)
            } else {
                res.render('careFood/sikdan', { breadcrumbList: ["HOME", '비회원접근'] })
            }
        })
    })
})


app.post('/signup', (req, res, registchk) => {
    // console.log(req.body)
    var formdata = {
        id: req.body.id,
        name: req.body.name,
        pwd: req.body.pwd,
        pwdchk: req.body.pwdck,
        addr: req.body.post + '/' + req.body.addr + '/' + req.body.detai,
        birthdate: req.body.date,
        gender: req.body.gender,
        phone: req.body.phone,
        date: Date.now()
    }
    if (formdata.id != undefined) {
        var QchckId = `SELECT * FROM Customer WHERE Id='${formdata.id}'`
        console.log("formdata.id: " + formdata.id)
        getConnection((conn) => {
            conn.query(QchckId, function (err, row, fields) {
                if (err) {
                    console.log("회원가입 실패")
                    res.render('signup', {
                        registchk: 0,
                        id: formdata.id,post:formdata.addr.split("/")[0] , addr : formdata.addr.split("/")[1] , detail: formdata.addr.split("/")[2] ,birth: formdata.birthdate, gender: formdata.gender,
                        phone: formdata.phone, name: formdata.name,
                        breadcrumbList: ["HOME", "회원가입"]
                    });
                    throw err;
                } else if (row.length > 0) {
                    console.log("회원가입 실패\n아이디가 이미 존재합니다")
                    res.render('signup', {
                        registchk: 2,
                        id: formdata.id,post:formdata.addr.split("/")[0] , addr : formdata.addr.split("/")[1] , detail: formdata.addr.split("/")[2] ,birth: formdata.birthdate, gender: formdata.gender,
                        phone: formdata.phone, name: formdata.name,
                        breadcrumbList: ["HOME", "회원가입"]
                    });
                } else if (formdata.pwd != formdata.pwdchk) {
                    console.log("사용 가능한 아이디입니돠")
                    console.log("비밀번호 틀림")
                    res.render('signup', {
                        registchk: 3,
                        id: formdata.id,post:formdata.addr.split("/")[0] , addr : formdata.addr.split("/")[1] , detail: formdata.addr.split("/")[2] ,birth: formdata.birthdate, gender: formdata.gender,
                        phone: formdata.phone, name: formdata.name,
                        breadcrumbList: ["HOME", "회원가입"]
                    });
                } else {
                    bcrypt.hash(formdata.pwd, null, null, function (err, hash) {
                        // insert user data into users table
                        var qSignup = "INSERT INTO Customer (Id, Pwd, Name, Addr, Birthdate, Phone, Gender, RegDate) VALUES ('" + formdata.id + "', '" + hash + "', '" + formdata.name + "', '" + formdata.addr + "', '" + formdata.birthdate + "', '" + formdata.phone + "', '" + formdata.gender + "', '" + formdata.date + "');"
                        getConnection((conn) => {
                            conn.query(qSignup, function (err, row, fields) {
                                if (err) {
                                    res.render('signup', {
                                        registchk: 0,
                                        breadcrumbList: ["HOME", "회원가입"]
                                    });
                                    throw err;
                                }
                                console.log("회원가입 성공")
                                // console.log(row);
                                // res.send({registchk: 1});
                                res.render('signup', {
                                    registchk: 1,
                                    breadcrumbList: ["HOME", "회원가입"]
                                });
                            })
                        });
                    })
                }
                console.log("release pool")
                conn.release()
            })
        })
    }
})

app.get('/login', (req, res) => {
    res.render('login', { breadcrumbList: ["HOME", "로그인"], signIn: 10 })
})

app.post('/login', (req, res) => {
    param = [req.body.id, req.body.pwd]
    qLogin = `SELECT * FROM Customer WHERE Id='${param[0]}'`
    getConnection((conn) => {
        conn.query(qLogin, function (err, row) {
            if (err) throw err;
            if (row.length > 0) { //id 가 존재한다면
                console.log(row);
                bcrypt.compare(param[1], row[0].Pwd, (error, result) => {
                    if (result) {
                        console.log('로그인 성공');
                        req.session.user = row[0]
                        req.session.save(err => {
                            if (err) {
                                console.log(err);
                                return res.status(500).send("h1 500 error");
                            }
                            else {
                                req.session.valid = true
                                console.log(req.session)
                                res.redirect('/')
                            }
                        })
                    } else {
                        console.log('로그인 실패 비밀번호 틀림')
                        console.log("user: ", req.session.user)
                        // res.send({signIn:0})
                        res.render('login', {
                            breadcrumbList: ["HOME", "로그인"],
                            signIn: 0
                        })
                    }
                })
            } else {
                console.log('ID가 존재하지 않습니다.')
                // res.send({signIn:2})
                res.render('login', {
                    breadcrumbList: ["HOME", "로그인"],
                    signIn: 2
                })
            }
        })
        conn.release()
    });
    // res.redirect('/')
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/login');
    });
});


app.get('/event', (req, res) => {
    if (req.session.valid) {
        res.render('event', {breadcrumbList: ["HOME", "이벤트"], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('event', { breadcrumbList: ["HOME", "이벤트"] })
    }
})
app.get('/display', (req, res) => {
    if (req.session.valid) {
        res.render('display', {breadcrumbList: ["HOME", "기획전"], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('display', {breadcrumbList: ["HOME", "기획전"] })
    }
})
app.get('/coupon', (req, res) => {
    if (req.session.valid) {
        res.render('coupon', {breadcrumbList: ["HOME", '쿠폰/교환권'], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('coupon', {breadcrumbList: ["HOME", '쿠폰/교환권'], sessionValid: req.session.valid})
    }
})
app.get('/detail', (req, res) => {
    if (req.session.valid) {
        res.render('product/detail/page', {breadcrumbList: ["HOME", '상품상세'], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('product/detail/page', {breadcrumbList: ["HOME", '상품상세'], sessionValid: req.session.valid})
    }
})
app.get('/story', (req, res) => {
    if (req.session.valid) {
        res.render('story', {breadcrumbList: ["HOME", '스토리'], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('story', {breadcrumbList: ["HOME", '스토리'], sessionValid: req.session.valid})
    }
})
app.get('/notice', (req, res) => {
    if (req.session.valid) {
        res.render('noitce', {breadcrumbList: ["HOME", '고객센터', '공지사항'], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('notice', {breadcrumbList: ["HOME", '고객센터', '공지사항'], sessionValid: req.session.valid})
    }
})
app.get('/faq', (req, res) => {
    if (req.session.valid) {
        res.render('faq', {breadcrumbList: ["HOME", '고객센터', '자주 묻는 질문'], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('faq', {breadcrumbList: ["HOME", '고객센터', '자주 묻는 질문'], sessionValid: req.session.valid})
    }
})
app.get('/post', (req, res) => {
    if (req.session.valid) {
        res.render('post', {breadcrumbList: ["HOME", '고객센터', '1:1 문의하기'], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('post', {breadcrumbList: ["HOME", '고객센터', '1:1 문의하기'], sessionValid: req.session.valid})
    }
})
app.get('/qna', (req, res) => {
    if (req.session.valid) {
        res.render('qna', {breadcrumbList: ["HOME", '고객센터', '고객의 소리'], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('qna', {breadcrumbList: ["HOME", '고객센터', '고객의 소리'], sessionValid: req.session.valid})
    }
})
app.get('/board', (req, res) => {
    if (req.session.valid) {
        res.render('view', {breadcrumbList: ["HOME", '고객센터', '1:1문의하기'], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('view', {breadcrumbList: ["HOME", '고객센터', '1:1문의하기'], sessionValid: req.session.valid})
    }
})





app.get("/care", (req, res)=>{
    if (req.session.valid) {
        res.render('careFood/sikdan', {breadcrumbList: ["HOME", "케어식단"], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('careFood/sikdan', { breadcrumbList: ["HOME", "케어식단"] })
    }
    
    
});
app.get("/health", (req, res)=>{
    if (req.session.valid) {
        res.render('healthMarket/hm', {breadcrumbList: ["HOME", "건강마켓"], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('healthMarket/hm', { breadcrumbList: ["HOME", "건강마켓"] })
    }
    
});



app.use('/member', member)

app.listen(port, host, () => {
    console.log(`application running at http://${host}:${port}/`)
});