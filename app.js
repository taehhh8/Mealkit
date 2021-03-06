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
                res.render('careFood/sikdan', { breadcrumbList: ["HOME", '???????????????'] })

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
                    console.log("???????????? ??????")
                    res.render('signup', {
                        registchk: 0,
                        id: formdata.id,post:formdata.addr.split("/")[0] , addr : formdata.addr.split("/")[1] , detail: formdata.addr.split("/")[2] ,birth: formdata.birthdate, gender: formdata.gender,
                        phone: formdata.phone, name: formdata.name,
                        breadcrumbList: ["HOME", "????????????"]
                    });
                    throw err;
                } else if (row.length > 0) {
                    console.log("???????????? ??????\n???????????? ?????? ???????????????")
                    res.render('signup', {
                        registchk: 2,
                        id: formdata.id,post:formdata.addr.split("/")[0] , addr : formdata.addr.split("/")[1] , detail: formdata.addr.split("/")[2] ,birth: formdata.birthdate, gender: formdata.gender,
                        phone: formdata.phone, name: formdata.name,
                        breadcrumbList: ["HOME", "????????????"]
                    });
                } else if (formdata.pwd != formdata.pwdchk) {
                    console.log("?????? ????????? ??????????????????")
                    console.log("???????????? ??????")
                    res.render('signup', {
                        registchk: 3,
                        id: formdata.id,post:formdata.addr.split("/")[0] , addr : formdata.addr.split("/")[1] , detail: formdata.addr.split("/")[2] ,birth: formdata.birthdate, gender: formdata.gender,
                        phone: formdata.phone, name: formdata.name,
                        breadcrumbList: ["HOME", "????????????"]
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
                                        breadcrumbList: ["HOME", "????????????"]
                                    });
                                    throw err;
                                }
                                console.log("???????????? ??????")
                                // console.log(row);
                                // res.send({registchk: 1});
                                res.render('signup', {
                                    registchk: 1,
                                    breadcrumbList: ["HOME", "????????????"]
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
    res.render('login', { breadcrumbList: ["HOME", "?????????"], signIn: 10 })
})

app.post('/login', (req, res) => {
    param = [req.body.id, req.body.pwd]
    qLogin = `SELECT * FROM Customer WHERE Id='${param[0]}'`
    getConnection((conn) => {
        conn.query(qLogin, function (err, row) {
            if (err) throw err;
            if (row.length > 0) { //id ??? ???????????????
                console.log(row);
                bcrypt.compare(param[1], row[0].Pwd, (error, result) => {
                    if (result) {
                        console.log('????????? ??????');
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
                        console.log('????????? ?????? ???????????? ??????')
                        console.log("user: ", req.session.user)
                        // res.send({signIn:0})
                        res.render('login', {
                            breadcrumbList: ["HOME", "?????????"],
                            signIn: 0
                        })
                    }
                })
            } else {
                console.log('ID??? ???????????? ????????????.')
                // res.send({signIn:2})
                res.render('login', {
                    breadcrumbList: ["HOME", "?????????"],
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
        res.render('event', {breadcrumbList: ["HOME", "?????????"], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('event', { breadcrumbList: ["HOME", "?????????"] })
    }
})
app.get('/display', (req, res) => {
    if (req.session.valid) {
        res.render('display', {breadcrumbList: ["HOME", "?????????"], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('display', {breadcrumbList: ["HOME", "?????????"] })
    }
})
app.get('/coupon', (req, res) => {
    if (req.session.valid) {
        res.render('coupon', {breadcrumbList: ["HOME", '??????/?????????'], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('coupon', {breadcrumbList: ["HOME", '??????/?????????'], sessionValid: req.session.valid})
    }
})
app.get('/detail', (req, res) => {
    if (req.session.valid) {
        res.render('product/detail/page', {breadcrumbList: ["HOME", '?????????????????????'], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('product/detail/page', {breadcrumbList: ["HOME", '?????????????????????'], sessionValid: req.session.valid})

    }
})
app.get('/story', (req, res) => {
    if (req.session.valid) {
        res.render('story', {breadcrumbList: ["HOME", '?????????'], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('story', {breadcrumbList: ["HOME", '?????????'], sessionValid: req.session.valid})
    }
})
app.get('/notice', (req, res) => {
    if (req.session.valid) {
        res.render('noitce', {breadcrumbList: ["HOME", '????????????', '????????????'], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('notice', {breadcrumbList: ["HOME", '????????????', '????????????'], sessionValid: req.session.valid})
    }
})
app.get('/faq', (req, res) => {
    if (req.session.valid) {
        res.render('faq', {breadcrumbList: ["HOME", '????????????', '?????? ?????? ??????'], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('faq', {breadcrumbList: ["HOME", '????????????', '?????? ?????? ??????'], sessionValid: req.session.valid})
    }
})
app.get('/post', (req, res) => {
    if (req.session.valid) {
        res.render('post', {breadcrumbList: ["HOME", '????????????', '1:1 ????????????'], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('post', {breadcrumbList: ["HOME", '????????????', '1:1 ????????????'], sessionValid: req.session.valid})
    }
})
app.get('/qna', (req, res) => {
    if (req.session.valid) {
        res.render('qna', {breadcrumbList: ["HOME", '????????????', '????????? ??????'], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('qna', {breadcrumbList: ["HOME", '????????????', '????????? ??????'], sessionValid: req.session.valid})
    }
})
app.get('/board', (req, res) => {

    if (req.session.valid) {
        res.render('view', {breadcrumbList: ["HOME", '????????????', '1:1????????????'], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('view', {breadcrumbList: ["HOME", '????????????', '1:1????????????'], sessionValid: req.session.valid})
    }
})


app.get('/signup', (req, res) => {
    res.render('signup', { breadcrumbList: ["HOME", "????????????"] })
})



app.get("/care", (req, res)=>{
    if (req.session.valid) {
        res.render('careFood/sikdan', {breadcrumbList: ["HOME", "????????????"], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('careFood/sikdan', { breadcrumbList: ["HOME", "????????????"] })
    }
    
    
});
app.get("/health", (req, res)=>{
    if (req.session.valid) {
        res.render('healthMarket/hm', {breadcrumbList: ["HOME", "????????????"], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('healthMarket/hm', { breadcrumbList: ["HOME", "????????????"] })
    }
    
});



app.use('/member', member)

app.listen(port, host, () => {
    console.log(`application running at http://${host}:${port}/`)
});