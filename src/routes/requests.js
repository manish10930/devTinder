const express = require("express");

const ConnectionRequest = require("../models/connectionRequest");
const { connectionRequestValidation } = require("../utils/validator");

const User = require("../models/user");


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
        // console.log("fromUserId-->",fromUserId.toString());
        // console.log("toUserId-->",toUserId);

        if (fromUserId.toString() === toUserId.toString()) {
            throw Error("You can not send request to yourself");
        }
        const isToUserExits = await User.findById({ _id: toUserId });

        const FromUserFirstName=await User.findById({_id:fromUserId},{firstName:1,_id:0});
        
        console.log("FromUserFirstName-->",FromUserFirstName);

        if (!isToUserExits) {
            throw Error("User Does not Exist");
        }
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
            message: `${FromUserFirstName.firstName} ${status} Your Profile`,
            data: data
        })


    } catch (error) {
        res.status(500).send(error.message);
    }


});

requestRouter.post("/request/review/:status/:requestId",userAuth, async (req, res) => {

    try{

        const loggedInUserId=req.user._id;
        const requestId=req.params.requestId;
        const status=req.params.status;

        const AllowedStatus=["accepted","rejected"];
        if(!AllowedStatus.includes(status)){
            
            return res.status(400).json({message:"Status not Allowed"});
        }
        const NloggedInUserId=loggedInUserId._id.toString();
        const connectionRequest=await ConnectionRequest.findOne({_id:requestId,toUserId:NloggedInUserId,status:"Interested"});
        if(!connectionRequest){
            return res.status(404).json({message:"Connection Request Not Found"});
        }
        connectionRequest.status=status;

        await connectionRequest.save();
        res.status(200).json({
            status_code:200,
            message:"Request Reviewed"});
        
        //is manish===touserID
        // status===interested
        // requestId=1234
        // requstid is correct or not


    }
    catch(error){
        res.status(500).send(error.message);
    }   
});
module.exports = requestRouter;