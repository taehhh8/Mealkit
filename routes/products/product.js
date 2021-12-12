const express = require("express");
const router = express.Router();
const getConnection = require("../../model/database");
const session = require("express-session")
router.use(express.static('./views'))
router.use(express.static("static"));

router.use(session({
    secret: "my secret",
    store: false,
    secure: false,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: (1000 * 60 * 100) //miliseconds
    }
}));

router.get("/care/:pid", (req, res)=>{
    let pid = req.params.pid;
    if("lowcal"==pid){res.render("careFood/incare", {
        breadcrumbList: ["HOME", "케어식단", "저혈당식단"],
        _url :"https://www.greating.co.kr/front_pc/images/careLow.jpg?ver=20210118"
    })}
    if("light"==pid){res.render("careFood/incare", {
        breadcrumbList: ["HOME", "케어식단", "칼로리식단"],
        _url :"https://www.greating.co.kr/front_pc/images/careLight.jpg?ver=20210118"
    })}
    if("welln"==pid){res.render("careFood/incare", {
        breadcrumbList: ["HOME", "케어식단", "장수마을식단"],
        _url :"https://www.greating.co.kr/front_pc/images/careWellness.jpg?ver=20210125"
    })}
    if("mygreat"==pid){res.render("careFood/incare", {
        breadcrumbList: ["HOME", "케어식단", "마이그리팅"],
        _url :"https://www.greating.co.kr/front_pc/images/careMyGreating.jpg?ver=20210823"
    })}
});

    // getConnection((conn) => {
    // let query = "select * from Product where pid = "+pid;     
    //     conn.query(query, (err, result)=>{
            
    //         res.render("careFood/incare", {  breadcrumbList: ["HOME", "케어식단", "칼로리식단"]})
    //     });
    //     conn.release()
    // })

router.get("/preview", (req, res)=>{
    if (req.session.valid) {
        res.render('careFood/preview', {breadcrumbList: ["HOME", "메뉴 미리보기"], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('careFood/preview', { breadcrumbList: ["HOME", "메뉴 미리보기"] })
    }
});
router.get("/order", (req, res)=>{
    if (req.session.valid) {
        res.render('order/views/orderPayment', {breadcrumbList: ["HOME", "주문하기"], sessionValid: req.session.valid, user: req.session.user.Id})
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('order/views/orderPayment', { breadcrumbList: ["HOME", "주문하기"] })
    }
});

router.get("/paymentResult", (req, res)=>{
    if (req.session.valid) {
        res.render('order/views/paymentResult', {
            breadcrumbList: ["HOME", "주문완료"], 
            sessionValid: req.session.valid, 
            user: req.session.user.Id, 
            name: req.body.name,
            address: req.body.address,
            detailAddress: req.body.detailAddress
        })
        // console.log("user: ", req.session.user.Id)
    } else {
        res.render('order/views/paymentResult', { breadcrumbList: ["HOME", "주문완료"] })
    }
});


router.get("/challenge/:pid", (req, res)=>{
    let pid = req.params.pid;
    res.render("product/detail/detail");

})
router.get("/detail/:pid", (req, res)=>{
    let pid = req.params.pid;
    res.render("product/detail/detail");

})

module.exports = router;