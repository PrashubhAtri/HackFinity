const { Router } = require('express')

const BookingsRoute = require('./bookings').route

const route = Router()

route.use('/bookings',BookingsRoute)

module.exports = { route }