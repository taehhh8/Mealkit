const express = require('express')
const app = express();

const host = '127.0.0.1'
const port = 3000;

app.set('view engine','pug');
app.set('views','./views');

app.get('/',(req,res) =>{
    res.render('myPage')
})


app.get('/oder', (req,res) => {
    res.send('hello');
    // console.log('hi')
})

// app.post('/order',(req,res) => {
//     res.render(body.id.myOrderList)
//     console.log('hi')
// })



app.listen(port, host, ()=> {
    console.log(`connecting at http://${host}:${port}`);
})
