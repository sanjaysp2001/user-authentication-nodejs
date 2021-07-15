const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const userRouter = require("./routes/user.routes");
const config = require("./config");
const authenticate = require("./authenticate");
const app = express();

/*-------------------------------------Database Configuration -Starts------------------------------------------------ */
mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
/*-------------------------------------Database Configuration -Ends--------------------------------------------------------------------- */

/*--------------------------------------Application Configuration - Starts------------------------------------------- */
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cookieParser());

//Using routers
app.use("/users", userRouter);

/*--------------------------------------Application Configuration - Ends-------------------------------------------------------------------- */

/*-------------------------------------Default Routes - Starts------------------------------------------------------- */
app.get("/", async (req, res) => {

  //This function checks if the jwt cookie is valid
  if (req.cookies["jwt"]) {
    jwt.verify(req.cookies["jwt"], config.secretKey, function (err, decoded) {
      if (!err) 
        res.redirect("/all");
      else 
        res.render("login");
    });
  } else {
    res.redirect("/users/login");
  }
});

//Success Page
app.get("/all", authenticate.verifyUser, async (req, res) => {
  res.render("welcome", {
    user: req.user,
  });
});

/*------------------------------------------Default Routes - Ends------------------------------------------------------------------ */

app.listen(process.env.PORT || 5000);
console.log("server started at localhost:5000");
