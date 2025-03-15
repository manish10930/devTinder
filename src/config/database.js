
const mongoose = require('mongoose');

require('dotenv').config();

// const DB_USER="manishkumar10930"
// const DB_PASSWORD="Manish%40123"

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const connectDb = async () => {

    try {
        await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@namastenode.bnhyr.mongodb.net/DevTinder`);
    

    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
    }

}

module.exports = { connectDb }