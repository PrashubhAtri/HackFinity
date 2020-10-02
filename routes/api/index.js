const { Router } = require('express')

const BookingsRoute = require('./bookings').route
const FareRoute = require('./bookings').route

const route = Router()

route.use('/bookings',BookingsRoute)
route.use('/fare',FareRoute)

module.exports = { route }