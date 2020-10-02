const config = require('config')

//Default Limits
const LIMIT = config.get('LimitOfBooking');

//Checking for Penalties
function Penalty(count){
    return count >= LIMIT;
}

module.exports = {
    Penalty
}