//Train Model
const System = require("../models/System")

//Initialising Trains
async function SetSystemTime(time){
    try{
        let system = System.findOne({name : "HackFinity"})
        if(system){
            system.time = time
            await system.save()
            return;
        }
        system = new System({time : time})
        await system.save()
    }catch (e){
        console.log(e.message);
    }
}

async function GetSystemTime(){
    try{
        let system = System.findOne({name : "HackFinity"})
        if(system){
            let initialTime = system.time
            return initialTime;
        }
    }catch (e){
        console.log(e.message);
    }
}

module.exports = {
    SetSystemTime,
    GetSystemTime
}