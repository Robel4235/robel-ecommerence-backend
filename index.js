const express = require('express');
const mongoose = require('mongoose');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express();
const bodyParser= require('body-parser');
const cookieParser= require('cookie-parser');
const {User} = require('./models/user')
const config = require('./config/key')

mongoose.connect(config.mongodbURI,
    {useNewUrlParser: true}).then(()=>console.log('the DB is connected'))
                            .catch(err=>console.error(err));
app.get('/',(req,res)=>{
    res.send('hello this is my server connected with nodemon')
})

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.post('/api/users/register',(req,res)=>{
    const user = new User(req.body);
    user.save((err,userData)=>{
        if (err) return res.json({success:false, err})
    })
    return res.status(200).json({
        success:true
    });
})
app.listen(5000);
