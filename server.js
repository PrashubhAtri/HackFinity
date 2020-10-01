var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	User = require("./models/user");

// database config
mongoose.connect('mongodb://localhost:27017/hackfinity', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));


//app setup
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));

//auth config
app.use(require("express-session")({
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
	next();
})

app.get("/",function(req,res){
	res.render("home",{currentUser:req.user});
})
app.get("/register",function(req,res){
	res.render("register")
});
app.post("/register",function(req,res){
	var newUser = new User({username:req.body.username, card:req.body.card});
	User.register(newUser, req.body.password, function(err,user){
		if(err){
			console.log(err);
			return res.redirect("/register")
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/secret");
		})
	})
})
//LOGIN ROUTES
app.get("/login",function(req,res){
	res.render("login")
});
app.post("/login",passport.authenticate("local",{
	successRedirect:"/secret",
	failureRedirect:"/login"
}),function(req,res){
	
});
//LOGOUT ROUTES
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("back");
})

//debugging routes
app.get("/secret",function(req,res){
	res.render("secret");
})


app.listen(3000, process.env.IP, function(){
	console.log("Now serving the YELPCAMP app.");
})