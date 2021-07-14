const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const userRouter = require("./routes/users");
const config = require("./config");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authenticate = require("./authenticate");
const app = express();

mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cookieParser());

app.get("/", async (req, res) => {
  if (req.cookies["jwt"]) {
    jwt.verify(req.cookies["jwt"], config.secretKey, function (err, decoded) {
      if (!err) {
        res.redirect("/all");
      } else res.render("login");
    });
  } else {
    res.render("login");
  }
});
app.get("/all", authenticate.verifyUser, async (req, res) => {
  res.render("welcome", {
    user: req.user,
  });
});

app.use("/users", userRouter);

app.listen(5000);
console.log("server started at localhost:5000");
