//Train Model
const Train = require("../models/Trains")

//Initialising Trains
async function initialiseTrains(count, interval){
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
                position : 0
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

module.exports = {
    initialiseTrains
}