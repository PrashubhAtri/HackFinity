const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const config = require('config');
const methodOverride = require("method-override");
const flash = require("connect-flash");

const app = express();

//API
const apiRoute = require('./routes/api').route

//Getting the DB
const connectDB = require('./data/db');

//Trains
const {initialiseTrains} = require("./utils/Trains")

//Set Time of Start
const { SetSystemTime } = require('./utils/SystemTime')

//PassportJS
const passport = require("passport");
const LocalStrategy = require("passport-local");

//Models
const User = require("./models/User");

// database connect
connectDB();

//Setting Up the Trains
const numberOfTrains = config.get('numberOfTrains');
const TIMEINTERVAL = config.get('TIMEINTERVAL');
const LINE = "yellow";
initialiseTrains(numberOfTrains,TIMEINTERVAL,LINE);


let d = new Date();
let init = d.getTime();
SetSystemTime(init);

//app setup
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(express.json())
app.use(methodOverride('_method'));
app.use(flash());
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

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})
//middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}else{
		req.flash("error", "You need to be logged in to do that.")
		res.redirect('/login');
	}
}
//Base Display Route
app.get("/",(req,res) => {
	res.render("home",{currentUser:req.user});
})

//Register Routes
app.get("/show/:id",isLoggedIn,(req,res) => {
	User.findById(req.params.id,function(err,user){
		if(err){
			console.log(err);
			req.flash("error", "Sorry.User not found.")
			res.redirect("/");
		}else{
			req.flash("success", "Welcome to Delhi Metro Booking Portal, "+ user.username);
			res.render("profile",{user:user});
		}
	})
});
app.post("/register",(req,res) => {
	let newUser = new User({username:req.body.username, card:req.body.card});
	User.register(newUser, req.body.password, (err,user) => {
		if(err){
			console.log(err);
			if(err.message=="A user with the given username is already registered"){
				req.flash("error", "A user with the given card number is already registered");
			}else{
				req.flash("error", err.message);
			}
			return res.redirect("/")
		}
		passport.authenticate("local")(req,res,() => {
			req.flash("success", "Successfully registered");
			res.redirect("/show/"+user._id);
		})
	})
})

//LOGIN ROUTES
app.get("/login",(req,res) => {
	req.flash("success", "Welcome to Delhi Metro Booking Portal.");
	res.render("home")
});
app.post("/login",passport.authenticate("local",{
	failureFlash : "Oops..Authentication failed",
	failureRedirect:"/"
	}),(req,res) => {
	req.flash("success", "Successfully logged in.");
	res.redirect("/show/"+req.user._id);
	});
// app.get("/profile",(req,res)=>{
// 	res.render("profile");
// });
//LOGOUT ROUTES
app.get("/logout",(req,res) => {
	req.logout();
	req.flash("success", "Successfully logged out.");
	res.redirect("/");
})

//debugging routes
// app.get("/secret",(req,res) => {
// 	res.render("secret");
// })

//API routes
app.use('/api', apiRoute)

const PORT = process.env.PORT || 5555 ||3000;

app.listen(PORT, process.env.IP, () => {
	console.log(`App Started at http://localhost:${PORT}`);
})