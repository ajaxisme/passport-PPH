var express = require('express');
var passport = require('passport');
var PPHStrategy = require('./lib').Strategy;

passport.use(new PPHStrategy());

var app = express();

app.use(passport.initialize());

app.get('/', function(req, res) {
    console.log('Hello World');

    var req = {
        "username" : "alice",
        "password" : "kitten"
    };

    passport.authenticate('pph', function(err, user, info){
        if(err)
            throw err;

        if(!user){
            res.send("Invalid Username/Password");
        }
        else{
            res.send(user);
        }
            
    })(req); 


});

app.listen(3000, function() {
    console.log('Listening on 3000');
});
