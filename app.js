var passport = require('passport');
var passport_local = require('passport-local');
var PPH = require('./polypasswordhasher.js');

var secrets = require('./secrets');

var THRESHOLD = 10;

var pph = new PPH(THRESHOLD, 'securepasswords');

var secrets = secrets.secrets;

try{
    pph.unlock_password_data(secrets);
}
catch(e) {
    console.log("Less number of shares than threshold");
}

if(pph.is_valid_login("alice", "kitten")){
    console.log("Valid");
}
else{
    console.log("Invalid");
}

console.log('Works');
