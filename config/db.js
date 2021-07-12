const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongooURI')

const connectDB = async () => {
    try {
        await mongoose.connect(db , { useUnifiedTopology: true , useNewUrlParser: true, useCreateIndex: true , useFindAndModify: false });

        console.log("Database is connected")
    } catch (error) {
        console.error(error.message);
        //Exit process with failure
        process.exit(1)
    }
}

module.exports = connectDB;