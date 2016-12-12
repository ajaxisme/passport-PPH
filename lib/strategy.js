/**
 * Module dependencies.
 */
var passport = require('passport-strategy')
  , util = require('util')
  , PPH = require('./polypasswordhasher.js')
  , sss = require('secrets.js');

/**
 * `Strategy` constructor.
 *
 * The PolyPasswordHasher strategy authenticates requests based on the credentials 
 * submitted through an HTML-based login form.
 *
 * The PolyPasswordHasher requires the threshold, password file name and initial secret
 * credentials to unlock the password file.
 *
 * Examples:
 *
 *     passport.use(new PPHStrategy(
 *          {"threshold": 10, "filename": 'securepasswords", "secrets": "secrets"}
 *     ));
 *
 * @param {Object} options
 * @api public
 */
function Strategy(options) {

  if(!options)
      options = {}

  this._threshold = options.threshold || 10;
  this._filename = options.filename || 'securepasswords';
  this._secrets = options.secrets || null;
  this._secret_recovered = false;

  console.log("Here");
  /*
  if(!options.secrets){
      var secrets = require('./secrets');
      this._secrets = secrets.secrets;
      this._secret_known = true;
  }
  else
      this._secrets = null;
  */


  this._pph = new PPH(this._threshold, this._filename, 2);
  this._sharelist = []

  if(this._secrets){
    try {
        this._pph.unlock_password_data(this._secrets);
        this._secret_recovered = true;
    }
    catch(e) {
        console.log("Less number of shares than threshold");
        throw e;
    }
  }

  passport.Strategy.call(this);
  this.name = 'pph';
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {

  options = options || {};

  username = req.username;
  password = req.password;

  if (!username || !password) {
    return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
  }
  
  var self = this;
  
  try {
      var ok = this._pph.is_valid_login(username, password);
      if(ok) {
          if(!this._secret_recovered){
              for(var entry=0; entry<this._pph.accountdict[username].length;entry++){
                  //cache the entry
                  var tempentry = this._pph.accountdict[username][entry];

                  //ignore shielded account entries
                  if (tempentry["sharenumber"] === 0)
                      continue;

                  var tempsaltedpasshash = this._pph._SHA256(tempentry["salt"] + password);
                  var tempsharenumber_hex = tempentry["sharenumber"].toString(16);
                  if (tempsharenumber_hex.length === 1)
                      tempsharenumber_hex = "0" + tempsharenumber_hex;
                  var tempshare = "8" + tempsharenumber_hex + this._pph._xor(tempsaltedpasshash, tempentry["saltedpasshash"].substring(0, tempentry["saltedpasshash"].length - this._pph.isolatedcheckbits));
                  this._sharelist.push(tempshare);

              }

              var combined = sss.combine(this._sharelist);

              if(this._pph.verify_secret(combined)){
                  this._secret_recovered = true;
                  console.log("Found secret");
              }
              else {
                  console.log("No secret yet");
              }
          }
          self.success(username);
      }
      else
          self.fail(username, 401);
  } catch (err) {
    self.error(err);
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
