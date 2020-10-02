const mongoose = require('mongoose')

//Describing the System
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

module.exports = System = mongoose.model('system', SystemSchema)