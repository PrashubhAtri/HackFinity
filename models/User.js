var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
	username:String,
	password:String,
	card:String
});

userSchema.plugin(passportLocalMongoose,{usernameField:'card'});
module.exports = mongoose.model("User",userSchema);