const express = require("express");
const userAuth = require("../middlewares/auth");
const connectionsRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { set } = require("mongoose");
const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    const user = req.user;

    try {
        const requests = await connectionsRequest.find({ toUserId: user._id, status: "Interested" }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "skills", "photoUrl"]);
        res.status(200).json({ message: "Requests fetched successfully", data: requests });



    }
    catch (error) {
        res.status(500).send(error.message)
    }
});

// connection api 

userRouter.get("/user/connections", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionsRequest.find({ $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }], status: "accepted" })
            .populate("fromUserId", ["firstName", "lastName", "age", "gender", "skills", "photoUrl",]).populate("toUserId", ["firstName", "lastName", "age"]);

        console.log("connectionRequests--->", connectionRequests)
        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }

            return row.fromUserId;

        }
        )

        res.status(200).json({ message: "Connections fetched successfully", data })
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

///feed api 

userRouter.get("/user/feed", userAuth, async (req, res) => {



    try {
        const NOT_ALLOWED_USERS = ["Interested", "Ignored", "accepted"]

        const page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit) || 10;
        limit=limit>50?50:limit;
        const skip=(page-1)*limit;

        const loggedInUser = req.user;

        const connectionRequests = await connectionsRequest.find({ $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }] }).select("fromUserId toUserId")

        const hiddenUsers = new Set();
        connectionRequests.forEach((row) => {
            if (row.fromUserId.toString() === loggedInUser._id.toString()) {
                hiddenUsers.add(row.toUserId.toString())
            }
            else {
                hiddenUsers.add(row.fromUserId.toString())
            }
        })
        hiddenUsers.add(loggedInUser._id.toString())
        const hiddenUsersArray=Array.from(hiddenUsers)

        const feedUders = await User.find({ _id: { $nin: hiddenUsersArray } }).select("firstName lastName age gender skills photoUrl").skip(skip).limit(limit);

        res.status(200).json({ message: "Feed fetched successfully", data:feedUders });
        console.log("feedUders--->", feedUders)
  
    } catch (error) {
        res.status(500).send(error.message);
    }

})

//send connection request api


module.exports = userRouter; 