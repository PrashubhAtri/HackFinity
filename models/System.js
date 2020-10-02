const mongoose = require('mongoose')

//Describing the Train
const SystemSchema = new mongoose.Schema({
    time : {
        type : Number
    },
    name : {
        type: String,
        default : "HackFinity",
        unique : true
    }
})

module.exports = Train = mongoose.model('system', SystemSchema)