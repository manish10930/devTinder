
const express = require("express")

const authRouter = express.Router();
const {validateSignup} = require("../utils/validator")
const bcrypt = require("bcrypt")
const User = require("../models/user")
const crypto = require("crypto");

//signup

authRouter.post("/signup", async (req, res) => {
    const user = new User(req.body);

    console.log("req body--->", req.body);

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

//login
authRouter.post("/login", async (req, res) => {

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
            res.json({ status:200,message: "Logged in successfully", token: token });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }

});
//logout
authRouter.post("/logout",async (req,res)=>{
    res.clearCookie("token");
    res.send("Logged out successfully !!");
})
// forgot password
authRouter.post("/forgotPassword", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        const token = await user.getResetToken();
        await user.save();
        // In a real application, you would send this token via email
        res.send({ resetToken: token });
    } catch (error) {
        res.status(500).send(error.message);
    }
});


//reset password

authRouter.post("/resetPassword", async (req, res) => {
    const { token, newPassword } = req.body;


    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send("Invalid or expired token");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 8);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.send("Password reset successfully!");
    } catch (error) {
        res.status(500).send(error.message);
    }
});
module.exports = authRouter
