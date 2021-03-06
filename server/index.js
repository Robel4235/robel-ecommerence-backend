const express = require('express');
const mongoose = require('mongoose');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express();
const bodyParser= require('body-parser');
const cookieParser = require('cookie-parser');
const {User} = require('./models/user')
const {auth}= require('./middleware/auth');
const config = require('./config/key')

mongoose.connect(config.mongodbURI,
    {useNewUrlParser: true}).then(()=>console.log('the DB is connected'))
                            .catch(err=>console.error(err));


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.json({"hello":"this is me again"});
})

app.get('/api/user/auth',auth,(req,res)=>{
   res.status(200).json({
       _id: req.user._id,
       isAuth: true,
       email: req.user.email,
       name: req.user.name,
       lastName: req.user.lastName,
       role: req.user.role
   })
})




app.post('/api/users/register',(req,res)=>{
    const user = new User(req.body);
    user.save((err,doc)=>{
        if (err) return res.json({success:false, err});

         res.status(200).json({
            success:true,
            userData: doc
        });
    })
    
})

app.post('/api/user/login',(req,res)=>{
    User.findOne({email: req.body.email},(err,user )=>{
        if (!user)
        return res.json({ loginSuccess: false, message: "Auth failed, email not found" });

        user.comparePassword(req.body.password, (err,isMatch)=>{
            if (!isMatch) return res.json({loginSuccess:false, message: "Auth failed, wrong password"});
        })

        user.generateToken((err,user)=>{
            if(err) return res.status(400).send(err);
            res.cookie("r_auth", user.token).status(200).json({loginSuccess:true})

        })
    })
})
app.get('/api/user/logout',auth,(req,res)=>{
    User.findOneAndUpdate({_id:req.user._id},{token: ""},(err,doc)=>{
        if (err) return res.json({success:false, err})
        return res.status(200).send({success:true, })
    })
})
const port = process.env.PORT||5000 ;
app.listen(port,()=>{
    console.log(`server running at ${port}`)
}); 
