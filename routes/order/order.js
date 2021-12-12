const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));

// router.set('view engine', 'pug')
// router.set('views', 'views')

router.get('/', (req,res)=>{
    res.render("/")
})
router.get('/myorderPayment', (req,res)=>{
    res.render("order/views/myorderPayment")
})

router.get('/paymentResult', (req,res)=>{
    res.render("order/views/paymentResult")
})

router.post('/paymentResult', (req, res)=>{
    res.render('order/views/paymentResult', {
        name: req.body.name,
        address: req.body.address,
        detailAddress: req.body.detailAddress
    });
});



module.exports = router;