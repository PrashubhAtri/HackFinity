const { Router } = require('express')

const route = Router()

route.get('/',(req,res)=>{
    return res.send("Successful API")
})

module.exports = { route }