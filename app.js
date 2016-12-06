var express = require('express');
var passport = require('passport');
var PPHStrategy = require('./lib').Strategy;
var bodyParser = require('body-parser');

passport.use(new PPHStrategy(
    {"threshold": 10, "filename": "securepasswords"}
));

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('login', { messages: ''});
});

app.get('/login', function(req, res) {
    res.render('login', { messages: ''});
});

app.post('/login', function(req, res) {

    /*
    var req = {
        "username" : "alice",
        "password" : "kitten"
    };

    */

    passport.authenticate('pph', function(err, user, info){
        if(err){
            res.render('login', { messages: "No such user"});
        }

        if(!user){
            res.render('login', { messages: "Invalid password"});
        }
        else{
            res.send("Welcome " + user);
        }
            
    })(req.body); 
});

app.get('/register', function(req, res) {
    res.render('register');
});

app.listen(3000, function() {
    console.log('Listening on 3000');
});
