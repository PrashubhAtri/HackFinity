const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

//API
const apiRoute = require('./routes/api').route

//Getting the DB
const connectDB = require('./data/db');

//Trains
const {initialiseTrains} = require("./utils/Trains")

//PassportJS
const passport = require("passport");
const LocalStrategy = require("passport-local");

//Models
const User = require("./models/User");

// database connect
connectDB();
initialiseTrains(10,2);

let d = new Date();
let initTime = d.getTime()
console.log(initTime)

//app setup
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(express.json())

//auth config
app.use(session({
	secret:"HackFinity",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({usernameField:'card'},User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
	res.locals.currentUser = req.user;
	next();
})

app.get("/",(req,res) => {
	res.render("home",{currentUser:req.user});
})
app.get("/register",(req,res) => {
	res.render("register")
});
app.post("/register",(req,res) => {
	let newUser = new User({username:req.body.username, card:req.body.card});
	User.register(newUser, req.body.password, (err,user) => {
		if(err){
			console.log(err);
			return res.redirect("/register")
		}
		passport.authenticate("local")(req,res,() => {
			res.redirect("/secret");
		})
	})
})
//LOGIN ROUTES
app.get("/login",(req,res) => {
	res.render("login")
});
app.post("/login",passport.authenticate("local",{
	successRedirect:"/secret",
	failureRedirect:"/login"
}),(req,res) => {});
//LOGOUT ROUTES
app.get("/logout",(req,res) => {
	req.logout();
	res.redirect("back");
})

//debugging routes
app.get("/secret",(req,res) => {
	res.render("secret");
})

//API routes
app.use('/api', apiRoute)

const PORT = process.env.PORT || 3000;

app.listen(PORT, process.env.IP, () => {
	console.log(`App Started at http://localhost:${PORT}`);
})