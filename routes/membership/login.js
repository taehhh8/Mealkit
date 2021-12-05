const express = require('express');
const router = express.Router();


router.get("/", (req, res)=>{
    
   res.render("membership/login"); 
});

module.exports = router;