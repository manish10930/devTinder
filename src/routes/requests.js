const express = require("express");

const ConnectionRequest = require("../models/connectionRequest");
const { connectionRequestValidation } = require("../utils/validator");


const userAuth = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const connectionRequest = new ConnectionRequest({
        fromUserId: req.user._id,
        toUserId: req.params.toUserId,
        status: req.params.status,
    });
    try {

        const isConnectionRequestExist = await
            ConnectionRequest.findOne({ fromUserId: fromUserId, toUserId: toUserId });
        
        const userAlreadySentRequest = await ConnectionRequest
            .findOne({ fromUserId: toUserId, toUserId: fromUserId });
        if (userAlreadySentRequest) {
            throw Error("You have already received request from this user");
        }
        if (!connectionRequestValidation(status)) {
            throw Error("Invalid Status");
        }

        else if (isConnectionRequestExist) {
            throw Error("You have Already Sent Request !!");
        }
        const data = await connectionRequest.save();
        res.json({
            message: "Request Sent",
            data: data
        })


    } catch (error) {
        res.status(500).send(error.message);
    }


});

module.exports = requestRouter;