const mongoose = require('mongoose');
const express = require('express')
const app = express()
app.set("view engine", "ejs");
app.engine("ejs", require("ejs").__express);
app.set("views", __dirname + "/public");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
const server = app.listen(1337);
mongoose.connect('mongodb://localhost/name_of_your_DB', {useNewUrlParser: true});

const UserSchema = new mongoose.Schema({
    name: String,
    age: Number
   })
   // create an object that contains methods for mongoose to interface with MongoDB
   const User = mongoose.model('User', UserSchema);
   