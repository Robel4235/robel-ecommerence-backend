const express = require('express');
const mongoose = require('mongoose');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express();

mongoose.connect('mongodb+srv://tsadkan:DLiEzrBdA4u8EzQz@cluster0.r26ik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {useNewUrlParser: true}).then(()=>console.log('the DB is connected'))
                            .catch(err=>console.error(err));
app.get('/',(req,res)=>{
    res.send('hello this is my server')
})

app.listen(5000);
