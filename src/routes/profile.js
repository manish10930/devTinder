
const express = require("express");
const userAuth = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validator");
const User = require("../models/user");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    const cookies = req.cookies;

    const user = req.user;
    console.log("user--->",user)
    

    const filteredUserData={
        firstName:user.firstName,
        LastName:user.LastName,
        email:user.email,
        skills:user.skills,
        about:user.about,
        photoUrl:user.photoUrl,
        dateOfBirth:user.dateOfBirth,
        age:user.age,
        createdAt:user.createdAt,
        gender:user.gender,
        dateOfBirth:user.dateOfBirth


    }

    try {
        res.status(200).json({message:"Profile fetched successfully",data:filteredUserData});
    } catch (error) {
        res.status(500).send(error.message);
    }

});
profileRouter.post("/profile/edit", userAuth, async (req, res) => {
    const data = req.body;

    console.log("data--->", data);

    const isValid = validateProfileEditData(req);
    const user = req.user;

    Object.keys(data).forEach((field) => {
        user[field] = data[field];
    });

    try {
        if (!isValid) {
            return res.status(400).send("Invalid data");
        }
        else if(data.skills.length>3){
            throw Error("Skills should not be more than 3")
        }
        await User.findByIdAndUpdate(user._id, user, { new: true, runValidators: true })
            .then((result) => {
                res.json({
                    message: `${user.firstName} your Profile is updated successfully`,
                    success_code:"1",
                    data: result
                })
            })
            .catch((error) => {
                res.status(400).send(error.message);
            });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
module.exports = profileRouter;
