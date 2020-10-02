const mongoose = require('mongoose')

//Describing the Train
const TrainSchema = new mongoose.Schema({
    name:{
      type : String,
    },
    initTime:{
        type : Number,
        required : true
    },
    maxCapacity:{
        type : Number,
        required : true
    },
    //Occupancy = Max Capacity - Current Capacity
    currCapacity:{
        type : Number,
        default : 0
    },
    position : {
        type : Number,
        default: 0
    },
    index : {
        type : Number
    },
    line : {
        type : String
    }
})

module.exports = Train = mongoose.model('train', TrainSchema)