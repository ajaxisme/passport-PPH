# Passport Strategy for PolyPasswordHasher

Developing a Passport Strategy for the PolypasswordHasher Scheme making it easy to integrate the authentication scheme using passport.

How to run it:
  1. git clone -b abhinav-dev https://github.com/ajaxisme/passport-pph.git
  2. You just need the lib folder for your app and the package.json
  3. npm install
  4. In your app.js, import passport-pph as described in example app.js
  5. Initialize using
  
    ```
    passport.use(new PPHStrategy(
        {"threshold": 10, "filename": "securepasswords"}
    ));
    ```
  * Generate "securepasswords" file
    1. git clone https://github.com/PolyPasswordHasher/PolyPasswordHasher-JavaScript.git
    2. npm install
    3. Run `node testpolypasswordhasher.js`
    4. Use the securepasswords file generated
  
  6. For every password authentication, do 
      ```
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
      ```
      
      
   *** Refer to app.js for easier implementation

