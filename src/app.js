const express = require('express');
const { validateSignup } = require('./utils/validator');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userAuth = require('./middlewares/auth');

const { connectDb } = require("./config/database")
const app = express();

const User = require('./models/user');

app.use(express.json());
app.use(cookieParser());

app.get("/user", async (req, res) => {

    const userEmailId = req.body.email;

    await User.find({ email: userEmailId }).then((result) => {

        if (result.length > 0) {
            res.send(result);
        }
        else {
            res.status(404).send("User not found");
        }
        // res.send(result);
    }).catch((error) => {
        res.send(error);
    })
})


//feed api -get all users

app.get("/feed",userAuth, async (req, res) => {

    await User.find().then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error);
    })
}
)

// delete api 

app.delete("/user", async (res, req) => {

    const userId = "67ae1afbe3fb824b00c4fd36";

    try {

        await User.findByIdAndDelete(userId)
        res.send("user is deleted")

    }
    catch (err) {
        res.status(404).send(err)
    }



})

//update user

app.patch(("/user"),userAuth, async (req, res) => {

    const userId = req.user;
    const data = req.body;

    const ALLOWED_FIELDS = ["firstName", "lastName", "password", "age", "skills", "about", "photoUrl", "gender"];

    const fields = Object.keys(data);
    const isValid = fields.every((field) => ALLOWED_FIELDS.includes(field));
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    data.password = hashedPassword;
    
    if (!isValid) {
        return res.status(400).send("Update is not allowed");
    }

    if (data.skills?.length > 3) {
        return res.status(400).send("Skills can't be more than 3");
    }
    await User.findByIdAndUpdate(userId, data, {
        returnDocument: "after",
        runValidators: true
    }).then((result) => {
        res.send("user is updated")
    }).catch((error) => {
        res.send(error.message);
    })

})

//create user 

app.post("/signup", async (req, res) => {
    const user = new User(req.body);

    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    user.password = hashedPassword;
    console.log(hashedPassword);
    try {
        validateSignup(req);
        await user.save();
        res.send("user is added successfully !!");
    }
    catch (error) {

        if (error.code === 11000) {
            res.status(400).send("Email is already registered");
        } else {
            res.status(500).send(error.message);
        }
    }



});

//login user

app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne
            ({ email: email });


        if (!user) {
            return res.status(400).send("Invalid Credentials");
        }

        const isPasswordValid = await user.isPasswordValid(password);
        if (!isPasswordValid) {

            return res.status(400).send("Invalid Credentials");
        }
        else {
            const token = await user.getJWT();
            res.cookie("token", token);
            res.send("log in successfully !!");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }

});

//get Profile

app.get("/profile",userAuth, async (req, res) => {
    const cookies = req.cookies;

    const user=req.user;

    try {
        res.send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }





});

// sendConnectionRequest

app.post("/sendConnectionRequest",userAuth, async (req, res) => {
    user=req.user

    res.send(user.firstName+"--Sent You Connection Request ");
});

connectDb().then(() => {

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
    console.log("Connected to MongoDB");

}).catch((error) => {
    console.log("Error connecting to MongoDB:", error);
});

