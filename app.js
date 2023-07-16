//jshint esversion:6
require('dotenv').config();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose  = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});
// userSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey, encryptedFields: ['age'] });

const User = new mongoose.model("User", userSchema);


app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/login',(req,res)=>{
    res.render('login')
});

app.get('/register',(req,res)=>{
    res.render('register')
});

app.post('/register',(req,res)=>{
    const user = new User({
        email: req.body.username,
        password: req.body.password
    });
    user.save().then(()=>{
        res.render('secrets');
    });
});

app.post('/login',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}).then((foundUser)=>{
        if(foundUser.password == password){
            res.render('secrets');
        }
    });
}); 

app.listen(3000,(()=>{
    console.log("port running on 3000");
}));