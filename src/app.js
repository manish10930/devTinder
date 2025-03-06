const express = require('express');
const { connectDb } = require("./config/database")
const app = express();

const User = require('./models/user');
const authRouter = require("./routes/auth");
const cores = require('cors');

const corsOptions = {
    origin: 'http://localhost:5173', // Allow only this origin
    optionsSuccessStatus: 200,
    credentials: true,
  };
app.use(cores(corsOptions));


const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const cookieParser = require('cookie-parser');
const userRouter  = require('./routes/user');
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/",  userRouter);

connectDb().then(() => {

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
    console.log("Connected to MongoDB");

}).catch((error) => {
    console.log("Error connecting to MongoDB:", error);
});

