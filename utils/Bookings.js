//Default Limits
const LIMIT = 2;

//Checking for Penalties
function Penalty(count){
    return count >= LIMIT;
}

module.exports = {
    Penalty
}