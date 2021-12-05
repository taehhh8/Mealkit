const express = require("express");
const router = express.Router();



router.get("/join", (req, res)=>{
    
    res.render("membership/join");
});


function chkelement(req, res, next){
    if(!req.body.identity || !req.body.name || !req.body.pwd || !req.body.pwd2 || !req.body.date || !req.body.gender || req.body.pwd!=req.body.pwd2){
        return;
    }
    // if(필수값체크){}
    // if(비밀번호 같은지 체크){}
    next();
}
router.post("/regist", chkelement, (req, res)=>{
   
    
    res.render("membership/login");
});

module.exoprts = router;