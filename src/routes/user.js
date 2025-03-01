const express = require("express");
const userAuth = require("../middlewares/auth");
const connectionsRequest = require("../models/connectionRequest");
const userRouter = express.Router();

userRouter.get("/user/requests/received",userAuth ,  async (req, res) => {
    const user=req.user;

    try {
        const requests=await connectionsRequest.find({toUserId:user._id, status:"Interested"});
        res.status(200).json({message:"Requests fetched successfully",data:requests});
        
        

    }
    catch(error)
    {
        res.status(500).send(error.message)
    }
}); 

module.exports=userRouter; 