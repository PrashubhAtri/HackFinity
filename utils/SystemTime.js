//Train Model
const System = require("../models/System")

//Initialising Trains
async function SetSystemTime(time){
    try{
        let sys = await System.findOne({name : "HackFinity"})
        if(sys){
            sys.time = time
            await sys.save()
            return;
        }
        sys = new System({time : time})
        await sys.save()
    }catch (e){
        console.log(e.message);
    }
}

async function GetSystemTime(){
    try{
        let system = System.findOne({name : "HackFinity"})
        if(!system){
            return new Error("System not Present Yet")
        }
        let initialTime = system.time
        return initialTime;
    }catch (e){
        console.log(e.message);
    }
}

module.exports = {
    SetSystemTime,
    GetSystemTime
}