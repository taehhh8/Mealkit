const express = require("express");
const router = express.Router();
const getConnection = require("../../model/database");

router.use(express.static('./views'))
router.use(express.static("static"));

router.get("/", ( req, res)=>{
    res.render("careFood/sikdan", {  
        breadcrumbList: ["HOME", "케어식단", "칼로리식단"]
    })
});


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


    // getConnection((conn) => {
    // let query = "select * from Product where pid = "+pid;     
    //     conn.query(query, (err, result)=>{
            
    //         res.render("careFood/incare", {  breadcrumbList: ["HOME", "케어식단", "칼로리식단"]})
    //     });
    //     conn.release()
    // })
});

router.get("/challenge/:pid", (req, res)=>{
    let pid = req.params.pid;
    res.render("product/detail/detail");

})

module.exports = router;