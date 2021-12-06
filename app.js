const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const logger = require("morgan");
const session = require("express-session")
const dotenv = require("dotenv").config();
const getConnection = require("./database.js")
const bcrypt = require('bcrypt-nodejs');

getConnection((conn) => {
    var q1 = ""
    conn.query(
        q1
    );
    conn.release()
})


// const personalQueryRouter= require('./routes/board/personalQuery');

//routes
// const membership = require("./routes/membership");
// const common = require("./routes/common");
// app.use("/membership", membership);
// app.use("/common", common);
// const db = require("./model");

app.use(express.static('./views'))
app.use(express.static('./static'))


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
    res.render('order', { page: "join" })
})



const port = 3000
const host = '127.0.0.1'

app.get('/', (req, res) => {
    let products = [
        { title: "양파 치즈 마요 드레싱", name: "부드러운 닭가슴살 콥 샐러드 (S)", sale: ["10%", "5,800원"], price: "5,220원" },
        { title: "참깨 마요 드레싱", name: "[I like Eat] 크랜베리 치킨 샐러드", sale: ["10%", "5,800원"], price: "5,220원" },
        { title: "참깨 드레싱", name: "율무 단호박 샐러드(R)", sale: ["10%", "5,800원"], price: "5,220원" },
        { title: "스위트 바나나 드레싱", name: "리코타 치즈 샐러드 (S/R)", sale: ["10%", "5,800원"], price: "5,220원" }
    ]
    if (req.session.user != undefined) {
        
        res.render('index', { breadcrumbList: ["HOME"], products: products, page: 'event.pug' })
    } else {
        res.render('event', { breadcrumbList: ["HOME"]})
    }
})

app.get('/signup', (req, res) => {
    res.render('signup', { breadcrumbList: ["HOME", "회원가입"] })
})
app.post('/signup', (req, res) => {
    // console.log(req.body)
    var formdata = {
        id: req.body.id,
        name: req.body.name,
        pwd: req.body.pwd,
        pwdchk: req.body.pwdck,
        addr: req.body.post + '/' + req.body.addr + '/' + req.body.detai,
        birthdate: req.body.date,
        gender: req.body.gender,
        phone: req.body.phone
    }
    if (formdata.pwd != formdata.pwdchk) {
        console.log("비밀번호 틀림")
        res.redirect('signup')
    } else {
        bcrypt.hash(formdata.pwd, null, null, function (err, hash) {
            // insert user data into users table
            var qSignup = "INSERT INTO Customer (Id, Pwd, Name, Addr, Birthdate, Phone, Gender) VALUES ('" + formdata.id + "', '" + hash + "', '" + formdata.name + "', '" + formdata.addr + "', '" + formdata.birthdate + "', '" + formdata.phone + "', '" + formdata.gender + "');"
            getConnection((conn) => {
                conn.query(
                    qSignup, function (err, row, fields) {
                        if (err) throw err;
                        // console.log(row);
                    }
                );
                conn.release()
            })
        });
        // res.redirect('/signupfinished')
    }
})

app.get('/signupfinished', (req, res) => {
    res.render('signupfinished', { breadcrumbList: ["HOME", "가입완료"] })
})
app.get('/login', (req, res) => {
    res.render('login', { breadcrumbList: ["HOME", "로그인"] })
})

app.post('/login', (req, res) => {
    param = [req.body.id, req.body.pw]
    qLogin = `SELECT * FROM customer WHERE Id='${param[0]}'`
    getConnection((conn) => {
        conn.query(
            qLogin, function (err, row) {
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
                                    res.status(200).send('h1 OK');
                                }
                            })
                        } else {
                            console.log('로그인 실패')
                            console.log("user: ", req.session.user)
                        }
                    })
                } else {
                    console.log('ID가 존재하지 않습니다.')
                }
            })
        conn.release()
    });
    res.redirect('/')
})

app.get('/mypage', (req, res) => {
    res.render('event', { breadcrumbList: ["HOME", "이벤트"] })
})


app.get('/event', (req, res) => {
    res.render('event', { breadcrumbList: ["HOME", "이벤트"] })
})
app.get('/display', (req, res) => {
    res.render('display', { breadcrumbList: ["HOME", "기획전"] })
})
app.get('/coupon', (req, res) => {
    res.render('coupon', { breadcrumbList: ["HOME", '쿠폰/교환권'] })
})
app.get('/detail', (req, res) => {
    res.render('detail')
})
app.get('/story', (req, res) => {
    res.render('story', { breadcrumbList: ["HOME", '스토리'] })
})
app.get('/board/myPersonalQuery', (req, res) => {
    res.render('myPersonalQuery', { breadcrumbList: ["HOME", '고객센터', '1:1 문의하기'] })
})


app.listen(port, host, () => {
    console.log(`application running at http://${host}:${port}/`)
});