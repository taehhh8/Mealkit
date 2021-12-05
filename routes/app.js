const express = require("express")
const app = express()
const bodyParser = require("body-parser")
// const multer = require("multer")
// const upload = multer();
const session = require("express-session")
const dotenv = require("dotenv").config();

app.use(express.static('../views'))
app.use(express.static('../static'))

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
app.set("views", '../views');

const port = 3000
const host = '0.0.0.0'

app.get('/', (req, res) => {
    res.render('head', {breadcrumbLIst: ["HOME", "이벤트","이벤트 진행 중"]})
})
app.get('/for', (req, res) => {
    res.render('foreach')
})
app.get('/or', (req, res) => {
    res.render('origin_event')
})
app.get('/h', (req, res) => {
    res.render('head')
})
app.get('/detail', (req, res) => {
    res.render('detail')
})
app.get('/footer', (req, res) => {
    res.render('footer')
})
app.get('/header', (req, res) => {
    res.render('header')
})
app.get('/index', (req, res) => {
    res.render('index', {breadcrumbLIst: ["HOME", "이벤트","이벤트 진행 중"]})
})
app.get('/story', (req, res) => {
    res.render('story')
})


// app.get('/information', (req, res) => {
//     // res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'})
//     if (req.session.user) {
//         res.render('information', {
//             user_name: req.session.user.user_name,
//             user_id: req.session.user.user_id,
//             password: req.session.user.password,
//             post: req.session.user.post,
//             addr: req.session.user.addr,
//             detai: req.session.user.detai
//         })
//     }
// })

// app.post('/info', (req, res) => {
//     console.log(req.body)
//     var response = {
//         user_name: req.body.user_name,
//         user_id: req.body.user_id,
//         password: req.body.password,
//         post: req.body.post,
//         addr: req.body.addr,
//         detai: req.body.detai
//     };
//     // console.log(response)
//     Users.push(response)
//     req.session.user = response
//     res.redirect('/information');

//     // res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
//     // res.end(`이름 : ${response.user_name} \n아이디 : ${response.user_id} \n주소 : ${response.post} ${response.addr} ${response.detai}`)

//     // res.redirect('information')
// })
app.listen(port, host, () => {
    console.log(`application running at http://${host}:${port}/`)
});