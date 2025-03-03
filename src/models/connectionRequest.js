const mongoose=require("mongoose")

const connectionRequestSchema=new mongoose.Schema({
 
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
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

connectionRequestSchema.index({fromUserId:1,toUserId:1},{unique:true})
//  connectionRequestSchema.pre("save",async function(next){
//     const connectionRequest=this;
//     if(connectionRequest.fromUserId.equals(connectionRequest.toUserId))
//     {
//         throw new Error("You can not send request to yourself");
//     }
//     next()
//  })
const ConnectionRequest=mongoose.model("ConnectionRequest",connectionRequestSchema)
module.exports=ConnectionRequest;