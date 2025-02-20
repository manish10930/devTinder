const mongoose = require('mongoose');


const connectDb = async () => {

    try {
        await mongoose.connect('mongodb+srv://manishkumar10930:Manish%40123@namastenode.bnhyr.mongodb.net/DevTinder');
    

    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
    }

}

module.exports = { connectDb }