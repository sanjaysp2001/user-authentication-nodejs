var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var mongoose = require("mongoose");
var User = require("../models/user");
var authenticate = require("../authenticate");
var router = express.Router();
router.use(bodyParser.json());

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  User.register(
    new User({ username: req.body.email }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.send(err);
      } else {
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        user.email = req.body.email;
        user.save((err, user) => {
          if (err) {
            res.send(err);
          } else {
            res.statusCode = 200;
            var token = authenticate.getToken({ _id: user._id });
            res.cookie("jwt", token, {
              maxAge: 15000000,
            });
            res.redirect("/welcome",{user: req.body.firstname});
          }
        });
      }
    }
  );
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", passport.authenticate("local"), (req, res) => {
try {
    var token = authenticate.getToken({ _id: req.user._id });
} catch (error) {
    console.log(error);
}
  res.statusCode = 200;
  res.cookie("jwt", token, { maxAge: 15000000 });
  res.redirect("/welcome",{user:req.user.firstname});
});

module.exports = router;