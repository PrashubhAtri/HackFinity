const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const axios = require('axios')
const config = require('config')

//Functions
const { Penalty } = require('../../utils/Bookings')
// const { GetSystemTime } = require('../../utils/SystemTime')
// const { GetAllTrains } = require('../../utils/Trains')

//Models
const User = require('../../models/User');
const Train = require('../../models/Trains')

const route = Router();

//Constants
const CHARGEPERSTATION = config.get('CHARGEPERSTATION');
const INTERCHANGECHARGES = config.get('INTERCHANGECHARGES');
const PENALTY = config.get('PENALTY');
const TIMEINTERVAL = config.get('TIMEINTERVAL');
const TOTALSTATIONS = config.get('TOTALSTATIONS');

//Post Route for Booking a Slot
/*
    Body Requirement : {
        initialStation : the Starting Station of the Journey,
        finalStation : the Ending Station of the Journey,
        timedifference : the time after the current time the slot is needed,
    }
*/
route.get("/", function(req,res){
	res.render("booking");
})
route.post('/', [
    check('initialStation', 'Initial Station Field is Required').not().isEmpty(),
    check('finalStation', 'Final Station Field is Required').not().isEmpty()
],async (req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try {
        //Train Check and Reservation
        let sys = await System.findOne({name : "HackFinity"})
        let initialTime = sys.time;
        let d = new Date;
        let currentTime = d.getTime();
        let interval = (req.body.timedifference)*60*1000;
        let TimeELapsed = parseInt((currentTime + interval - initialTime) / 60000) % 1440;
        let Trains = await Train.find({line : "yellow"});
        if(Trains.length === 0){
            return res.send("No Trains Available")
        }
        let Positions = Trains.map((train)=>{return(((train.initTime + TimeELapsed)/TIMEINTERVAL)%TOTALSTATIONS)});
        let Station = 0;
        let TrainPrescribed = Positions.map((pos)=>{return(pos <= Station)}).indexOf(true);
        let TrainBooked = await Train.findOne({index : TrainPrescribed});
        if(!TrainBooked){
            res.send("No Train Found");
            return
        }
        console.log(TrainBooked)
        if(TrainBooked.currCapacity >= TrainBooked.maxCapacity){
            res.send("Train Already at Max Capacity.")
        }
        TrainBooked.currCapacity++;
        //Getting the user
        let user = await User.findById(req.user.id);
        if(!user){
            return res.send("User Not Found");
        }
        //Registering the booking and calculating the fare
        const uri = encodeURI(
            `https://delhimetroapi.herokuapp.com/metroapi/from=${req.body.initialStation}&to=${req.body.finalStation}`
        )
        const MetroResponse = await axios.get(uri);
        const Data = MetroResponse.data;
        let fare = CHARGEPERSTATION*(Data.path.length) + INTERCHANGECHARGES*(Data.interchange.length);
        let commute = {
            iStation : req.body.initialStation,
            fStation : req.body.finalStation,
            fare : fare,
            trainIdx : TrainPrescribed
        }
        user.booking.unshift(commute);
        //Deducting the Fare
        user.balance -= fare;
        //Saving to the DataBase
        await user.save();
        await TrainBooked.save();
        //returning Successfully on completion
        let value = {
            path : Data.path,
            fare : fare,
            train : TrainBooked.name
        }
        res.json(value)
    } catch (err) {
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})

//Delete Route for Cancellation
/*
    Body Requirement : None
*/
route.delete('/cancel', async (req, res)=>{
    try {
        //Getting the user
        let user = await User.findById(req.user.id);
        if(!user){
            return res.send("User Not Found");
        }
        //Checking for Penalty
        let guilty = Penalty(user.faults);
        if(guilty){
            user.Penalty += PENALTY;
        }
        //Similarly Vacating the Train
        let TrainIdx = user.booking[0].trainIdx;
        let train = await Train.findOne({index : TrainIdx});
        train.currCapacity--;
        // Unregistering the Booking
        user.booking = [];
        user.faults += 1;
        //Saving the changes to DataBase
        await user.save();
        await train.save();
    } catch (err) {
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})


module.exports = { route }