const mongoose = require('mongoose')
const config = require('config')

const URI = config.get('ClusterURI')

const connectDB = async () => {
    try {
        await mongoose.connect(URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })

        console.log("DB connected")
    }catch (e) {
        console.error(e.message)
        process.exit(1)
    }
}

module.exports = connectDB