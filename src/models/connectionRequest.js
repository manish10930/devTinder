const mongoose=require("mongoose")

const connectionRequestSchema=new mongoose.Schema({
 
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        Enum:["Ignored","Interested"],
        message:`{VALUE} is not a valid status`,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    

},{timestamps:true})


const ConnectionRequest=mongoose.model("ConnectionRequest",connectionRequestSchema)
module.exports=ConnectionRequest;