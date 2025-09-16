const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken');
const user = require('./models/user');

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
app.post('/login',async (req,res)=>{
    let{email,password}= req.body;

    let user = await userModel.findOne({email:email});
    // agar user nhi milta
    // if(!user) return res.status(500).send("Something went wrong")
    if(!user) return res.status(500).redirect("/login")
    
    // agar user milta hai
    bcrypt.compare(password,user.password,function(err,result){
        if(result) {
            let token =jwt.sign({email:email,userid:user._id},"shius");
            res.cookie("token",token)
            // res.status(200).send("you can login")
            res.status(200).redirect("/profile")
        }
        else res.redirect("/login")
        
    })
})

app.get('/profile', isLoggedIn , async (req,res)=>{
    console.log(req.user)
   let userdata= await userModel.findOne({email:req.user.email}).populate("posts");
   console.log(userdata)
    res.render('profile',{userdata});
})

app.get('/logout',(req,res)=>{
    res.cookie('token',"");
    res.redirect("/login")
})

app.post("/post",isLoggedIn, async (req,res)=>{
    let user = await userModel.findOne({email: req.user.email});
    let {content} = req.body;
    let post = await postModel.create({
        user: user._id,
        content
    })
 user.posts.push(post._id)
 await user.save();
 res.redirect('/profile')
})


function isLoggedIn(req,res,next){
    // if(req.cookies.token==="") res.send("you must be logged in");
    if(req.cookies.token==="") res.redirect("/login");
    else{
       let data= jwt.verify(req.cookies.token,"shius")
       req.user= data;// data ko access krne ke liye kisi aur route me ki kon banda hai ye
    }
    next();
}
app.listen(3000,()=>{
    console.log("its running");
});