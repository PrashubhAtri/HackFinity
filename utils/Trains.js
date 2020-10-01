//Train Model
const Train = require("../models/Trains")

//Initialising Trains
async function initialiseTrains(count, interval, line){
    let base = 0;
    try{
        while(base !== -1*count){
            let idx = (count + base);
            let name = "train" + idx;
            let newTrain = await Train.findOne({ name })
            if(newTrain){
                console.log("Trains Pre-Initialised");
                return;
            }
            const trainAttributes ={
                name : name,
                initTime : interval*base,
                maxCapacity : 50,
                currCapacity : 0,
                position : 0,
                line : line
            };
            newTrain = new Train(trainAttributes);
            await newTrain.save();
            base--;
        }
        console.log("Trains Initialised");
    }catch (e){
        console.log(e.message);
    }
}

//Getting All Trains
async function GetAllTrains(line){
    try{
        let Trains = await Trains.find({line:line})
        if(Trains.length <= 0 ){
            return []
        }
        return Trains
    }catch (e){
        console.log(e.message);
    }
}

module.exports = {
    initialiseTrains,
    GetAllTrains
}