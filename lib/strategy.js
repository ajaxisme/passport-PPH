/**
 * Module dependencies.
 */
var passport = require('passport-strategy')
  , util = require('util')
  , PPH = require('./polypasswordhasher.js');

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
  this._secrets = options.secrets;
  if(!options.secrets){
      var secrets = require('./secrets');
      this._secrets = secrets.secrets;
  }

  this._pph = new PPH(this._threshold, this._filename);

  try {
      this._pph.unlock_password_data(this._secrets);
  }
  catch(e) {
      console.log("Less number of shares than threshold");
      throw e;
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
      if(ok)
          self.success(username);
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
