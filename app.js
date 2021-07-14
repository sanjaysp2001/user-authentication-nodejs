var express = require("express");
var session = require("express-session");
var passport = require("passport");
var config = require("./config");
var cookieParser  = require("cookie-parser");
var jwt = require("jsonwebtoken");
var authenticate = require("./authenticate");
var userRouter = require("./routes/user.routes");


/*----------------------------Database Configuration----------------------------------*/ 
var mongoose = require('mongoose');
const connection = mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
connection.then((db)=>{
  console.log('Connection Successful');
}).catch((err)=>{
  console.log(err);
});
/*------------------------------------------------------------------------------------*/

/*------------------------------Application Setup-------------------------------------*/
const app = express();

//Setting up the View Engine
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.secretKey));

app.use("/users",userRouter);
/*------------------------------------------------------------------------------------*/

//This code checks for token in the request cookie
app.get("/", async (req, res) => {
  if (req.cookies["jwt"]) {
    jwt.verify(req.cookies["jwt"], config.secretKey, function (err, decoded) {
        if (!err) 
            res.redirect("/welcome");
        else 
            res.render("login"); 
    });
  } else {
    res.render("login");
  }
});

app.get("/welcome",authenticate.verifyUser,(req,res)=>{
    res.render("welcome",{user:req.user.firstname});
})

//Starting the server
app.listen(3000);