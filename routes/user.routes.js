var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var mongoose = require("mongoose");
var User = require("../models/user");
var authenticate = require("../authenticate");
var router = express.Router();
router.use(bodyParser.json());


/*----------------------------Endpoint for User Registration/Signup-------------------------------------- */
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", async(req, res, next) => {
  var errFlag = 0;
  let userCheck = await User.findOne({email:req.body.email});
  if(userCheck){
    res.send({message:'User already exists!'});
  }
  else{
    if(req.body.password !== req.body.confirmpassword){
      errFlag = 1;
      res.send({error:'Passwords dont match!'});
    }
    if(errFlag == 0){
      User.register(
        new User({ username: req.body.email }),req.body.password,(err, user) => {
          if (err) {
            res.send(err);
          } 
          else {
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.email = req.body.email;
            user.save((err, user) => {
              if (err) {
                res.send(err);
              } 
              else {
                res.statusCode = 200;
                var token = authenticate.getToken({ _id: user._id });
                res.cookie("jwt", token, { maxAge: 150000,});
                res.redirect("/all");
              }
            })
          }
        });
    }
  }
});
/*------------------------------------------------------------------------------------------------------------- */

/*-------------------------------------------------Endpoint for Sign In---------------------------------------- */
router.get("/login", (req, res, next) => {
  res.render("login");
});
router.post("/login",passport.authenticate('local'),(req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.cookie("jwt", token, { maxAge: 15000000 });
  res.redirect("/all");
});
/*--------------------------------------------------------------------------------------------------------------- */

//Logout Endpoint
router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/users/login");
});

module.exports = router;
