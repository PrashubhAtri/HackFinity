const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const axios = require('axios')

const { Penalty } = require('../../utils/Bookings')
const { GetSystemTime } = require('../../utils/SystemTime')
const { GetAllTrains } = require('../../utils/Trains')

const User = require('../../models/User');

const route = Router();

//Constants
const CHARGEPERSTATION = 2;
const INTERCHANGECHARGES = 5;
const PENALTY = 25;

//TODO change to post
route.get('/', [
    check('initialStation', 'Initial Station Field is Required').not().isEmpty(),
    check('finalStation', 'Final Station Field is Required').not().isEmpty()
],async (req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try {
        //Train Check and Reservation
        let initialTime = GetSystemTime();
        let d = new Date;
        let currentTime = d.getTime();
        let TimeELapsed = parseInt(((currentTime - initialTime)/1000)/60) % 1440;
        let Trains = GetAllTrains("yellow");
        if(Trains.length === 0){
            return res.send("No Trains Available")
        }
        //TODO map the Trains and decide which one to fill
        //Getting the user
        let user = await User.findById(req.user.id);
        if(!user){
            return res.send("User Not Found");
        }
        //Registering the booking
        const uri = encodeURI(
            `https://delhimetroapi.herokuapp.com/metroapi/from=${req.body.initialStation}&to=${req.body.finalStation}`
        )
        const MetroResponse = await axios.get(uri);
        const Data = MetroResponse.data;
        let fare = CHARGEPERSTATION*(Data.path.length) + INTERCHANGECHARGES*(Data.interchange.length);
        let commute = {
            iStation : req.body.initialStation,
            fStation : req.body.finalStation,
            fare : fare
        }
        user.booking.unshift(commute);
        //Deducting the Fare
        user.balance -= fare;
        //Saving to the DataBase
        await user.save();
        //returning the updated user
        res.json(user)
    } catch (err) {
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})

//TODO change to post
route.get('/cancel', async (req, res)=>{
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
        // Unregistering the Booking
        user.booking = [];
        user.faults += 1;
        //Saving the changes to DataBase
        await user.save();
    } catch (err) {
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})


module.exports = { route }