var express = require('express');
var passport = require('passport');
var PPHStrategy = require('./lib').Strategy;
var secrets = require('./secrets').secrets;

passport.use(new PPHStrategy(
    {"threshold": 10, "filename": "securepasswords", "secrets": secrets}
));

var app = express();

app.use(passport.initialize());

app.get('/', function(req, res) {

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
