const mongoose = require('mongoose')

//Describing the Train
const TrainSchema = new mongoose.Schema({
    name:{
      type : String,
    },
    initTime:{
        type : Number,
        unique : true,
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
    }
})

module.exports = Train = mongoose.model('train', TrainSchema)