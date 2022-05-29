const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs");
app.engine("ejs", require("ejs").__express);
app.set("views", __dirname + "/public");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
var session = require("express-session");
const flash = require('express-flash');
app.use(
  session({
    secret: "counter",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());
const server = app.listen(4200);
mongoose.connect("mongodb://localhost/quotingDojo", { useNewUrlParser: true });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  quote: String,
  time: String,
});
var time = new Date();

const User = mongoose.model("User", UserSchema);

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/quotes", (req, res) => {
  const userData = req.body;
  User.create(userData)
    .then((newUser) => {
      newUser.name = userData.name;
      newUser.quote = userData.quote;
      newUser.time = time.toLocaleTimeString();
      res.redirect("/quotes");
      return newUser.save();
    })
    .catch((err) => {
      console.log("error time");
      req.flash("we got an err");
      res.json(err);
    });
});

app.get("/quotes", (req, res) => {
  User.find()
    .then((users) => {
      var userArray = users;
      console.log(userArray);
      res.render("quotes.ejs", { arr: userArray });
      return userArray;
    })
    .catch((err) => res.json(err));
});
