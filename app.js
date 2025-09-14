const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken')

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())

app.get('/',(req,res)=>{
    // res.send("hn bhai mai chal gya");
    res.render('index')
});

app.post('/register', async (req,res)=>{
    let{email,password,username, age,name }= req.body;

    //if user already exist 
   let user= await userModel.findOne({email:email});
   if(user) return res.status(500).send("User already registered");

    // if user not exist 
   bcrypt.genSalt(10,(err,salt)=>{
       bcrypt.hash(password,salt, async (err,hash)=>{
        // console.log(hash);
       let user = await userModel.create({
            username,
            email,
            age,
            name,
            password:hash
        })
        
        let token =jwt.sign({email:email,userid:user._id},"shius");
        res.cookie("token",token)
        res.send("registered")
       })

   })

})

app.get('/login',(req,res)=>{
    res.render('login')
})
app.post('/login',(req,res)=>{
    res.render('profile')
})

app.listen(3000,()=>{
    console.log("its running");
});