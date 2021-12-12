const { text } = require('express');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const host = '127.0.0.1'
const port = 3000;

app.set('view engine', 'pug')
app.set('views', 'views')

app.get('/myorderPayment', (req,res)=>{
    res.render("myorderPayment")
})

app.get('/paymentResult', (req,res)=>{
    res.render("paymentResult")
})

app.post('/paymentResult', (req, res)=>{
    res.render('paymentResult', {
        name: req.body.name,
        address: req.body.address,
        detailAddress: req.body.detailAddress
    });
});

app.post('/myorderPayment', (req, res)=>{
    res.render('index copy', {
        name: req.body.name,
        address: req.body.address,
        detailAddress: req.body.detailAddress
    });
});


app.listen(port,host ,() =>{
    console.log(`connecting at http://${host}:${port}`)
})