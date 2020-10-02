var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
	username:String,
	password:String,
	card:String,
	balance:{
		type: Number,
		default:100
	},
	penalty:{
		type: Number,
		default:0
	},
	faults:{
		type: Number,
		default:0
	},
	booking:[
		{
			iStation:String,
			fStation:String,
			fare:Number,
			trainIdx:Number,
			timeddifference:Number
		}
	]
});

userSchema.plugin(passportLocalMongoose,{usernameField:'card'});
module.exports = mongoose.model("User",userSchema);