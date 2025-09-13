const express = require('express');
const app = express();
const userModel = require('./models/user')

app.get('/',(req,res)=>{
    res.send("hn bhai mai chal gya");
});

app.listen(3000,()=>{
    console.log("its running");
});