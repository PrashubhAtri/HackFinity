const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const axios = require('axios')
const config = require('config')

const route = Router();

//Constants
const CHARGEPERSTATION = config.get('CHARGEPERSTATION');
const INTERCHANGECHARGES = config.get('INTERCHANGECHARGES');

//Post Route for Booking a Slot
/*
    Body Requirement : {
        initialStation : the Starting Station of the Journey,
        finalStation : the Ending Station of the Journey,
    }
*/
route.get("/:fareamt", (req,res)=>{
	// res.send("hi");
	res.render("fare",{fare:req.params.fareamt});
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
        //Calculating the fare
        const uri = encodeURI(
            `https://delhimetroapi.herokuapp.com/metroapi/from=${req.body.initialStation}&to=${req.body.finalStation}`
        )
        const MetroResponse = await axios.get(uri);
        const Data = MetroResponse.data;
        let fare = CHARGEPERSTATION*(Data.path.length) + INTERCHANGECHARGES*(Data.interchange.length);
        res.json({fare}).redirect("/api/fare/"+fare);
    } catch (err) {
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})

module.exports = { route }