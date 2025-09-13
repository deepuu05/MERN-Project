const express = require('express');
const app = express();
const userModel = require('./models/user');
const cookieParser = require('cookie-parser');
// const { render } = require('ejs');
const path = require('path')

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{
    res.send("hn bhai mai chal gya");
    // res.render('index')
});

app.listen(3000,()=>{
    console.log("its running");
});