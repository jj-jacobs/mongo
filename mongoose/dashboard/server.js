const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs");
app.engine("ejs", require("ejs").__express);
app.set("views", __dirname + "/public");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
var session = require("express-session");
const flash = require("express-flash");
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

const FrogSchema = new mongoose.Schema({
	name: { type: String, required: true, minlength: 2 },
	age: { type: Number, required: true },
	glubs: { type: String, required: true },
});

const Frog = mongoose.model("Frog", FrogSchema);

app.get("/", (req, res) => {
	Frog.find().then((frogs) => {
		var frogs = frogs;
		res.render("index.ejs", { frogs: frogs });
	});
});

app.get("/frogs/new", (req, res) => {
	res.render("newFrog.ejs");
});

app.get("/frogs/update/:id", (req, res) => {
	Frog.find({ _id: req.params.id })
		.then((frog) => {
			console.log("id", frog[0].id);
			console.log("frog", frog);
			res.render("updateFrog.ejs", { frog: frog });
		})
		.catch((err) => {
			console.log(err);
			res.json(err);
		});
});

app.get("/frogs/:id", (req, res) => {
	var id = req.params.id;
	Frog.find({ _id: id })
		.then((frog) => {
			console.log("id", id);
			console.log("frog", frog);
			res.render("frog.ejs", { frog: frog });
		})
		.catch((err) => {
			console.log(err);
			res.json(err);
		});
});

app.post("/frogs", (req, res) => {
	const frogData = req.body;
	Frog.create(frogData)
		.then((newFrog) => {
			newFrog.name = frogData.name;
			newFrog.age = frogData.age;
			newFrog.glubs = frogData.glubs;
			res.redirect("/");
			return newFrog.save();
		})
		.catch((err) => {
			console.log(err);
			res.json(err);
		});
});

app.post("/frogs/:id", (req, res) => {
	Frog.findById(req.params.id)
		.then((frog) => {
			frog.name = req.body.name;
			frog.age = req.body.age;
			return frog.save();
		})
		.then(() => res.redirect("/frogs/" + req.params.id))
		.catch((e) => {
			for (var key in e.errors) {
				req.flash("registration", e.errors[key].message);
			}
			res.redirect("/frogs/edit/" + req.params.id);
		});
});

app.post("/frogs/destroy/:id", (req, res) => {
	Frog.deleteOne({ _id: req.params.id })
		.then((deleteFrog) => {
			console.log("deleted", deleteFrog);
			res.redirect("/");
		})
		.catch((err) => {
			console.log(err);
			res.json(err);
		});
});
